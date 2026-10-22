<template>

<RouterLink
    :to="ruta"
    class="item"
    exact-active-class="activo"
>

    <i :class="icone"></i>

    <span>{{ texto }}</span>

</RouterLink>

</template>

<script setup lang="ts">

defineProps<{

    texto:string

    ruta:string

    icone:string

}>()

</script>

<style scoped>

.item{

    display:flex;
    color: var(--color-text-light);
    align-items:center;

    gap:15px;

    padding:14px 18px;

    border-radius:10px;

    transition:.25s;

    font-weight:600;

}

.item:hover{

    background:#333;

}

.item i{

    font-size:20px;

}

.activo{

    background:var(--color-primary);

    color:black;

}

</style>