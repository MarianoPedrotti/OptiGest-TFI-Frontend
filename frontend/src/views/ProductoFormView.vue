<template>
    <div class="container-fluid">
    <Card>
        
        <div class="container-fluid">
                <BackButton
            texto="Volver a productos"
            ruta="/productos"
        />
        </div>
        <PageHeader
            :titulo="
                esEdicion
                    ? 'Editar Producto'
                    : 'Nuevo Producto'
            "
            subtitulo="Completá los datos del producto"
        />

        <ProductoForm
            :producto="producto"
            @guardar="guardarProducto"
        />
    </Card>

    <ToastAlert
        :visible="alertaVisible"
        tipo="error"
        titulo="No se pudo guardar"
        :mensaje="alertaMensaje"
        @close="alertaVisible = false"
    />
</div>
</template>

<script setup lang="ts">
import {
    computed,
    onMounted,
    ref
} from "vue";

import {
    useRoute,
    useRouter
} from "vue-router";

import { useProductoStore } from "../stores/productoStore";
import BackButton from "../components/buttons/BackButton.vue";
import { getApiErrors } from "../utils/formErrors";

import type {
    Producto,
    ProductoCreateDto,
    ProductoUpdateDto
} from "../types/producto";

import Card from "../components/cards/Card.vue";
import PageHeader from "../components/page/PageHeader.vue";
import ProductoForm from "../components/productos/ProductoForm.vue";
import ToastAlert from "../components/alerts/ToastAlert.vue";

const route = useRoute();
const router = useRouter();

const productoStore = useProductoStore();

const producto = ref<Producto | null>(null);

const alertaVisible = ref(false);
const alertaMensaje = ref("");

const esEdicion = computed(
    () => route.name === "editar-producto"
);

function mostrarError(mensaje: string) {
    alertaMensaje.value =
        mensaje ||
        "No se pudo guardar el producto.";

    alertaVisible.value = true;
}

async function guardarProducto(
    value:
        | ProductoCreateDto
        | ProductoUpdateDto
) {
    try {
        if ("id" in value) {
            await productoStore.actualizar(value);
        } else {
            await productoStore.crear(value);
        }

        await router.push("/productos");
    } catch (error: unknown) {
        const parsed = getApiErrors(error);

        let mensaje = parsed.general;

        // Si ASP.NET devuelve errores por campo,
        // mostramos el primero en el Toast.
        if (!mensaje) {
            const primerError =
                Object.values(parsed.fields)[0];

            if (primerError) {
                mensaje = primerError;
            }
        }

        mostrarError(
            mensaje ||
            "No se pudo guardar el producto."
        );
    }
}

onMounted(async () => {
    if (!esEdicion.value) {
        return;
    }

    await productoStore.obtenerTodos();

    const id = Number(route.params.id);

    if (
        !Number.isInteger(id) ||
        id <= 0
    ) {
        await router.replace("/productos");
        return;
    }

    producto.value =
        productoStore.productos.find(
            item => item.id === id
        ) ?? null;

    if (!producto.value) {
        await router.replace("/productos");
    }
});
</script>