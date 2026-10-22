<template>

    <div class="container-fluid">
        <BackButton
    texto="Volver a ventas"
    ruta="/ventas"
/>

        <PageHeader
            titulo="Detalle de venta"
            subtitulo="Información de la venta"
        />

        <Card>

            <div v-if="cargando" class="text-center py-5">

                <div class="spinner-border text-primary"></div>

                <p class="text-muted mt-3">
                    Cargando venta...
                </p>

            </div>

            <div v-else-if="error" class="alert alert-danger">

                {{ error }}

            </div>

            <div v-else-if="venta">

    <!-- Cabecera -->
    <div class="d-flex flex-column flex-sm-row justify-content-between align-items-start gap-3 mb-4">

        <div>

            <h4 class="fw-bold mb-1">
                Venta #{{ venta.id }}
            </h4>

            <span class="text-muted">
                {{ new Date(venta.fecha).toLocaleString("es-AR") }}
            </span>

        </div>

        <div>

            <span
                v-if="venta.tieneFinanciacion"
                class="badge bg-primary fs-6"
            >
                <i class="bi bi-bank me-1"></i>
                Financiada
            </span>

            <span
                v-else-if="venta.estaPagada"
                class="badge bg-success fs-6"
            >
                <i class="bi bi-check-circle me-1"></i>
                Pagada
            </span>

            <span
                v-else
                class="badge bg-warning text-dark fs-6"
            >
                <i class="bi bi-clock me-1"></i>
                Pendiente
            </span>

        </div>

    </div>


    <!-- Información general -->
    <div class="row g-3 mb-4">

        <div class="col-md-4">

            <div class="border rounded p-3 h-100">

                <small class="text-muted">
                    Cliente
                </small>

                <div class="fw-semibold">
                    {{ venta.nombreCliente }}
                </div>

            </div>

        </div>


        <div class="col-md-4">

            <div class="border rounded p-3 h-100">

                <small class="text-muted">
                    Vendedor
                </small>

                <div class="fw-semibold">
                    {{ venta.nombreUsuario }}
                </div>

            </div>

        </div>


        <div class="col-md-4">

            <div class="border rounded p-3 h-100">

                <small class="text-muted">
                    Total de la venta
                </small>

                <div class="fw-bold text-success fs-5">
                    ${{ venta.total.toLocaleString("es-AR") }}
                </div>

            </div>

        </div>

    </div>


    <!-- Detalle -->
    <h5 class="fw-bold mb-3">
        Detalle de la venta
    </h5>


    <div class="table-responsive">

        <table class="table align-middle">

            <thead class="table-light">

                <tr>

                    <th>Producto / Vehículo</th>
                    <th class="text-center">Cantidad</th>
                    <th class="text-end">Precio unitario</th>
                    <th class="text-end">Subtotal</th>

                </tr>

            </thead>


            <tbody>

                <tr
                    v-for="detalle in venta.detalles"
                    :key="detalle.id"
                >

                    <td>

                        <div class="fw-semibold">

                            {{
                                detalle.nombreVehiculo
                                || detalle.nombreProducto
                                || "Sin descripción"
                            }}

                        </div>

                        <small
                            v-if="detalle.vehiculoId"
                            class="text-muted"
                        >
                            Vehículo
                        </small>

                        <small
                            v-else
                            class="text-muted"
                        >
                            Producto
                        </small>

                    </td>


                    <td class="text-center">

                        {{ detalle.cantidad }}

                    </td>


                    <td class="text-end">

                        ${{ detalle.precioUnitario.toLocaleString("es-AR") }}

                    </td>


                    <td class="text-end fw-semibold">

                        ${{ detalle.subtotal.toLocaleString("es-AR") }}

                    </td>

                </tr>

            </tbody>


            <tfoot>

                <tr>

                    <td
                        colspan="3"
                        class="text-end fw-semibold"
                    >
                        Subtotal
                    </td>

                    <td class="text-end">

                        ${{ venta.subtotal.toLocaleString("es-AR") }}

                    </td>

                </tr>


                <tr>

                    <td
                        colspan="3"
                        class="text-end fw-bold"
                    >
                        Total
                    </td>

                    <td class="text-end fw-bold fs-5">

                        ${{ venta.total.toLocaleString("es-AR") }}

                    </td>

                </tr>

            </tfoot>

        </table>

    </div>
    <!-- Resumen financiero -->
<div
    v-if="!venta.tieneFinanciacion"
    class="border rounded p-3"
>
    <h6 class="fw-bold mb-3">
        Resumen financiero
    </h6>

    <div class="d-flex justify-content-between mb-2">
        <span class="text-muted">
            Total de la venta
        </span>

        <span>
            ${{ venta.total.toLocaleString("es-AR") }}
        </span>
    </div>

    <div class="d-flex justify-content-between mb-2">
        <span class="text-muted">
            Pagado
        </span>

        <span class="text-success">
            ${{
                (
                    venta.total - venta.saldoPendiente
                ).toLocaleString("es-AR")
            }}
        </span>
    </div>

    <hr>

    <div class="d-flex justify-content-between">
        <span class="fw-bold">
            Saldo pendiente
        </span>

        <span
            class="fw-bold"
            :class="venta.saldoPendiente > 0
                ? 'text-danger'
                : 'text-success'"
        >
            ${{ venta.saldoPendiente.toLocaleString("es-AR") }}
        </span>
    </div>
</div>
<div
    v-else-if="venta.financiacion"
    class="border rounded p-3"
>
    <h6 class="fw-bold mb-3">
        Resumen financiero
    </h6>

    <div class="d-flex justify-content-between mb-2">
        <span class="text-muted">
            Total de la venta
        </span>

        <span>
            ${{ venta.total.toLocaleString("es-AR") }}
        </span>
    </div>

    <div class="d-flex justify-content-between mb-2">
        <span class="text-muted">
            Entrega / pagos directos
        </span>

        <span class="text-success">
            ${{
                (
                    venta.total -
                    venta.financiacion.montoFinanciado
                ).toLocaleString("es-AR")
            }}
        </span>
    </div>

    <hr>

    <div class="d-flex justify-content-between mb-2">
        <span class="text-muted">
            Monto financiado
        </span>

        <span>
            ${{ venta.financiacion.montoFinanciado.toLocaleString("es-AR") }}
        </span>
    </div>

    <div class="d-flex justify-content-between mb-2">
        <span class="text-muted">
            Interés
        </span>

        <span>
            ${{ venta.financiacion.interesTotal.toLocaleString("es-AR") }}
        </span>
    </div>

    <div class="d-flex justify-content-between mb-2">
        <span class="text-muted">
            Total financiación
        </span>

        <span class="fw-semibold">
            ${{ venta.financiacion.montoTotal.toLocaleString("es-AR") }}
        </span>
    </div>

    <div class="d-flex justify-content-between mb-2">
        <span class="text-muted">
            Pagado en cuotas
        </span>

        <span class="text-success">
            ${{ venta.financiacion.montoPagado.toLocaleString("es-AR") }}
        </span>
    </div>

    <hr>

    <div class="d-flex justify-content-between">
        <span class="fw-bold">
            Saldo financiación
        </span>

        <span
            class="fw-bold"
            :class="venta.financiacion.saldoPendiente > 0
                ? 'text-danger'
                : 'text-success'"
        >
            ${{ venta.financiacion.saldoPendiente.toLocaleString("es-AR") }}
        </span>
    </div>
</div>
<div class="responsive-actions mt-3">

    <!-- Financiar -->
    <RouterLink
        v-if="puedeFinanciar"
        :to="`/financiaciones/nueva/${venta.id}`"
        class="btn btn-warning"
    >
        <i class="bi bi-bank me-1"></i>
        Financiar venta
    </RouterLink>


    <!-- Ver financiación -->
   <RouterLink
    v-if="venta.tieneFinanciacion && venta.financiacionId"
    :to="`/financiaciones/${venta.financiacionId}/cuotas`"
    class="btn btn-primary"
>
    <i class="bi bi-bank me-1"></i>
    Ver financiación
</RouterLink>


    <!-- Registrar pago -->
    <RouterLink
        v-if="puedePagarDirectamente"
        :to="`/pagos/nuevo/${venta.id}`"
        class="btn btn-success"
    >
        <i class="bi bi-cash-coin me-1"></i>
        Registrar pago
    </RouterLink>

</div>
<div
    v-if="venta.pagos.length > 0"
    class="mt-4"
>

    <h5 class="fw-bold mb-3">
        Pagos realizados
    </h5>

    <div class="table-responsive">

        <table class="table align-middle">

            <thead class="table-light">

                <tr>
                    <th>Fecha</th>
                    <th>Forma de pago</th>
                    <th class="text-end">Monto</th>
                </tr>

            </thead>

            <tbody>

                <tr
                    v-for="pago in venta.pagos"
                    :key="pago.id"
                >

                    <td>
                        {{ new Date(pago.fecha).toLocaleDateString("es-AR") }}
                    </td>

                    <td>
                        {{ pago.formaPago }}
                    </td>

                    <td class="text-end fw-semibold text-success">
                        ${{ pago.monto.toLocaleString("es-AR") }}
                    </td>

                </tr>

            </tbody>

        </table>

    </div>

</div>

<div
    v-else
    class="mt-4"
>

    <div class="alert alert-light border">

        <i class="bi bi-info-circle me-2"></i>

        Esta venta todavía no tiene pagos registrados.

    </div>

</div>
<div
    v-if="venta.financiacion"
    class="mt-4"
>

    <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">

        <div>

            <h5 class="fw-bold mb-1">
                Financiación
            </h5>

            <small class="text-muted">
                Información general de la financiación
            </small>

        </div>

        <span class="badge bg-primary">
            {{ venta.financiacion.estado }}
        </span>

    </div>


    <div class="row g-3">

        <div class="col-md-3">

            <div class="border rounded p-3 h-100">

                <small class="text-muted">
                    Cuotas
                </small>

                <div class="fw-bold fs-5">
                    {{ venta.financiacion.cantidadCuotas }}
                </div>

            </div>

        </div>


        <div class="col-md-3">

            <div class="border rounded p-3 h-100">

                <small class="text-muted">
                    Monto financiado
                </small>

                <div class="fw-bold">
                    ${{ venta.financiacion.montoFinanciado.toLocaleString("es-AR") }}
                </div>

            </div>

        </div>


        <div class="col-md-3">

            <div class="border rounded p-3 h-100">

                <small class="text-muted">
                    Total financiado
                </small>

                <div class="fw-bold">
                    ${{ venta.financiacion.montoTotal.toLocaleString("es-AR") }}
                </div>

            </div>

        </div>


        <div class="col-md-3">

            <div class="border rounded p-3 h-100">

                <small class="text-muted">
                    Coeficiente
                </small>

                <div class="fw-bold">
                    {{ venta.financiacion.coeficienteAplicado }}
                </div>

            </div>

        </div>

    </div>


    <div class="d-flex justify-content-end mt-3">

        <RouterLink
            :to="`/financiaciones/${venta.financiacion.id}/cuotas`"
            class="btn btn-primary"
        >
            <i class="bi bi-list-ol me-1"></i>
            Ver cuotas
        </RouterLink>

    </div>

</div>

</div>
        </Card>

    </div>

</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";

import { useRoute } from "vue-router";

import Card from "../components/cards/Card.vue";
import PageHeader from "../components/page/PageHeader.vue";

import { useVentaStore } from "../stores/ventaStore";
import BackButton from "../components/buttons/BackButton.vue";
import {
    esVentaElegibleParaFinanciar,
    puedeRegistrarPagoDirecto
} from "../utils/ventaElegibilidad";

const route = useRoute();

const ventaStore = useVentaStore();

const cargando = ref(true);

const error = ref<string | null>(null);

const venta = computed(() => ventaStore.ventaActual);
const puedeFinanciar = computed(() => venta.value !== null &&
    esVentaElegibleParaFinanciar(venta.value));
const puedePagarDirectamente = computed(() => venta.value !== null &&
    puedeRegistrarPagoDirecto(venta.value));


async function cargarVenta() {

    cargando.value = true;
    error.value = null;

    try {

        const ventaId = Number(route.params.id);

        if (Number.isNaN(ventaId) || ventaId <= 0) {

            throw new Error(
                "Identificador de venta inválido."
            );

        }

        await ventaStore.cargarVenta(ventaId);

    }
    catch (e) {

        console.error(
            "Error cargando venta:",
            e
        );

        error.value =
            "No se pudo cargar la venta.";

    }
    finally {

        cargando.value = false;

    }

}


onMounted(async () => {

    await cargarVenta();

});



</script>
