<template>

<DataTable>

    <thead>

        <tr>

            <th>Marca</th>
            <th>Modelo</th>
            <th>Año</th>
            <th>Patente</th>
            <th>VIN</th>
            <th>Precio Venta</th>
            <th>Estado</th>

            <th class="text-center">
                Acciones
            </th>

        </tr>

    </thead>


    <tbody>

        <tr
            v-for="vehiculo in vehiculos"
            :key="vehiculo.id"
        >

            <td>

                {{ vehiculo.marca }}

            </td>


            <td>

                {{ vehiculo.modelo }}

            </td>


            <td>

                {{ vehiculo.anio }}

            </td>


            <td>

                {{ vehiculo.patente }}

            </td>


            <td>

                {{ vehiculo.vin }}

            </td>


            <td>

                ${{
                    vehiculo.precioVenta
                        .toLocaleString("es-AR")
                }}

            </td>


            <td>

                <span
                    class="badge"
                    :class="
                        vehiculo.estado === 'Disponible'
                            ? 'bg-success'
                            : 'bg-secondary'
                    "
                >

                    {{ vehiculo.estado }}

                </span>

            </td>


            <td class="text-center">

                <button
                        v-if="
                            vehiculo.estado !== 'Vendido' ||
                            puedeEditarVendidos
                        "
                        class="btn btn-warning btn-sm me-2"
                        @click="emit('editar', vehiculo)"
                    >
                        <i class="bi bi-pencil"></i>
                </button>


                <button
                    v-if="vehiculo.estado !== 'Vendido'"
                    class="btn btn-danger btn-sm"
                    @click="emit('eliminar', vehiculo.id)"
                >
                    <i class="bi bi-trash"></i>
                </button>

            </td>

        </tr>


        <tr
            v-if="vehiculos.length === 0"
        >

            <td
                colspan="8"
                class="text-center text-muted py-4"
            >

                No se encontraron vehículos.

            </td>

        </tr>

    </tbody>

</DataTable>

</template>


<script setup lang="ts">

import DataTable from "../tables/DataTable.vue";

import type {
    Vehiculo
} from "../../types/vehiculo";
import { computed } from "vue";
import { useAuthStore } from "../../stores/authStore";

const authStore =
    useAuthStore();

const puedeEditarVendidos =
    computed(() =>
        authStore.rol === "Admin" ||
        authStore.rol === "Dueno"
    );


defineProps<{

    vehiculos: Vehiculo[];

}>();


const emit = defineEmits([

    "editar",

    "eliminar"

]);

</script>