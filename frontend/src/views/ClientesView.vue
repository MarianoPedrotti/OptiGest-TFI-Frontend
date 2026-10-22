<template>

<Card>

    <PageHeader
        titulo="Clientes"
        subtitulo="Administración de clientes"
    >
        <PrimaryButton @click="nuevoCliente">
            Nuevo Cliente
        </PrimaryButton>
    </PageHeader>

    <ClienteStats />
    <div class="row g-3 mb-4">

    <div class="col-md-6">

        <BaseInput
            label="Buscar"
            placeholder="Nombre, DNI, email o teléfono..."
            v-model="busqueda"
        />

    </div>

</div>

    <ClienteTable
    :clientes="clientesFiltrados"
    @editar="editarCliente"
    @eliminar="solicitarEliminarCliente"
/>

    <BaseModal
        :show="modalVisible"
        :title="clienteSeleccionado ? 'Editar Cliente' : 'Nuevo Cliente'"
        @close="cerrarModal"
    >
        <ClienteForm
            :cliente="clienteSeleccionado"
            @guardar="guardarCliente"
        />
    </BaseModal>

    <ConfirmModal
        :visible="confirmarEliminarVisible"
        titulo="Eliminar cliente"
        mensaje="¿Está seguro de que desea eliminar este cliente?"
        @confirmar="confirmarEliminarCliente"
        @cancelar="cancelarEliminarCliente"
    />

    <ToastAlert
        :visible="alertaVisible"
        :tipo="alertaTipo"
        :titulo="alertaTitulo"
        :mensaje="alertaMensaje"
        @close="alertaVisible = false"
    />

</Card>

</template>

<script setup lang="ts">
import BaseInput from "../components/base/BaseInput.vue";

import { onMounted, ref, computed } from "vue";

import type {
    ClienteCreateDto,
    ClienteUpdateDto
} from "../types/cliente";

import { useClienteStore } from "../stores/clienteStore";

import ClienteForm from "../components/clientes/ClienteForm.vue";
import ClienteTable from "../components/clientes/ClienteTable.vue";
import ClienteStats from "../components/clientes/ClienteStats.vue";

import Card from "../components/cards/Card.vue";
import PrimaryButton from "../components/buttons/PrimaryButton.vue";
import PageHeader from "../components/page/PageHeader.vue";
import BaseModal from "../components/base/BaseModal.vue";

import ConfirmModal from "../components/alerts/ConfirmModal.vue";
import ToastAlert from "../components/alerts/ToastAlert.vue";


const clienteStore = useClienteStore();
// ==========================
// Filtros
// ==========================

const busqueda = ref("");


const clientesFiltrados = computed(() => {

    const texto =
        busqueda.value
            .trim()
            .toLowerCase();


    if (!texto)
        return clienteStore.clientes;


    return clienteStore.clientes.filter(cliente => {

        return (
            cliente.nombre
                ?.toLowerCase()
                .includes(texto) ||

            cliente.dni
                ?.toLowerCase()
                .includes(texto) ||

            cliente.email
                ?.toLowerCase()
                .includes(texto) ||

            cliente.telefono
                ?.toLowerCase()
                .includes(texto)
        );

    });

});

const modalVisible = ref(false);

const clienteSeleccionado =
    ref<ClienteUpdateDto | null>(null);


// ==========================
// Toast
// ==========================

const alertaVisible = ref(false);

const alertaTipo =
    ref<"success" | "error" | "warning" | "info">("success");

const alertaTitulo = ref("");

const alertaMensaje = ref("");

let alertaTimeout:
    ReturnType<typeof setTimeout> | null = null;


function mostrarAlerta(
    tipo: "success" | "error" | "warning" | "info",
    titulo: string,
    mensaje: string
) {

    if (alertaTimeout) {
        clearTimeout(alertaTimeout);
    }

    alertaTipo.value = tipo;
    alertaTitulo.value = titulo;
    alertaMensaje.value = mensaje;
    alertaVisible.value = true;

    alertaTimeout = setTimeout(() => {
        alertaVisible.value = false;
    }, 3500);

}


// ==========================
// Confirmar eliminación
// ==========================

const confirmarEliminarVisible = ref(false);

const clienteEliminarId =
    ref<number | null>(null);


function solicitarEliminarCliente(id: number) {

    clienteEliminarId.value = id;

    confirmarEliminarVisible.value = true;

}


async function confirmarEliminarCliente() {

    if (!clienteEliminarId.value)
        return;

    try {

        await clienteStore.eliminar(
            clienteEliminarId.value
        );

        await clienteStore.cargarResumen();

        mostrarAlerta(
            "success",
            "Cliente eliminado",
            "El cliente se eliminó correctamente."
        );

    }
    catch (error) {

        console.error(error);

        mostrarAlerta(
            "error",
            "No se pudo eliminar",
            obtenerMensajeError(
                error,
                "No se pudo eliminar el cliente."
            )
        );

    }
    finally {

        cancelarEliminarCliente();

    }

}


function cancelarEliminarCliente() {

    confirmarEliminarVisible.value = false;

    clienteEliminarId.value = null;

}


// ==========================
// Carga inicial
// ==========================

onMounted(async () => {

    try {

        await Promise.all([
            clienteStore.obtenerTodos(),
            clienteStore.cargarResumen()
        ]);

    }
    catch (error) {

        console.error(error);

        mostrarAlerta(
            "error",
            "Error",
            "No se pudieron cargar los clientes."
        );

    }

});


// ==========================
// Nuevo / editar
// ==========================

function nuevoCliente() {

    clienteSeleccionado.value = null;

    modalVisible.value = true;

}


function editarCliente(
    cliente: ClienteUpdateDto
) {

    clienteSeleccionado.value = cliente;

    modalVisible.value = true;

}


// ==========================
// Guardar
// ==========================

async function guardarCliente(
    cliente: ClienteCreateDto | ClienteUpdateDto
) {

    try {

        if ("id" in cliente) {

            await clienteStore.actualizar(cliente);

            mostrarAlerta(
                "success",
                "Cliente actualizado",
                "Los datos del cliente se actualizaron correctamente."
            );

        }
        else {

            await clienteStore.crear(cliente);

            await clienteStore.cargarResumen();

            mostrarAlerta(
                "success",
                "Cliente creado",
                "El cliente se registró correctamente."
            );

        }

        modalVisible.value = false;

        clienteSeleccionado.value = null;

        await clienteStore.obtenerTodos(true);

    }
    catch (error) {

        console.error(error);

        mostrarAlerta(
            "error",
            "Error",
            obtenerMensajeError(
                error,
                "No se pudo guardar el cliente."
            )
        );

    }

}


function cerrarModal() {

    modalVisible.value = false;

    clienteSeleccionado.value = null;

}


// ==========================
// Error API
// ==========================

function obtenerMensajeError(
    error: any,
    mensajeDefault: string
) {

    const data = error?.response?.data;

    if (typeof data === "string")
        return data;

    if (data?.message)
        return data.message;

    return mensajeDefault;

}

</script>