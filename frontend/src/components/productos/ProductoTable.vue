<template>

<DataTable>

    <thead>

        <tr>

            <th>Nombre</th>
            <th>Subcategoría</th>
            <th>Marca</th>
            <th>Modelo</th>
            <th>SKU</th>
            <th>Precio Compra</th>
            <th>Precio Venta</th>
            <th class="text-center">Stock</th>
            <th class="text-center">Acciones</th>

        </tr>

    </thead>

    <tbody>

        <tr
            v-for="producto in productos"
            :key="producto.id"
        >

            <td>{{ producto.nombre }}</td>

<td>{{ producto.nombreSubCategoria }}</td>

<td>{{ producto.nombreMarcaProducto }}</td>

<td>{{ producto.modelo }}</td>

<td >{{ producto.sku }}</td>

<td>${{ producto.precioCompra.toLocaleString("es-AR") }}</td>

<td>${{ producto.precioVenta.toLocaleString("es-AR") }}</td>

<td class="text-center">{{ producto.stock }}</td>

<td class="text-center">
    <button class="btn btn-warning btn-sm me-2"
        @click="emit('editar', producto)">
        <i class="bi bi-pencil"></i>
    </button>

    <button class="btn btn-danger btn-sm"
        @click="emit('eliminar', producto.id)">
        <i class="bi bi-trash"></i>
    </button>

</td>

        </tr>
        <tr v-if="productos.length === 0">

    <td
        colspan="8"
        class="text-center text-muted py-4"
    >

        No se encontraron productos.

    </td>

</tr>

    </tbody>

</DataTable>

</template>

<script setup lang="ts">

import DataTable from "../tables/DataTable.vue";
const emit = defineEmits(["editar", "eliminar"]);
import type {
    Producto
} from "../../types/producto";


defineProps<{

    productos: Producto[];

}>();

</script>