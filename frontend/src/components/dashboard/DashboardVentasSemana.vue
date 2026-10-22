<template>

    <div class="card shadow-sm border-0 h-100">

        <div class="card-body">

            <div class="mb-3">

                <h5 class="fw-bold mb-1">
                    Ventas de los últimos 7 días
                </h5>

                <small class="text-muted">
                    Evolución de las ventas realizadas
                </small>

            </div>

            <div style="height: 300px;">

                <Chart
                    type="bar"
                    :data="chartData"
                    :options="chartOptions"
                />

            </div>

        </div>

    </div>

</template>


<script setup lang="ts">

import { computed } from "vue";

import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    type ChartData
} from "chart.js";

import { Chart } from "vue-chartjs";

import type { VentaDashboard } from "../../types/Dashboard";


ChartJS.register(
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,

);


const props = defineProps<{
    ventas: VentaDashboard[];
}>();


const chartData = computed<ChartData<"bar" | "line">>(() => ({

    labels: props.ventas.map(
        venta =>
            new Date(venta.fecha).toLocaleDateString(
                "es-AR",
                {
                    day: "2-digit",
                    month: "2-digit"
                }
            )
    ),

    datasets: [
        {
            type: "bar" as const,
            label: "Ventas",
            data: props.ventas.map(
                venta => venta.total
            )
        },

        {
            type: "line" as const,
            label: "Promedio",
            data: props.ventas.map(
                () => promedioVentas.value
            ),
            borderWidth: 2,
            pointRadius: 0,
            tension: 0
        }
    ]

}));
const promedioVentas = computed(() => {

    if (props.ventas.length === 0) {
        return 0;
    }

    const total = props.ventas.reduce(
        (acumulado, venta) => acumulado + venta.total,
        0
    );

    return total / props.ventas.length;

});


const chartOptions = {

    responsive: true,

    maintainAspectRatio: false,

    plugins: {

        legend: {
            display: false
        },

        tooltip: {

            callbacks: {

                label: (context: any) => {

                    return "$" +
                        Number(context.raw)
                            .toLocaleString("es-AR");

                }

            }

        }

    },

    scales: {

        y: {

            beginAtZero: true,

            ticks: {

    callback: (value: any) => {

        const numero = Number(value);

        if (numero >= 1_000_000) {
            return "$" + (numero / 1_000_000).toFixed(1) + " M";
        }

        if (numero >= 1_000) {
            return "$" + (numero / 1_000).toFixed(0) + " K";
        }

        return "$" + numero;

    }

}

        }

    }

};

</script>