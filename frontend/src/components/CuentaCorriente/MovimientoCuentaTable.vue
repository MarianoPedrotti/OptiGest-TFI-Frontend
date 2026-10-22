<template>

<DataTable>

    <thead>

        <tr>

            <th>Fecha</th>
            <th>Concepto</th>
            <th>Debe</th>
            <th>Haber</th>
            <th>Saldo</th>

        </tr>

    </thead>

    <tbody>

        <tr
            v-for="movimiento in cuentaStore.cuenta?.movimientos"
            :key="movimiento.id"
        >

            <td>

                {{ new Date(movimiento.fecha).toLocaleDateString("es-AR") }}

            </td>

            <td>

                {{ movimiento.concepto }}

            </td>

            <td>

                ${{ movimiento.debe.toLocaleString("es-AR") }}

            </td>

            <td>

                ${{ movimiento.haber.toLocaleString("es-AR") }}

            </td>

            <td>

                ${{ movimiento.saldo.toLocaleString("es-AR") }}

            </td>

        </tr>

    </tbody>

</DataTable>

</template>

<script setup lang="ts">

import DataTable from "../tables/DataTable.vue";
import { useCuentaCorrienteStore } from "../../stores/cuentaCorrienteStore.ts";




const cuentaStore = useCuentaCorrienteStore();

</script>