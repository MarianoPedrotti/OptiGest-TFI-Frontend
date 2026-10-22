<template>

<button
    type="button"
    class="back-button"
    @click="volver"
>

    <i class="bi bi-arrow-left"></i>

    {{ texto }}

</button>

</template>


<script setup lang="ts">

import { useRouter } from "vue-router";


const props = withDefaults(
    defineProps<{
        texto?: string;
        ruta?: string;
    }>(),
    {
        texto: "Volver"
    }
);


const router = useRouter();


function volver() {

    if (props.ruta) {

        router.push(props.ruta);

        return;

    }

    router.back();

}

</script>


<style scoped>

.back-button {

    display: inline-flex;

    align-items: center;

    gap: 8px;

    background: transparent;

    border: none;

    padding: 0;

    margin: 0;

    color: #666;

    font-size: 0.95rem;

    font-weight: 500;

    cursor: pointer;

    transition:
        color 0.2s ease,
        transform 0.2s ease;

}


.back-button:hover {

    color: var(--color-secondary);

    transform: translateX(-2px);

}


.back-button i {

    font-size: 1rem;

}

</style>