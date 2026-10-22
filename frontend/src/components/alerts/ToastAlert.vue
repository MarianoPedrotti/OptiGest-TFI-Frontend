<template>

<div
    v-if="visible"
    class="toast-alert shadow"
    :class="tipoClase"
>

    <div class="d-flex align-items-start gap-2">

        <i :class="icono"></i>

        <div class="flex-grow-1">

            <div class="fw-semibold">
                {{ titulo }}
            </div>

            <div>
                {{ mensaje }}
            </div>

        </div>

        <button
            class="btn-close"
            @click="cerrar"
        ></button>

    </div>

</div>

</template>

<script setup lang="ts">

import { computed } from "vue";

const props = defineProps<{
    visible: boolean;
    tipo: "success" | "error" | "warning" | "info";
    titulo: string;
    mensaje: string;
}>();

const emit = defineEmits<{
    (e: "close"): void;
}>();

const tipoClase = computed(() => {

    switch (props.tipo) {

        case "success":
            return "toast-success";

        case "error":
            return "toast-error";

        case "warning":
            return "toast-warning";

        default:
            return "toast-info";
    }

});

const icono = computed(() => {

    switch (props.tipo) {

        case "success":
            return "bi bi-check-circle-fill";

        case "error":
            return "bi bi-x-circle-fill";

        case "warning":
            return "bi bi-exclamation-triangle-fill";

        default:
            return "bi bi-info-circle-fill";
    }

});

function cerrar() {
    emit("close");
}

</script>

<style scoped>

.toast-alert {
    position: fixed;
    top: 20px;
    right: 20px;
    width: min(360px, calc(100vw - 40px));
    padding: 16px;
    border-radius: 10px;
    z-index: 2000;
    background: white;
    border-left: 5px solid;
    overflow-wrap: anywhere;
}

.toast-success {
    border-color: #198754;
}

.toast-error {
    border-color: #dc3545;
}

.toast-warning {
    border-color: #ffc107;
}

.toast-info {
    border-color: #0d6efd;
}

@media (max-width: 575.98px) {
    .toast-alert {
        top: 12px;
        right: 12px;
        left: 12px;
        width: auto;
        padding: 14px;
    }
}

</style>
