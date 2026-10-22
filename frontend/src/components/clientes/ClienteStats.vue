<template>

<div
    v-if="clienteStore.resumen"
    class="row mb-4"
>

    <div class="col-md-3">

        <Card>

            <h6 class="text-muted">

                Total clientes

            </h6>

            <h2>

                {{
                    clienteStore.resumen
                        .totalClientes
                }}

            </h2>

        </Card>

    </div>


    <div class="col-md-3">

        <Card>

            <h6 class="text-muted">

                Clientes con deuda

            </h6>

            <h2 class="text-danger">

                {{
                    clienteStore.resumen
                        .clientesConDeuda
                }}

            </h2>

        </Card>

    </div>


    <div class="col-md-3">

        <Card>

            <h6 class="text-muted">

                Clientes al día

            </h6>

            <h2 class="text-success">

                {{
                    clienteStore.resumen
                        .clientesAlDia
                }}

            </h2>

        </Card>

    </div>


    <div class="col-md-3">

        <Card>

            <h6 class="text-muted">

                Deuda total

            </h6>

            <h2 class="text-primary">

                ${{
                    clienteStore.resumen
                        .deudaTotal
                        .toLocaleString("es-AR")
                }}

            </h2>

        </Card>

    </div>

</div>

</template>


<script setup lang="ts">

import Card from "../cards/Card.vue";

import {
    useClienteStore
} from "../../stores/clienteStore";


const clienteStore =
    useClienteStore();

</script>