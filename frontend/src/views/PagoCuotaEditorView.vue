<template>

<div class="container-fluid px-0">

    <div class="mb-3">
    <BackButton
    texto="Volver a cuotas"
    :ruta="rutaCuotas"
/>

    </div>


    <h3 class="mb-4">
        Registrar Pago de Cuota
    </h3>


    <div
        v-if="cuota"
        class="row g-3 mb-3"
    >

        <div class="col-12 col-sm-6">

            <strong>Cliente:</strong>

            {{ cuota.nombreCliente }}

        </div>


        <div class="col-12 col-sm-6">

            <strong>Cuota:</strong>

            {{ cuota.numero }}

        </div>


        <div class="col-12 col-sm-6">

            <strong>Vencimiento:</strong>

            {{
                new Date(
                    cuota.fechaVencimiento
                ).toLocaleDateString("es-AR")
            }}

        </div>


        <div class="col-12 col-sm-6">

            <strong>Monto:</strong>

            ${{ cuota.monto.toLocaleString("es-AR") }}

        </div>

    </div>


    <div class="row g-3">

    <div class="col-12 col-md-6">

        <SelectInput
            label="Forma de pago"
            v-model="formaPago"
        >

            <option value="">
                Seleccione...
            </option>

            <option value="Efectivo">
                Efectivo
            </option>

            <option value="Transferencia">
                Transferencia
            </option>

            <option value="Tarjeta">
                Tarjeta
            </option>

            <option value="Cheque">
                Cheque
            </option>

        </SelectInput>

    </div>

    </div>


    <div class="responsive-actions justify-content-start mt-3">

    <PrimaryButton :disabled="guardando" @click="solicitarConfirmacion">

        {{ guardando ? "Guardando..." : "Confirmar Pago" }}

    </PrimaryButton>

    </div>


    <ConfirmModal
        :visible="confirmarVisible"
        titulo="Confirmar pago de cuota"
        :mensaje="mensajeConfirmacion"
        @confirmar="confirmarPago"
        @cancelar="confirmarVisible = false"
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

import {
    computed,
    onMounted,
    ref
} from "vue";

import {
    useRoute,
    useRouter
} from "vue-router";

import SelectInput from "../components/forms/SelectInput.vue";
import PrimaryButton from "../components/buttons/PrimaryButton.vue";
import BackButton from "../components/buttons/BackButton.vue";

import ConfirmModal from "../components/alerts/ConfirmModal.vue";
import ToastAlert from "../components/alerts/ToastAlert.vue";

import { useCuotaStore } from "../stores/cuotaStore";
import { useFinanciacionStore } from "../stores/financiacionStore";

import cuotaService from "../services/cuotaService";
import pagoCuotaService from "../services/pagoCuotaService";

import type {
    Cuota
} from "../types/cuota";


const route = useRoute();

const router = useRouter();

const cuotaStore =
    useCuotaStore();

const financiacionStore =
    useFinanciacionStore();


const cuota =
    ref<Cuota | null>(null);

const formaPago =
    ref("");

const guardando =
    ref(false);

const rutaCuotas = computed(() => {

    if (!cuota.value)
        return "/financiaciones";

    return `/financiaciones/${cuota.value.financiacionId}/cuotas`;

});


// ==========================
// Confirmación
// ==========================

const confirmarVisible =
    ref(false);


const mensajeConfirmacion =
    computed(() => {

        if (!cuota.value)
            return "";


        return (
            `¿Confirmar el pago de la cuota ${cuota.value.numero} `
            + `por $${cuota.value.monto.toLocaleString("es-AR")} `
            + `mediante ${formaPago.value || "forma no seleccionada"}?`
        );

    });


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


function mostrarAlerta(
    tipo:
        "success" |
        "error" |
        "warning" |
        "info",
    titulo: string,
    mensaje: string
) {

    alertaTipo.value = tipo;

    alertaTitulo.value = titulo;

    alertaMensaje.value = mensaje;

    alertaVisible.value = true;

}


// ==========================
// Carga
// ==========================

onMounted(async () => {

    const id =
        Number(route.params.id);

    cuota.value =
        await cuotaService.obtenerPorId(id);

});


// ==========================
// Validación
// ==========================

function solicitarConfirmacion() {

    if (!cuota.value || guardando.value)
        return;


    if (formaPago.value === "") {

        mostrarAlerta(
            "warning",
            "Forma de pago requerida",
            "Seleccione una forma de pago."
        );

        return;

    }


    confirmarVisible.value = true;

}


// ==========================
// Pago
// ==========================

async function confirmarPago() {

    if (!cuota.value || guardando.value)
        return;


    confirmarVisible.value = false;
    guardando.value = true;

    let pagoRegistrado = false;

    try {

        await pagoCuotaService.crear({

            cuotaId:
                cuota.value.id,

            monto:
                cuota.value.monto,

            formaPago:
                formaPago.value

        });

        pagoRegistrado = true;
        financiacionStore.invalidarDatos();

        await Promise.all([

            cuotaStore
                .cargarPorFinanciacion(
                    cuota.value.financiacionId
                ),

            financiacionStore
                .cargarListado()

        ]);


        mostrarAlerta(
            "success",
            "Pago registrado",
            "El pago de la cuota se registró correctamente."
        );


        setTimeout(() => {

            router.push(
                `/financiaciones/${cuota.value!.financiacionId}/cuotas`
            );

        }, 900);

    }
    catch (error) {

        console.error(error);

        if (pagoRegistrado) {

            mostrarAlerta(
                "warning",
                "Pago registrado",
                "El pago se registró, pero no se pudieron actualizar las financiaciones. Volvé al listado para reintentar la carga."
            );

            return;

        }

        guardando.value = false;

        mostrarAlerta(
            "error",
            "No se pudo registrar el pago",
            obtenerMensajeError(
                error,
                "Ocurrió un error al registrar el pago."
            )
        );

    }

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


    if (typeof data === "string")
        return data;


    if (data?.message)
        return data.message;


    return mensajeDefault;

}

</script>
