<template>

<div class="container-fluid px-0">

<div class="mb-3">
<BackButton
    texto="Volver a la venta"
    :ruta="rutaVenta"
/>

</div>


    <h3 class="mb-4">
        Registrar Pago
    </h3>


    <div
        v-if="venta"
        class="row g-3 mb-3"
    >

        <div class="col-12 col-sm-6">

            <strong>Cliente:</strong>

            {{ venta.nombreCliente }}

        </div>


        <div class="col-12 col-sm-6">

            <strong>Vehículo:</strong>

            {{ venta.nombreVehiculo || "Sin vehículo" }}

        </div>


        <div class="col-12 col-sm-6">

            <strong>Total de la venta:</strong>

            ${{ venta.total.toLocaleString("es-AR") }}

        </div>


        <div class="col-12 col-sm-6">

            <strong>Saldo pendiente:</strong>

            ${{
                venta.saldoPendiente
                    .toLocaleString("es-AR")
            }}

        </div>

    </div>


    <div v-if="errorCarga" class="alert alert-danger">
        {{ errorCarga }}
    </div>

    <div v-else-if="venta && !puedePagarDirectamente" class="alert alert-warning">
        No se pueden registrar pagos directos para esta venta. Revisá su financiación o su saldo pendiente.
    </div>

    <div v-else-if="resultadoDesconocido" class="alert alert-warning">
        El servidor no pudo confirmar el resultado del pago. Consultá el estado de la venta antes de intentarlo nuevamente.
    </div>


    <div v-if="venta && puedePagarDirectamente" class="row g-3">

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


    <div class="col-12 col-md-6">

        <BaseInput
            label="Monto a pagar"
            type="number"
            min="0"
            v-model="monto"
        />

    </div>

    </div>


    <div v-if="venta && puedePagarDirectamente" class="responsive-actions justify-content-start mt-3">

    <PrimaryButton :disabled="guardando || resultadoDesconocido" @click="solicitarConfirmacion">

        {{ guardando ? "Guardando..." : "Confirmar Pago" }}

    </PrimaryButton>

    </div>


    <ConfirmModal
        :visible="confirmarVisible"
        titulo="Confirmar pago"
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

import type {
    Venta
} from "../types/venta";

import ventaService from "../services/ventaService";
import pagoVentaService from "../services/pagoVentaService";

import SelectInput from "../components/forms/SelectInput.vue";
import PrimaryButton from "../components/buttons/PrimaryButton.vue";
import BackButton from "../components/buttons/BackButton.vue";

import BaseInput from "../components/base/BaseInput.vue";

import ConfirmModal from "../components/alerts/ConfirmModal.vue";
import ToastAlert from "../components/alerts/ToastAlert.vue";
import {
    getApiErrorCode,
    getApiErrors,
    getApiStatus
} from "../utils/formErrors";
import { puedeRegistrarPagoDirecto } from "../utils/ventaElegibilidad";


const route = useRoute();

const router = useRouter();


const venta =
    ref<Venta | null>(null);

const formaPago =
    ref("");

const monto =
    ref(0);

const guardando = ref(false);

const resultadoDesconocido = ref(false);

const errorCarga = ref("");

const puedePagarDirectamente = computed(() => venta.value !== null &&
    puedeRegistrarPagoDirecto(venta.value));

    const rutaVenta = computed(() => {

    if (!venta.value)
        return "/ventas";

    return `/ventas/${venta.value.id}`;

});


// ==========================
// Confirmación
// ==========================

const confirmarVisible =
    ref(false);


const mensajeConfirmacion =
    computed(() => {

        return (
            `¿Confirmar pago de $${Number(monto.value)
                .toLocaleString("es-AR")} `
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

async function cargarVenta() {

    errorCarga.value = "";

    try {
        const id =
            Number(route.params.id);

        venta.value =
            await ventaService.obtenerPorId(id);

        monto.value =
            venta.value.saldoPendiente;
    }
    catch (error) {
        console.error(error);
        errorCarga.value = "No se pudo cargar la venta.";
    }

}

onMounted(cargarVenta);


// ==========================
// Validación
// ==========================

function solicitarConfirmacion() {

    if (!venta.value)
        return;


    if (!puedePagarDirectamente.value) {
        mostrarAlerta(
            "warning",
            "Pago no disponible",
            "La venta tiene financiación o ya no posee saldo pendiente."
        );
        return;
    }

    if (resultadoDesconocido.value) {
        mostrarAlerta(
            "warning",
            "Resultado pendiente de confirmar",
            "Consultá el estado de la venta antes de intentar otro pago."
        );
        return;
    }


    if (formaPago.value === "") {

        mostrarAlerta(
            "warning",
            "Forma de pago requerida",
            "Seleccione una forma de pago."
        );

        return;

    }


    if (Number(monto.value) <= 0) {

        mostrarAlerta(
            "warning",
            "Monto inválido",
            "Ingrese un monto válido."
        );

        return;

    }


    if (
        Number(monto.value) >
        venta.value.saldoPendiente
    ) {

        mostrarAlerta(
            "warning",
            "Monto inválido",
            "El monto supera el saldo pendiente."
        );

        return;

    }


    confirmarVisible.value = true;

}


// ==========================
// Registrar pago
// ==========================

async function confirmarPago() {

    if (!venta.value || !puedePagarDirectamente.value || guardando.value || resultadoDesconocido.value)
        return;


    confirmarVisible.value = false;

    guardando.value = true;


    try {

        await pagoVentaService.crear({

            ventaId:
                venta.value.id,

            formaPago:
                formaPago.value,

            monto:
                Number(monto.value)

        });


        mostrarAlerta(
            "success",
            "Pago registrado",
            "El pago se registró correctamente."
        );


        setTimeout(() => {

            router.push("/ventas");

        }, 900);

    }
    catch (error) {

        console.error(error);

        const { general } = getApiErrors(error);
        const status = getApiStatus(error);
        const code = getApiErrorCode(error);

        if (status === 409) {
            await cargarVenta();
            mostrarAlerta(
                "warning",
                "La venta cambió",
                general || "La venta cambió mientras registrabas el pago. Revisá su estado antes de intentar nuevamente."
            );
        }
        else if (code === "resultado_no_confirmado" || status === undefined) {
            resultadoDesconocido.value = true;
            await cargarVenta();
            mostrarAlerta(
                "warning",
                "Resultado pendiente de confirmar",
                general || "El servidor no pudo confirmar el resultado. Consultá la venta antes de volver a intentarlo."
            );
        }
        else {
            mostrarAlerta(
                "error",
                "No se pudo registrar el pago",
                general || "Ocurrió un error al registrar el pago."
            );
        }

        guardando.value = false;

    }

}


</script>
