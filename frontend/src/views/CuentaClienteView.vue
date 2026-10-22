<template>
    <div>

    <div class="mb-3">
    <BackButton
    texto="Volver a cuentas corrientes"
    ruta="/cuentacorriente"
/>
    </div>

<Card>

    <PageHeader
        titulo="Cuenta Corriente"
        subtitulo="Detalle de movimientos"
    />

    <!-- Después pondremos una tarjeta con los datos del cliente -->

    <MovimientoCuentaTable />

</Card>
    </div>
</template>

<script setup lang="ts">

import { onMounted } from "vue";
import { useRoute } from "vue-router";
import BackButton from "../components/buttons/BackButton.vue";

import Card from "../components/cards/Card.vue";
import PageHeader from "../components/page/PageHeader.vue";
import MovimientoCuentaTable from "../components/CuentaCorriente/MovimientoCuentaTable.vue";

import { useCuentaCorrienteStore } from "../stores/cuentaCorrienteStore";

const route = useRoute();

const cuentaStore = useCuentaCorrienteStore();

onMounted(async () => {

    await cuentaStore.cargar(Number(route.params.clienteId));

});

</script>