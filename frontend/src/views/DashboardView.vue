<template>

<div class="container-fluid">

    <h2 class="mb-4">

        Dashboard

    </h2>

    <DashboardStats />

    <div class="row g-4 mt-1">

        <div class="col-lg-6">

            <DashboardUltimasVentas />

        </div>

        <div class="col-lg-6">

            <DashboardProximasCuotas />

            

        </div>

    </div>

<div class="row g-4 mt-1">
    <div class="col-12">
        <DashboardVentasSemana
        :ventas="dashboardStore.dashboard?.ventasUltimos7Dias ?? []"
        />
    </div>
</div>

</div>

</template>

<script setup lang="ts">

import { onMounted } from "vue";

import DashboardStats from "../components/dashboard/DashboardStats.vue";
import DashboardUltimasVentas from "../components/dashboard/DashboardUltimasVentas.vue";
import DashboardProximasCuotas from "../components/dashboard/DashboardProximasCuotas.vue";
import DashboardVentasSemana from "../components/dashboard/DashboardVentasSemana.vue";

import { useDashboardStore } from "../stores/dashboardStore";

const dashboardStore = useDashboardStore();

onMounted(() => {

    dashboardStore.cargar();

});

</script>
