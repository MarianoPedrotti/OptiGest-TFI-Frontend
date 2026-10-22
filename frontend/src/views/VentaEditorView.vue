<template>

<div class="container-fluid">

    <div class="mb-3">

        <BackButton
            texto="Volver a ventas"
            ruta="/ventas"
        />

    </div>


    <PageHeader
        titulo="Nueva Venta"
        subtitulo="Registrar una nueva venta"
    />


    <Card>

        <VentaForm />

    </Card>

</div>

</template>


<script setup lang="ts">

import VentaForm from "../components/venta/VentaForm.vue";

import Card from "../components/cards/Card.vue";

import PageHeader from "../components/page/PageHeader.vue";

import BackButton from "../components/buttons/BackButton.vue";

</script>