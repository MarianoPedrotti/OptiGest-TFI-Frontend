<template>

<Card>

    <PageHeader
        titulo="Productos"
        subtitulo="Administración de Productos"
    >
        <PrimaryButton @click="nuevoProducto">
            Nuevo Producto
        </PrimaryButton>
    </PageHeader>

    <ProductoStats />
    <div class="row g-3 mb-4">

    <div class="col-md-8">

        <BaseInput
            label="Buscar"
            placeholder="Nombre, SKU, modelo, marca o categoría..."
            v-model="busqueda"
        />

    </div>


    <div class="col-md-4">

        <SelectInput
            label="Stock"
            v-model="stockFiltro"
        >

            <option value="">
                Todos
            </option>

            <option value="disponible">
                Disponible
            </option>

            <option value="bajo">
                Bajo stock
            </option>

            <option value="sin">
                Sin stock
            </option>

        </SelectInput>

    </div>

</div>

    <ProductoTable
    :productos="productosFiltrados"
    @editar="editarProducto"
    @eliminar="solicitarEliminarProducto"
    @unidades="administrarUnidades"
/>  

    <ConfirmModal
        :visible="confirmarEliminarVisible"
        titulo="Eliminar producto"
        mensaje="¿Está seguro de que desea eliminar este producto?"
        @confirmar="confirmarEliminarProducto"
        @cancelar="cancelarEliminarProducto"
    />

    <ToastAlert
        :visible="alertaVisible"
        :tipo="alertaTipo"
        :titulo="alertaTitulo"
        :mensaje="alertaMensaje"
        @close="alertaVisible = false"
    />

</Card>

</template>

<script setup lang="ts">

import {computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import BaseInput from "../components/base/BaseInput.vue";
import SelectInput from "../components/forms/SelectInput.vue";
import { useProductoStore } from "../stores/productoStore";
import type { Producto } from "../types/producto";

import ProductoTable from "../components/productos/ProductoTable.vue";

import ProductoStats from "../components/productos/ProductoStats.vue";

import Card from "../components/cards/Card.vue";
import PrimaryButton from "../components/buttons/PrimaryButton.vue";
import PageHeader from "../components/page/PageHeader.vue";

import ConfirmModal from "../components/alerts/ConfirmModal.vue";
import ToastAlert from "../components/alerts/ToastAlert.vue";


const router = useRouter();

const productoStore = useProductoStore();

function nuevoProducto() {
    router.push({
        name: "nuevo-producto"
    });
}

// ==========================
// Toast
// ==========================

const alertaVisible = ref(false);

const alertaTipo =
    ref<"success" | "error" | "warning" | "info">("success");

const alertaTitulo = ref("");

const alertaMensaje = ref("");


function mostrarAlerta(
    tipo: "success" | "error" | "warning" | "info",
    titulo: string,
    mensaje: string
) {

    alertaTipo.value = tipo;
    alertaTitulo.value = titulo;
    alertaMensaje.value = mensaje;
    alertaVisible.value = true;

    setTimeout(() => {
        alertaVisible.value = false;
    }, 3500);

}


// ==========================
// Confirmar eliminación
// ==========================

const confirmarEliminarVisible = ref(false);

const productoEliminarId =
    ref<number | null>(null);


function solicitarEliminarProducto(id: number) {

    productoEliminarId.value = id;

    confirmarEliminarVisible.value = true;

}


async function confirmarEliminarProducto() {

    if (!productoEliminarId.value)
        return;

    try {

        await productoStore.eliminar(
            productoEliminarId.value
        );

        await cargarDatos();

        mostrarAlerta(
            "success",
            "Producto eliminado",
            "El producto se eliminó correctamente."
        );

    }
    catch (error) {

        console.error(error);

        mostrarAlerta(
            "error",
            "No se pudo eliminar",
            obtenerMensajeError(
                error,
                "No se pudo eliminar el producto."
            )
        );

    }
    finally {

        cancelarEliminarProducto();

    }

}


function cancelarEliminarProducto() {

    confirmarEliminarVisible.value = false;

    productoEliminarId.value = null;

}


// ==========================
// Carga
// ==========================

onMounted(async () => {

    try {

        await cargarDatos();

    }
    catch (error) {

        console.error(error);

        mostrarAlerta(
            "error",
            "Error",
            "No se pudieron cargar los productos."
        );

    }

});


async function cargarDatos() {

    await Promise.all([
        productoStore.obtenerTodos(true),
        productoStore.cargarResumen()
    ]);

}


// ==========================
// Nuevo / editar
// ==========================


function editarProducto(producto: Producto) {
    router.push({
        name: "editar-producto",
        params: {
            id: producto.id
        }
    });
}


// ==========================
// Guardar
// ==========================

function administrarUnidades(id: number) {

    router.push(
        `/productos/${id}/unidades`
    );

}


// ==========================
// Error API
// ==========================

function obtenerMensajeError(
    error: any,
    mensajeDefault: string
) {

    const data = error?.response?.data;

    if (typeof data === "string")
        return data;

    if (data?.message)
        return data.message;

    return mensajeDefault;

}
// ==========================
// Filtros
// ==========================

const busqueda = ref("");

const stockFiltro = ref("");


// ==========================
// Productos filtrados
// ==========================

const productosFiltrados = computed(() => {

    const texto =
        busqueda.value
            .trim()
            .toLowerCase();


    return productoStore.productos.filter(producto => {

        // --------------------------
        // Búsqueda
        // --------------------------

        const coincideBusqueda =
            !texto ||

            producto.nombre
                ?.toLowerCase()
                .includes(texto) ||

            producto.sku
                ?.toLowerCase()
                .includes(texto) ||

            producto.modelo
                ?.toLowerCase()
                .includes(texto) ||

            producto.nombreMarcaProducto
                ?.toLowerCase()
                .includes(texto) ||

            producto.nombreSubCategoria
                ?.toLowerCase()
                .includes(texto);


        // --------------------------
        // Stock
        // --------------------------

        let coincideStock = true;


        if (stockFiltro.value === "disponible") {

            coincideStock =
                producto.stock > 0;

        }


        if (stockFiltro.value === "bajo") {

            coincideStock =
                producto.stock > 0 &&
                producto.stock <= 5;

        }


        if (stockFiltro.value === "sin") {

            coincideStock =
                producto.stock === 0;

        }


        return (
            coincideBusqueda &&
            coincideStock
        );

    });

});

</script>