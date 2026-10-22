<template>

<div
    v-if="visible"
    class="modal-backdrop-custom"
>

    <div class="confirm-modal shadow">

        <h5 class="fw-bold mb-3">
            {{ titulo }}
        </h5>

        <p class="text-muted">
            {{ mensaje }}
        </p>

        <div class="confirm-actions d-flex justify-content-end gap-2">

            <button
                class="btn btn-outline-secondary"
                @click="$emit('cancelar')"
            >
                Cancelar
            </button>

            <button
                class="btn btn-danger"
                @click="$emit('confirmar')"
            >
                Confirmar
            </button>

        </div>

    </div>

</div>

</template>

<script setup lang="ts">

defineProps<{
    visible: boolean;
    titulo: string;
    mensaje: string;
}>();

defineEmits<{
    (e: "confirmar"): void;
    (e: "cancelar"): void;
}>();

</script>

<style scoped>

.modal-backdrop-custom {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,.45);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 3000;
    padding: 16px;
}

.confirm-modal {
    width: 420px;
    max-width: 100%;
    max-height: calc(100dvh - 32px);
    overflow-y: auto;
    background: white;
    border-radius: 12px;
    padding: 24px;
}

.confirm-actions {
    flex-wrap: wrap;
}

@media (max-width: 575.98px) {
    .confirm-modal {
        width: 100%;
        padding: 18px;
    }

    .confirm-actions {
        flex-direction: column-reverse;
    }

    .confirm-actions button {
        width: 100%;
        min-height: 44px;
    }
}

</style>
