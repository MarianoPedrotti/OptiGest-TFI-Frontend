<template>
<div
    v-if="errorCarga"
    class="alert alert-warning"
    role="alert"
>
    {{ errorCarga }}

    <div class="responsive-actions justify-content-start mt-3">
        <button
            type="button"
            class="btn btn-outline-primary"
            @click="cargarCuotas"
        >
            Reintentar carga
        </button>
    </div>
</div>

<div v-else-if="cuotaStore.cargando" class="text-center py-5">
    <div class="spinner-border text-primary"></div>
    <p class="text-muted mt-3">Cargando cuotas...</p>
</div>

<DataTable v-else>

    <thead>

        <tr>

            <th>N°</th>

            <th>Cliente</th>

            <th>Vencimiento</th>

            <th>Monto</th>

            <th>Estado</th>

            <th>Acciones</th>

        </tr>

    </thead>

    <tbody>

        <tr
            v-for="cuota in cuotaStore.cuotas"
            :key="cuota.id"
        >

            <td>

                {{ cuota.numero }}

            </td>

            <td>

                {{ cuota.nombreCliente }}

            </td>

            <td>

                {{ new Date(cuota.fechaVencimiento).toLocaleDateString("es-AR") }}

            </td>

            <td>

                ${{ cuota.monto.toLocaleString("es-AR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }) }}

            </td>

            <td>

                <span
                    class="badge"
                    :class="cuota.estado === 'Pagada'
                        ? 'bg-success'
                        : 'bg-warning text-dark'"
                >

                    {{ cuota.estado }}

                </span>

            </td>

            <td>

                <RouterLink
                    v-if="cuota.estado !== 'Pagada'"
                    :to="`/pagos-cuota/nuevo/${cuota.id}`"
                    class="btn btn-success btn-sm"
                >

                    Pagar

                </RouterLink>

            </td>

        </tr>

    </tbody>

</DataTable>

</template>

<script setup lang="ts">

import { onMounted, ref, watch } from "vue";

import { useRoute } from "vue-router";

import { useCuotaStore } from "../../stores/cuotaStore.ts";

import DataTable from "../tables/DataTable.vue";

const cuotaStore = useCuotaStore();

const route = useRoute();
const errorCarga = ref("");

async function cargarCuotas() {

    const financiacionId = Number(route.params.id);

    if (!Number.isInteger(financiacionId) || financiacionId <= 0) {
        cuotaStore.cuotas = [];
        errorCarga.value = "La financiación indicada no es válida.";
        return;
    }

    errorCarga.value = "";

    try {
        await cuotaStore.cargarPorFinanciacion(financiacionId);
    }
    catch (error) {
        console.error(error);
        errorCarga.value = "No se pudo cargar el plan de cuotas. La financiación no se modificó; reintentá la carga.";
    }

}

onMounted(cargarCuotas);

watch(() => route.params.id, cargarCuotas);

</script>
