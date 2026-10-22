<template>

<div class="container-fluid">
    <div class="mb-3">

    <BackButton
        texto="Volver a configuración"
    ruta="/configuracion"
    />

</div>

    <PageHeader
        titulo="Usuarios"
        subtitulo="Administración de vendedores"
    >

        <PrimaryButton @click="nuevoVendedor">

            <i class="bi bi-person-plus me-1"></i>

            Nuevo vendedor

        </PrimaryButton>

    </PageHeader>


    <Card>

        <div class="mb-3">

            <h5 class="fw-bold mb-1">
                Vendedores
            </h5>

            <small class="text-muted">
                Usuarios habilitados para operar el sistema.
            </small>

        </div>


        <div class="table-responsive">

            <table class="table align-middle">

                <thead class="table-light">

                    <tr>

                        <th>Nombre</th>

                        <th>Email</th>

                        <th>Rol</th>

                        <th class="text-end">
                            Comisión
                        </th>

                        <th class="text-end">
                            Acciones
                        </th>

                    </tr>

                </thead>


                <tbody>

                    <tr
                        v-for="usuario in usuarioStore.usuarios"
                        :key="usuario.id"
                    >

                        <td>

                            <div class="fw-semibold">

                                {{ usuario.nombre }}
                                {{ usuario.apellido }}

                            </div>

                        </td>


                        <td>
                            {{ usuario.email }}
                        </td>


                        <td>

                            <span class="badge bg-secondary">

                                {{ usuario.role }}

                            </span>

                        </td>


                        <td class="text-end">

                            {{ usuario.comision }}%

                        </td>


                        <td class="text-end">

                            <button
                                class="btn btn-sm btn-outline-primary me-2"
                                @click="editarUsuario(usuario.id)"
                            >

                                <i class="bi bi-pencil"></i>

                            </button>


                            <button
                                class="btn btn-sm btn-outline-danger"
                                @click="eliminarUsuario(usuario.id)"
                            >

                                <i class="bi bi-trash"></i>

                            </button>

                        </td>

                    </tr>


                    <tr
                        v-if="
                            usuarioStore.usuarios.length === 0
                        "
                    >

                        <td
                            colspan="5"
                            class="text-center text-muted py-4"
                        >

                            No hay vendedores registrados.

                        </td>

                    </tr>

                </tbody>

            </table>

        </div>

    </Card>

</div>
<ConfirmModal
    :visible="confirmarEliminarVisible"
    titulo="Eliminar vendedor"
    mensaje="¿Está seguro de que desea eliminar este vendedor?"
    @confirmar="confirmarEliminar"
    @cancelar="cancelarEliminar"
/>

<ToastAlert
    :visible="alertaVisible"
    :tipo="alertaTipo"
    :titulo="alertaTitulo"
    :mensaje="alertaMensaje"
    @close="alertaVisible = false"
/>

</template>

<script setup lang="ts">

import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { ref } from "vue";

import ConfirmModal from "../../components/alerts/ConfirmModal.vue";
import ToastAlert from "../../components/alerts/ToastAlert.vue";
import BackButton from "../../components/buttons/BackButton.vue";

import Card from "../../components/cards/Card.vue";
import PageHeader from "../../components/page/PageHeader.vue";
import PrimaryButton from "../../components/buttons/PrimaryButton.vue";

import { useUsuarioStore } from "../../stores/usuarioStore.ts";


const router = useRouter();

const usuarioStore =
    useUsuarioStore();


onMounted(async () => {

    await usuarioStore.cargarUsuarios();

});


function nuevoVendedor() {

    router.push(
        "/configuracion/usuarios/nuevo"
    );

}


function editarUsuario(id: number) {

    router.push(
        `/configuracion/usuarios/${id}/editar`
    );

}


function eliminarUsuario(id: number) {

    usuarioEliminarId.value = id;

    confirmarEliminarVisible.value = true;

}
async function confirmarEliminar() {

    if (!usuarioEliminarId.value)
        return;

    try {

        await usuarioStore.eliminar(
            usuarioEliminarId.value
        );

        confirmarEliminarVisible.value =
            false;

        usuarioEliminarId.value =
            null;

        mostrarAlerta(
            "success",
            "Vendedor eliminado",
            "El vendedor fue eliminado correctamente."
        );

    }
    catch (error) {

        console.error(error);

        confirmarEliminarVisible.value =
            false;

        mostrarAlerta(
            "error",
            "Error",
            "No se pudo eliminar el vendedor."
        );

    }

}


function cancelarEliminar() {

    confirmarEliminarVisible.value =
        false;

    usuarioEliminarId.value =
        null;

}
const confirmarEliminarVisible = ref(false);

const usuarioEliminarId =
    ref<number | null>(null);


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

}

</script>