<template>

<DataTable>

    <thead>

        <tr>

            <th>Cliente</th>

            <th>Cuota</th>

            <th>Venta</th>

            <th>Vencimiento</th>

            <th>Monto</th>

            <th>Estado</th>

            <th class="text-center">
                Acciones
            </th>

        </tr>

    </thead>


    <tbody>

        <tr
            v-for="cuota in cuotas"
            :key="cuota.id"
        >

            <td>

                {{ cuota.nombreCliente }}

            </td>


            <td>

                {{ cuota.numero }}

            </td>


            <td>

                #{{ cuota.ventaId }}

            </td>


            <td>

                {{
                    formatearFecha(
                        cuota.fechaVencimiento
                    )
                }}

            </td>


            <td>

                ${{
                    cuota.monto
                        .toLocaleString(
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
                    :class="claseEstado(cuota)"
                >

                    {{
                        textoEstado(cuota)
                    }}

                </span>

            </td>


            <td class="text-center">

                <RouterLink
                    v-if="
                        cuota.estado !== 'Pagada'
                    "
                    :to="`/pagos-cuota/nuevo/${cuota.id}`"
                    class="btn btn-success btn-sm"
                >

                    Pagar

                </RouterLink>


                <span
                    v-else
                    class="text-muted"
                >

                    —

                </span>

            </td>

        </tr>


        <tr
            v-if="cuotas.length === 0"
        >

            <td
                colspan="7"
                class="text-center text-muted py-4"
            >

                No se encontraron cuotas.

            </td>

        </tr>

    </tbody>

</DataTable>

</template>


<script setup lang="ts">

import DataTable from "../tables/DataTable.vue";

import type {
    Cuota
} from "../../types/cuota";


defineProps<{

    cuotas: Cuota[];

}>();


function formatearFecha(
    fecha: string
) {

    return new Date(
        fecha
    ).toLocaleDateString(
        "es-AR"
    );

}


function estaVencida(
    cuota: Cuota
) {

    if (
        cuota.estado === "Pagada"
    )
        return false;


    const fecha =
        new Date(
            cuota.fechaVencimiento
        );

    fecha.setHours(
        0,
        0,
        0,
        0
    );


    const hoy =
        new Date();

    hoy.setHours(
        0,
        0,
        0,
        0
    );


    return fecha < hoy;

}


function textoEstado(
    cuota: Cuota
) {

    if (
        cuota.estado === "Pagada"
    )
        return "Pagada";


    if (
        estaVencida(cuota)
    )
        return "Vencida";


    return "Pendiente";

}


function claseEstado(
    cuota: Cuota
) {

    if (
        cuota.estado === "Pagada"
    )
        return "bg-success";


    if (
        estaVencida(cuota)
    )
        return "bg-danger";


    return "bg-warning text-dark";

}

</script>