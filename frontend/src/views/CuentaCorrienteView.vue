<template>

<Card>

    <PageHeader
        titulo="Cuentas Corrientes"
        subtitulo="Estado de cuenta de los clientes"
    />

    <CuentaCorrienteStats
    :clientes="cuentaCorrienteStore.resumen"
    />
    <div class="row mb-4">

    <div class="col-md-8">

        <input
            v-model="busqueda"
            type="text"
            class="form-control"
            placeholder="Buscar cliente..."
        />

    </div>

    <div class="col-md-4">

        <select
            v-model="filtro"
            class="form-select"
        >
            <option value="todos">Todos</option>
            <option value="deudores">Con deuda</option>
            <option value="aldia">Al día</option>
        </select>

    </div>

</div>

    <CuentaCorrienteTable
    :clientes="clientesFiltrados"
    />

</Card>


</template>

<script setup lang="ts">

import { onMounted } from "vue";

import { useCuentaCorrienteStore } from "../stores/cuentaCorrienteStore";

import Card from "../components/cards/Card.vue";
import PageHeader from "../components/page/PageHeader.vue";
import CuentaCorrienteTable from "../components/CuentaCorriente/CuentaCorrienteTable.vue";
import CuentaCorrienteStats from "../components/CuentaCorriente/CuentaCorrienteStats.vue";
import { ref, computed } from "vue";
const busqueda = ref("");
const filtro = ref("todos");

const cuentaCorrienteStore = useCuentaCorrienteStore();

onMounted(async () => {

    await cuentaCorrienteStore.cargarResumen();

});
const clientesFiltrados = computed(() => {

    return cuentaCorrienteStore.resumen.filter(c => {

        const coincideBusqueda =
            c.nombreCliente
                .toLowerCase()
                .includes(busqueda.value.toLowerCase());

        if (filtro.value === "deudores") {
            return coincideBusqueda && c.saldoActual > 0;
        }

        if (filtro.value === "aldia") {
            return coincideBusqueda && c.saldoActual <= 0;
        }

        return coincideBusqueda;

    });

});

</script>