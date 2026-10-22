<template>

<DataTable>

    <thead>

        <tr>

            <th>Nombre</th>
            <th>DNI</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th class="text-center">Acciones</th>

        </tr>

    </thead>

    <tbody>

        <tr
            v-for="cliente in clientes"
            :key="cliente.id"
        >

            <td>{{ cliente.nombre }}</td>

            <td>{{ cliente.dni }}</td>

            <td>{{ cliente.email }}</td>

            <td>{{ cliente.telefono }}</td>

            <td class="text-center">

                <button
                    class="btn btn-warning btn-sm me-2"
                    @click="emit('editar', cliente)">
                

                    <i class="bi bi-pencil"></i>

                </button>

                <button
                    class="btn btn-danger btn-sm"
                    @click="emit('eliminar', cliente.id)">
                

                    <i class="bi bi-trash"></i>

                </button>

            </td>

        </tr>
        <tr v-if="clientes.length === 0">

    <td
        colspan="6"
        class="text-center text-muted py-4"
    >

        No se encontraron clientes.

    </td>

</tr>

    </tbody>

</DataTable>

</template>

<script setup lang="ts">

import DataTable from "../tables/DataTable.vue";

const emit = defineEmits(["editar", "eliminar"]);

import type {
    Cliente
} from "../../types/cliente";


defineProps<{

    clientes: Cliente[];

}>();

</script>