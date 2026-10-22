<template>
    <div class="page-header">

        <div>

            <h2>{{ titulo }}</h2>

            <p v-if="subtitulo">
                {{ subtitulo }}
            </p>

        </div>

        <div class="actions">

            <slot />

        </div>

    </div>
</template>

<script setup lang="ts">

defineProps<{

    titulo: string

    subtitulo?: string

}>()

</script>

<style scoped>

.page-header{

    display:flex;

    justify-content:space-between;

    align-items:center;

    gap:16px;

    flex-wrap:wrap;

    margin-bottom:25px;

}

.page-header > div:first-child{

    min-width:0;

}

.page-header h2{

    margin:0;

    font-weight:700;

    overflow-wrap:anywhere;

}

.page-header p{

    margin-top:4px;

    color:#777;

}

.actions{

    display:flex;

    gap:10px;

    flex-wrap:wrap;

    justify-content:flex-end;

}

@media (max-width: 575.98px){

    .page-header{

        align-items:stretch;

        margin-bottom:18px;

    }

    .actions{

        width:100%;

        flex-direction:column;

        align-items:stretch;

    }

    .actions :slotted(*){

        width:100%;

    }

}

</style>
