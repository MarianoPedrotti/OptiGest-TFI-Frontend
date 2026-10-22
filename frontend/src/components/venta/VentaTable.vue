<template>

<DataTable>

    <thead>

        <tr>

            <th>Fecha</th>
            <th>Cliente</th>
            <th>Vendedor</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Acciones</th>

        </tr>

    </thead>

    <tbody>

        <tr
            v-for="venta in props.ventas"
            :key="venta.id"
        >       

            <td>

                {{ new Date(venta.fecha).toLocaleDateString("es-AR") }}

            </td>

            <td>

                {{ venta.nombreCliente }}

            </td>

            <td>

                {{ venta.nombreUsuario }}

            </td>

            <td>

                ${{ venta.total.toLocaleString("es-AR") }}

            </td>

            <td>

    <span
    v-if="venta.estaPagada"
    class="badge bg-success"
>
    <i class="bi bi-check-circle me-1"></i>
    Pagada
</span>

<span
    v-else-if="venta.tieneFinanciacion"
    class="badge bg-primary"
>
    <i class="bi bi-bank me-1"></i>
    Financiada
</span>

<span
    v-else-if="normalizarEstadoVentaPresentacion(venta.estado) === 'PagoParcial'"
    class="badge bg-warning text-dark"
>
    Pago parcial
</span>

<span
    v-else
    class="badge bg-warning text-dark"
>
    Pendiente
</span>

</td>
            <td>

    <!-- Ver detalle -->
    <RouterLink
        :to="`/ventas/${venta.id}`"
        class="btn btn-outline-secondary btn-sm me-2"
        title="Ver detalle"
    >
        <i class="bi bi-eye"></i>
    </RouterLink>


    <!-- Financiar -->
    <RouterLink
        v-if="esVentaElegibleParaFinanciar(venta)"
        :to="`/financiaciones/nueva/${venta.id}`"
        class="btn btn-warning btn-sm me-2"
    >
        Financiar
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


    <!-- Pagar -->
    <RouterLink
        v-if="puedeRegistrarPagoDirecto(venta)"
        :to="`/pagos/nuevo/${venta.id}`"
        class="btn btn-success btn-sm"
    >
        Pagar
    </RouterLink>

</td>
        </tr>
        <tr
    v-if="ventas.length === 0"
>

    <td
        colspan="8"
        class="text-center text-muted py-4"
    >

        No se encontraron ventas.

    </td>

</tr>

    </tbody>

</DataTable>

</template>

<script setup lang="ts">

import DataTable from "../tables/DataTable.vue";
import { normalizarEstadoVentaPresentacion } from "../../utils/ventaEstadoPresentacion";

import type {
    Venta
} from "../../types/venta";
import {
    esVentaElegibleParaFinanciar,
    puedeRegistrarPagoDirecto
} from "../../utils/ventaElegibilidad";


const props = defineProps<{

    ventas: Venta[];

}>();



</script>


