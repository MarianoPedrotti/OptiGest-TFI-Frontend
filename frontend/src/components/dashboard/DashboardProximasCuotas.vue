<template>

<div class="card shadow-sm h-100">

    <div class="card-header d-flex flex-wrap justify-content-between align-items-center gap-2">

        <h5 class="mb-0">

            Próximas cuotas

        </h5>

       <RouterLink
    to="/cuotas"
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

                    <th>Cuota</th>

                    <th>Monto</th>

                    <th>Vence</th>

                </tr>

            </thead>

            <tbody>

                <tr
                    v-for="cuota in dashboardStore.dashboard?.proximasCuotas"
                    :key="cuota.cuotaId"
                >

                    <td>

                        {{ cuota.cliente }}

                    </td>

                    <td>

                        {{ cuota.numeroCuota }}

                    </td>

                    <td>

                        ${{ cuota.monto.toLocaleString("es-AR") }}

                    </td>

                    <td>

                        {{ formatearFecha(cuota.fechaVencimiento) }}

                    </td>

                </tr>

                <tr
                    v-if="!dashboardStore.dashboard?.proximasCuotas.length"
                >

                    <td
                        colspan="4"
                        class="text-center text-muted py-4"
                    >

                        No existen cuotas pendientes.

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

const dashboardStore = useDashboardStore();

function formatearFecha(fecha:string){

    return new Date(fecha).toLocaleDateString("es-AR");

}

</script>
