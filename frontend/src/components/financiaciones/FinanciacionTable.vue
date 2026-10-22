<template>

<DataTable>

    <thead>

        <tr>

            <th>Cliente</th>
            <th>Vehículo</th>
            <th>Financiado</th>
            <th>Interés</th>
            <th>Cuotas</th>
            <th>Total</th>
            <th>Valor cuota</th>
            <th>Estado</th>
            <th>Acciones</th>

        </tr>

    </thead>


    <tbody>

        <tr
            v-for="financiacion in financiaciones"
            :key="financiacion.id"
        >

            <td>

                {{ financiacion.nombreCliente }}

            </td>


            <td>

                {{
                    financiacion.nombreVehiculo
                    || "-"
                }}

            </td>


            <td>

                ${{
                    financiacion.montoFinanciado
                        .toLocaleString("es-AR")
                }}

            </td>


            <td>

                {{
                    (
                        (
                            financiacion.coeficienteAplicado
                            - 1
                        ) * 100
                    ).toFixed(0)
                }}%

            </td>


            <td>

                {{ financiacion.cantidadCuotas }}

            </td>


            <td>

                ${{
                    financiacion.montoTotal
                        .toLocaleString("es-AR")
                }}

            </td>


            <td>

                ${{
                    (
                        financiacion.montoTotal /
                        financiacion.cantidadCuotas
                    ).toLocaleString(
                        "es-AR",
                        {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        }
                    )
                }}

            </td>


            <td>

                <span
                    class="badge"
                    :class="
                        financiacion.estado === 'Activa'
                            ? 'bg-primary'
                            : 'bg-success'
                    "
                >

                    {{ financiacion.estado }}

                </span>

            </td>


            <td>

                <RouterLink
                    :to="
                        `/financiaciones/${financiacion.id}/cuotas`
                    "
                    class="btn btn-warning btn-sm"
                >

                    Ver cuotas

                </RouterLink>

            </td>

        </tr>


        <tr
            v-if="financiaciones.length === 0"
        >

            <td
                colspan="9"
                class="text-center text-muted py-4"
            >

                No se encontraron financiaciones.

            </td>

        </tr>

    </tbody>

</DataTable>

</template>


<script setup lang="ts">

import DataTable from "../tables/DataTable.vue";

import type {
    Financiacion
} from "../../types/financiacion";


defineProps<{

    financiaciones: Financiacion[];

}>();

</script>