<template>

<div class="row g-3">

    <div class="col-md-6 col-xl-3">

        <div class="card shadow-sm border-0 h-100">

            <div class="card-body">

                <h6 class="text-muted">
                    Ventas del día
                </h6>

                <h3 class="fw-bold text-success">

                    ${{ dashboardStore.dashboard?.ventasDelDia.toLocaleString("es-AR") }}

                </h3>

            </div>

        </div>

    </div>

    <div class="col-md-6 col-xl-3">

        <div class="card shadow-sm border-0 h-100">

            <div class="card-body">

                <h6 class="text-muted">

                    Vehículos disponibles

                </h6>

                <h3 class="fw-bold text-primary">

                    {{ dashboardStore.dashboard?.vehiculosDisponibles }}

                </h3>

            </div>

        </div>

    </div>

    <div class="col-md-6 col-xl-3">

        <div class="card shadow-sm border-0 h-100">

            <div class="card-body">

                <h6 class="text-muted">

                    Clientes con deuda

                </h6>

                <h3 class="fw-bold text-danger">

                    {{ dashboardStore.dashboard?.clientesConDeuda }}

                </h3>

            </div>

        </div>

    </div>

    <div class="col-md-6 col-xl-3">

        <div class="card shadow-sm border-0 h-100">

            <div class="card-body">

                <h6 class="text-muted">

                    Financiaciones activas

                </h6>

                <h3 class="fw-bold text-warning">

                    {{ dashboardStore.dashboard?.financiacionesActivas }}

                </h3>

            </div>

        </div>

    </div>

    <div class="col-md-6 col-xl-3">

        <div class="card shadow-sm border-0 h-100">

            <div class="card-body">

                <h6 class="text-muted">

                    Cuotas vencidas

                </h6>

                <h3
                    class="fw-bold"
                    :class="dashboardStore.dashboard?.cuotasVencidas
                        ? 'text-danger'
                        : 'text-success'"
                >

                    {{ dashboardStore.dashboard?.cuotasVencidas }}

                </h3>

            </div>

        </div>

    </div>

</div>

</template>

<script setup lang="ts">



import { useDashboardStore } from "../../stores/dashboardStore";

const dashboardStore = useDashboardStore();



</script>