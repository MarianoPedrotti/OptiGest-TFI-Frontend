<template>

<div>

    <div class="mb-3">

        <BackButton
            texto="Volver a financiaciones"
            ruta="/financiaciones"
        />

    </div>


    <Card>

        <PageHeader
            titulo="Cuotas"
            subtitulo="Administración de Cuotas"
        />


        <CuotaTable />

    </Card>

</div>

</template>


<script setup lang="ts">

import Card from "../components/cards/Card.vue";

import PageHeader from "../components/page/PageHeader.vue";

import BackButton from "../components/buttons/BackButton.vue";

import CuotaTable from "../components/cuotas/CuotaTable.vue";

</script>