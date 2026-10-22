<template>

<div class="container-fluid">
<div class="mb-3">

    <BackButton
        texto="Volver a configuración"
    ruta="/configuracion"
    />

</div>

    <PageHeader
        titulo="Configuración de financiación"
        subtitulo="Administración de planes y condiciones de financiación"
    />


    <div class="row g-4">

        <!-- ========================= -->
        <!-- FORMULARIO -->
        <!-- ========================= -->

        <div class="col-lg-4">

            <Card>

                <div class="mb-4">

                    <h5 class="fw-bold mb-1">

                        {{
                            form.id
                                ? "Editar configuración"
                                : "Nueva configuración"
                        }}

                    </h5>

                    <small class="text-muted">
                        Defina las condiciones disponibles
                        para financiar ventas.
                    </small>

                </div>


                <div class="row g-3">

                    <div class="col-12">

                        <BaseInput
                            label="Cantidad de cuotas"
                            type="number"
                            min="1"
                            v-model="form.cantidadCuotas"
                        />

                    </div>


                    <div class="col-12">

                        <BaseInput
                            label="Tasa de interés (%)"
                            type="number"
                            min="0"
                            step="0.01"
                            v-model="form.tasaInteres"
                        />

                    </div>


                    <div class="col-12">

                        <BaseInput
                            label="Monto mínimo"
                            type="number"
                            min="0"
                            v-model="form.montoMinimo"
                        />

                    </div>


                    <div class="col-12">

                        <BaseInput
                            label="Monto máximo"
                            type="number"
                            min="1"
                            v-model="form.montoMaximo"
                        />

                    </div>


                    <div
                        v-if="form.id"
                        class="col-12"
                    >

                        <div class="form-check form-switch">

                            <input
                                id="configuracionActiva"
                                v-model="form.activa"
                                class="form-check-input"
                                type="checkbox"
                            >

                            <label
                                class="form-check-label"
                                for="configuracionActiva"
                            >
                                Configuración activa
                            </label>

                        </div>

                    </div>

                </div>


                <div
                    class="responsive-actions mt-4"
                >

                    <button
                        v-if="form.id"
                        class="btn btn-outline-secondary"
                        @click="cancelarEdicion"
                    >
                        Cancelar
                    </button>


                    <button
                        class="btn btn-primary"
                        @click="guardar"
                    >

                        <i
                            :class="
                                form.id
                                    ? 'bi bi-check-lg'
                                    : 'bi bi-plus-lg'
                            "
                            class="me-1"
                        ></i>

                        {{
                            form.id
                                ? "Guardar cambios"
                                : "Crear configuración"
                        }}

                    </button>

                </div>

            </Card>

        </div>


        <!-- ========================= -->
        <!-- LISTADO -->
        <!-- ========================= -->

        <div class="col-lg-8">

            <Card>

                <div
                    class="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-3"
                >

                    <div>

                        <h5 class="fw-bold mb-1">
                            Planes disponibles
                        </h5>

                        <small class="text-muted">
                            Configuraciones actuales de financiación.
                        </small>

                    </div>

                    <i class="bi bi-bank fs-4 text-muted"></i>

                </div>


                <div class="table-responsive">

                    <table class="table align-middle">

                        <thead class="table-light">

                            <tr>

                                <th>Cuotas</th>

                                <th>Interés</th>

                                <th>Monto mínimo</th>

                                <th>Monto máximo</th>

                                <th>Estado</th>

                                <th class="text-end">
                                    Acciones
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            <tr
                                v-for="config in store.configuraciones"
                                :key="config.id"
                            >

                                <td>

                                    <span class="fw-bold">

                                        {{ config.cantidadCuotas }}

                                    </span>

                                </td>


                                <td>

                                    {{ config.tasaInteres }}%

                                </td>


                                <td>

                                    ${{
                                        config.montoMinimo
                                            .toLocaleString("es-AR")
                                    }}

                                </td>


                                <td>

                                    ${{
                                        config.montoMaximo
                                            .toLocaleString("es-AR")
                                    }}

                                </td>


                                <td>

                                    <span
                                        v-if="config.activa"
                                        class="badge bg-success"
                                    >
                                        Activa
                                    </span>

                                    <span
                                        v-else
                                        class="badge bg-secondary"
                                    >
                                        Inactiva
                                    </span>

                                </td>


                                <td class="text-end">

                                    <button
                                        class="btn btn-sm btn-outline-primary me-2"
                                        @click="editar(config)"
                                    >

                                        <i class="bi bi-pencil"></i>

                                    </button>


                                    <button
                                        class="btn btn-sm btn-outline-danger"
                                        @click="solicitarEliminar(config)"
                                    >

                                        <i class="bi bi-trash"></i>

                                    </button>

                                </td>

                            </tr>


                            <tr
                                v-if="
                                    store.configuraciones.length === 0
                                "
                            >

                                <td
                                    colspan="6"
                                    class="text-center text-muted py-4"
                                >

                                    No hay configuraciones registradas.

                                </td>

                            </tr>

                        </tbody>

                    </table>

                </div>

            </Card>

        </div>

    </div>


    <ConfirmModal
        :visible="confirmarEliminarVisible"
        titulo="Eliminar configuración"
        mensaje="¿Está seguro de que desea eliminar esta configuración? Si ya fue utilizada en una financiación, deberá desactivarla en lugar de eliminarla."
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

</div>

</template>


<script setup lang="ts">

import { onMounted, reactive, ref } from "vue";
import BackButton from "../../components/buttons/BackButton.vue";

import Card from "../../components/cards/Card.vue";
import PageHeader from "../../components/page/PageHeader.vue";
import BaseInput from "../../components/base/BaseInput.vue";

import ToastAlert from "../../components/alerts/ToastAlert.vue";
import ConfirmModal from "../../components/alerts/ConfirmModal.vue";

import {
    useConfiguracionFinanciacionStore
} from "../../stores/configuracionFinanciacionStore";

import type {
    ConfiguracionFinanciacion
} from "../../types/ConfiguracionFinanciacion";


const store =
    useConfiguracionFinanciacionStore();


// ==========================
// Formulario
// ==========================

const form = reactive({

    id: 0,

    cantidadCuotas: 1,

    tasaInteres: 0,

    montoMinimo: 0,

    montoMaximo: 0,

    activa: true

});


onMounted(async () => {

    try {

        await store.cargarConfiguraciones();

    }
    catch (error) {

        console.error(error);

        mostrarAlerta(
            "error",
            "Error",
            "No se pudieron cargar las configuraciones."
        );

    }

});


function editar(
    configuracion: ConfiguracionFinanciacion
) {

    form.id =
        configuracion.id;

    form.cantidadCuotas =
        configuracion.cantidadCuotas;

    form.tasaInteres =
        configuracion.tasaInteres;

    form.montoMinimo =
        configuracion.montoMinimo;

    form.montoMaximo =
        configuracion.montoMaximo;

    form.activa =
        configuracion.activa;

}


function cancelarEdicion() {

    form.id = 0;

    form.cantidadCuotas = 1;

    form.tasaInteres = 0;

    form.montoMinimo = 0;

    form.montoMaximo = 0;

    form.activa = true;

}


// ==========================
// Guardar
// ==========================

async function guardar() {

    const cantidadCuotas =
        Number(form.cantidadCuotas);

    const tasaInteres =
        Number(form.tasaInteres);

    const montoMinimo =
        Number(form.montoMinimo);

    const montoMaximo =
        Number(form.montoMaximo);


    if (cantidadCuotas <= 0) {

        mostrarAlerta(
            "warning",
            "Cantidad inválida",
            "La cantidad de cuotas debe ser mayor a cero."
        );

        return;

    }


    if (tasaInteres < 0) {

        mostrarAlerta(
            "warning",
            "Interés inválido",
            "La tasa de interés no puede ser negativa."
        );

        return;

    }


    if (montoMinimo < 0) {

        mostrarAlerta(
            "warning",
            "Monto inválido",
            "El monto mínimo no puede ser negativo."
        );

        return;

    }


    if (montoMaximo <= 0) {

        mostrarAlerta(
            "warning",
            "Monto inválido",
            "El monto máximo debe ser mayor a cero."
        );

        return;

    }


    if (montoMaximo < montoMinimo) {

        mostrarAlerta(
            "warning",
            "Rango inválido",
            "El monto máximo no puede ser menor al monto mínimo."
        );

        return;

    }


    try {

        if (form.id) {

            await store.actualizar({

                id:
                    form.id,

                cantidadCuotas,

                tasaInteres,

                montoMinimo,

                montoMaximo,

                activa:
                    form.activa

            });


            mostrarAlerta(
                "success",
                "Configuración actualizada",
                "La configuración se actualizó correctamente."
            );

        }
        else {

            await store.crear({

                cantidadCuotas,

                tasaInteres,

                montoMinimo,

                montoMaximo

            });


            mostrarAlerta(
                "success",
                "Configuración creada",
                "La configuración se creó correctamente."
            );

        }


        cancelarEdicion();

    }
    catch (error) {

        console.error(error);

        mostrarAlerta(
            "error",
            "Error",
            obtenerMensajeError(
                error,
                "No se pudo guardar la configuración."
            )
        );

    }

}


// ==========================
// Eliminar
// ==========================

const confirmarEliminarVisible =
    ref(false);

const idEliminar =
    ref<number | null>(null);


function solicitarEliminar(
    configuracion: ConfiguracionFinanciacion
) {

    idEliminar.value =
        configuracion.id;

    confirmarEliminarVisible.value =
        true;

}


async function confirmarEliminar() {

    if (!idEliminar.value)
        return;


    try {

        await store.eliminar(
            idEliminar.value
        );


        mostrarAlerta(
            "success",
            "Configuración eliminada",
            "La configuración se eliminó correctamente."
        );

    }
    catch (error) {

        console.error(error);

        mostrarAlerta(
            "warning",
            "No se puede eliminar",
            obtenerMensajeError(
                error,
                "La configuración puede estar siendo utilizada. Desactívela en lugar de eliminarla."
            )
        );

    }
    finally {

        cancelarEliminar();

    }

}


function cancelarEliminar() {

    confirmarEliminarVisible.value =
        false;

    idEliminar.value =
        null;

}


// ==========================
// Toast
// ==========================

const alertaVisible =
    ref(false);

const alertaTipo =
    ref<
        "success" |
        "error" |
        "warning" |
        "info"
    >("success");

const alertaTitulo =
    ref("");

const alertaMensaje =
    ref("");

let timeoutAlerta:
    ReturnType<typeof setTimeout> |
    null = null;


function mostrarAlerta(
    tipo:
        "success" |
        "error" |
        "warning" |
        "info",
    titulo: string,
    mensaje: string
) {

    if (timeoutAlerta) {

        clearTimeout(
            timeoutAlerta
        );

    }


    alertaTipo.value =
        tipo;

    alertaTitulo.value =
        titulo;

    alertaMensaje.value =
        mensaje;

    alertaVisible.value =
        true;


    timeoutAlerta =
        setTimeout(() => {

            alertaVisible.value =
                false;

        }, 3500);

}


// ==========================
// Error API
// ==========================

function obtenerMensajeError(
    error: any,
    mensajeDefault: string
) {

    const data =
        error?.response?.data;


    if (typeof data === "string") {

        return data;

    }


    if (data?.message) {

        return data.message;

    }


    return mensajeDefault;

}

</script>
