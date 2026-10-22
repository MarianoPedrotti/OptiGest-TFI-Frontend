<template>
    <Card>
        <PageHeader
            :titulo="esEdicion ? 'Editar Cliente' : 'Nuevo Cliente'"
            subtitulo="Completá los datos del cliente"
        />
        <ClienteForm
            :cliente="cliente"
            :errors="fieldErrors"
            :general-error="generalError"
            @guardar="guardarCliente"
        />
    </Card>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useClienteStore } from "../stores/clienteStore";
import type { ClienteCreateDto, ClienteUpdateDto } from "../types/cliente";
import { getApiErrors, type FieldErrors } from "../utils/formErrors";
import Card from "../components/cards/Card.vue";
import PageHeader from "../components/page/PageHeader.vue";
import ClienteForm from "../components/clientes/ClienteForm.vue";

const route = useRoute();
const router = useRouter();
const clienteStore = useClienteStore();
const cliente = ref<ClienteUpdateDto | null>(null);
const fieldErrors = ref<FieldErrors>({});
const generalError = ref("");
const esEdicion = computed(() => route.name === "editar-cliente");

async function guardarCliente(value: ClienteCreateDto | ClienteUpdateDto) {
    fieldErrors.value = {};
    generalError.value = "";
    try {
        if ("id" in value) await clienteStore.actualizar(value);
        else await clienteStore.crear(value);
        await router.push("/clientes");
    } catch (error: unknown) {
        const parsed = getApiErrors(error);
        fieldErrors.value = parsed.fields;
        generalError.value = Object.keys(parsed.fields).length === 0 ? parsed.general : "";
    }
}

onMounted(async () => {
    await clienteStore.obtenerTodos();
    if (esEdicion.value) {
        const id = Number(route.params.id);
        cliente.value = clienteStore.clientes.find((item) => item.id === id) ?? null;
        if (!cliente.value) await router.replace("/clientes");
    }
});
</script>
