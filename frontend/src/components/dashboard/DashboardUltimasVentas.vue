<template>

<div class="card shadow-sm h-100">

    <div class="card-header d-flex flex-wrap justify-content-between align-items-center gap-2">

        <h5 class="mb-0">

            Últimas ventas

        </h5>

        <RouterLink
            to="/ventas"
            class="btn btn-sm btn-outline-primary"
        >
            Ver todas
        </RouterLink>

    </div>

    <div class="table-responsive">

        <table class="table table-hover align-middle mb-0">

            <thead>

                <tr>

                    <th>Cliente</th>
                    <th>Total</th>
                    <th>Estado del pago</th>
                </tr>

            </thead>

            <tbody>

                <tr
                    v-for="venta in dashboardStore.dashboard?.ultimasVentas"
                    :key="venta.ventaId"
                    style="cursor:pointer"
                    @click="$router.push(`/ventas/${venta.ventaId}`)"
                >

                    <td>

                        {{ venta.cliente }}

                    </td>

                    <td>

                        ${{ venta.total.toLocaleString("es-AR") }}

                    </td>

                    <td>

                        <span
                            class="badge"
                            :class="badgeClass(venta.estado)"
                        >
                            {{ normalizarEstadoVentaPresentacion(venta.estado) === 'PagoParcial' ? 'Pago parcial' : venta.estado }}
                        </span>

                    </td>

                </tr>

                <tr
                    v-if="!dashboardStore.dashboard?.ultimasVentas.length"
                >

                    <td
                        colspan="4"
                        class="text-center text-muted py-4"
                    >

                        No existen ventas registradas.

                    </td>

                </tr>

            </tbody>

        </table>

    </div>

</div>

</template>

<script setup lang="ts">

import { RouterLink } from "vue-router";
import { useDashboardStore } from "../../stores/dashboardStore";
import { normalizarEstadoVentaPresentacion } from "../../utils/ventaEstadoPresentacion";

const dashboardStore = useDashboardStore();

function badgeClass(estado: string) {

    switch (normalizarEstadoVentaPresentacion(estado)) {

        case "Pagada":
            return "bg-success";

        case "PagoParcial":
            return "bg-warning text-dark";

        case "Completada":
            return "bg-primary";

        default:
            return "bg-secondary";
    }
}

</script>
