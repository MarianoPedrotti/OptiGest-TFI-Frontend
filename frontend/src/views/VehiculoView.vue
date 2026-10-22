<template>

<Card>

    <PageHeader
        titulo="Vehículos"
        subtitulo="Administración de Vehículos"
    >
        <PrimaryButton @click="nuevoVehiculo">
            Nuevo Vehículo
        </PrimaryButton>
    </PageHeader>

    <VehiculoStats />
    <div class="row g-3 mb-4">

    <div class="col-md-8">

        <BaseInput
            label="Buscar"
            placeholder="Marca, modelo, patente, VIN, motor, color o año..."
            v-model="busqueda"
        />

    </div>


    <div class="col-md-4">

        <SelectInput
            label="Estado"
            v-model="estadoFiltro"
        >

            <option value="">
                Todos
            </option>

            <option value="Disponible">
                Disponible
            </option>

            <option value="Vendido">
                Vendido
            </option>

        </SelectInput>

    </div>

</div>

    <VehiculoTable
    :vehiculos="vehiculosFiltrados"
    @editar="editarVehiculo"
    @eliminar="solicitarEliminarVehiculo"
/>



    <ConfirmModal
        :visible="confirmarEliminarVisible"
        titulo="Eliminar vehículo"
        mensaje="¿Está seguro de que desea eliminar este vehículo?"
        @confirmar="confirmarEliminarVehiculo"
        @cancelar="cancelarEliminarVehiculo"
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

import {computed, onMounted, ref } from "vue";

import { useVehiculoStore } from "../stores/vehiculoStore";
import BaseInput from "../components/base/BaseInput.vue";
import SelectInput from "../components/forms/SelectInput.vue";
import { useRouter } from "vue-router";


import type {
    Vehiculo
} from "../types/vehiculo";
import VehiculoTable from "../components/vehiculo/VehiculoTable.vue";
import VehiculoStats from "../components/vehiculo/VehiculoStats.vue";

import Card from "../components/cards/Card.vue";
import PageHeader from "../components/page/PageHeader.vue";
import PrimaryButton from "../components/buttons/PrimaryButton.vue";
import ConfirmModal from "../components/alerts/ConfirmModal.vue";
import ToastAlert from "../components/alerts/ToastAlert.vue";


const router = useRouter();

const vehiculoStore = useVehiculoStore();


// Filtros
// ==========================

const busqueda = ref("");

const estadoFiltro = ref("");


// ==========================
// Vehículos filtrados
// ==========================

const vehiculosFiltrados = computed(() => {

    const texto =
        busqueda.value
            .trim()
            .toLowerCase();


    return vehiculoStore.vehiculos.filter(vehiculo => {

        // --------------------------
        // Búsqueda
        // --------------------------

        const coincideBusqueda =
            !texto ||

            vehiculo.marca
                ?.toLowerCase()
                .includes(texto) ||

            vehiculo.modelo
                ?.toLowerCase()
                .includes(texto) ||

            vehiculo.patente
                ?.toLowerCase()
                .includes(texto) ||

            vehiculo.vin
                ?.toLowerCase()
                .includes(texto) ||

            vehiculo.numeroMotor
                ?.toLowerCase()
                .includes(texto) ||

            vehiculo.color
                ?.toLowerCase()
                .includes(texto) ||

            vehiculo.anio
                .toString()
                .includes(texto);


        // --------------------------
        // Estado
        // --------------------------

        const coincideEstado =
            !estadoFiltro.value ||

            vehiculo.estado ===
                estadoFiltro.value;


        return (
            coincideBusqueda &&
            coincideEstado
        );

    });

});

// ==========================
// Toast
// ==========================

const alertaVisible = ref(false);

const alertaTipo =
    ref<"success" | "error" | "warning" | "info">("success");

const alertaTitulo = ref("");

const alertaMensaje = ref("");


function mostrarAlerta(
    tipo: "success" | "error" | "warning" | "info",
    titulo: string,
    mensaje: string
) {

    alertaTipo.value = tipo;
    alertaTitulo.value = titulo;
    alertaMensaje.value = mensaje;
    alertaVisible.value = true;

    setTimeout(() => {
        alertaVisible.value = false;
    }, 3500);

}


// ==========================
// Confirmar eliminación
// ==========================

const confirmarEliminarVisible = ref(false);

const vehiculoEliminarId =
    ref<number | null>(null);


function solicitarEliminarVehiculo(id: number) {

    vehiculoEliminarId.value = id;

    confirmarEliminarVisible.value = true;

}


async function confirmarEliminarVehiculo() {

    if (!vehiculoEliminarId.value)
        return;

    try {

        await vehiculoStore.eliminar(
            vehiculoEliminarId.value
        );

        await cargarDatos();

        mostrarAlerta(
            "success",
            "Vehículo eliminado",
            "El vehículo se eliminó correctamente."
        );

    }
    catch (error) {

        console.error(error);

        mostrarAlerta(
            "error",
            "No se pudo eliminar",
            obtenerMensajeError(
                error,
                "No se pudo eliminar el vehículo."
            )
        );

    }
    finally {

        cancelarEliminarVehiculo();

    }

}


function cancelarEliminarVehiculo() {

    confirmarEliminarVisible.value = false;

    vehiculoEliminarId.value = null;

}


// ==========================
// Carga
// ==========================

onMounted(async () => {

    try {

        await cargarDatos();

    }
    catch (error) {

        console.error(error);

        mostrarAlerta(
            "error",
            "Error",
            "No se pudieron cargar los vehículos."
        );

    }

});


async function cargarDatos() {

    await Promise.all([
        vehiculoStore.cargarVehiculos(),
        vehiculoStore.cargarResumen()
    ]);

}


// ==========================
// Nuevo / editar
// ==========================
function nuevoVehiculo() {

    router.push({
        name: "nuevo-vehiculo"
    });

}


function editarVehiculo(
    vehiculo: Vehiculo
) {

    router.push({

        name: "editar-vehiculo",

        params: {
            id: vehiculo.id
        }

    });

}


// ==========================
// Guardar
// ==========================





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