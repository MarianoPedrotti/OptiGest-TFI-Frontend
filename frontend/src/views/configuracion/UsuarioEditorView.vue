<template>

<div class="container-fluid">

    <PageHeader
        :titulo="
            modoEdicion
                ? 'Editar vendedor'
                : 'Nuevo vendedor'
        "
        :subtitulo="
            modoEdicion
                ? 'Modificar datos del vendedor'
                : 'Registrar un nuevo vendedor'
        "
    />

    <Card>

        <UsuarioForm />

    </Card>

</div>

</template>

<script setup lang="ts">

import { computed } from "vue";
import { useRoute } from "vue-router";

import Card from "../../components/cards/Card.vue";
import PageHeader from "../../components/page/PageHeader.vue";
import UsuarioForm from "../../components/usuarios/UsuarioForm.vue";


const route = useRoute();

const modoEdicion = computed(() => {

    return !!route.params.id;

});

</script>