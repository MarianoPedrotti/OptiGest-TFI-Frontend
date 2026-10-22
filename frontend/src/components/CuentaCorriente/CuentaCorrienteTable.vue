<template>

<DataTable>

    <thead>

        <tr>

            <th>Cliente</th>
            <th>Teléfono</th>
            <th>Saldo</th>
            <th>Último movimiento</th>
            <th>Estado</th>
            <th>Acciones</th>

        </tr>

    </thead>

    <tbody>

    <tr
        v-for="cliente in clientes"
        :key="cliente.clienteId"
    >

        <td>
            {{ cliente.nombreCliente }}
        </td>

        <td>
            {{ cliente.telefono }}
        </td>

        <td>
            ${{ cliente.saldoActual.toLocaleString("es-AR") }}
        </td>

        <td>
            {{ new Date(cliente.ultimoMovimiento).toLocaleDateString("es-AR") }}
        </td>

        <td>

            <span
                class="badge"
                :class="cliente.saldoActual > 0
                    ? 'bg-danger'
                    : 'bg-success'"
            >

                {{ cliente.saldoActual > 0 ? "Deudor" : "Al día" }}

            </span>

        </td>

        <td>

            <RouterLink
                :to="`/cuenta-corriente/${cliente.clienteId}`"
                class="btn btn-primary btn-sm"
            >
                Ver cuenta
            </RouterLink>

        </td>

    </tr>

</tbody>

</DataTable>

</template>

<script setup lang="ts">

import DataTable from "../tables/DataTable.vue";
import type { ResumenCuentaCorriente } from "../../types/CuentaCorriente";

defineProps<{
  clientes: ResumenCuentaCorriente[];
}>();
</script>
