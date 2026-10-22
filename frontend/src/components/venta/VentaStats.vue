<template>

<div
    v-if="ventaStore.resumen"
    class="row mb-4"
>

    <div class="col-md-3">

        <Card>

            <h6 class="text-muted">

                Ventas del mes

            </h6>

            <h2>

                {{
                    ventaStore.resumen
                        .ventasDelMes
                }}

            </h2>

        </Card>

    </div>


    <div class="col-md-3">

        <Card>

            <h6 class="text-muted">

                Monto vendido del mes

            </h6>

            <h2 class="text-primary">

                ${{
                    ventaStore.resumen
                        .montoVendidoMes
                        .toLocaleString("es-AR")
                }}

            </h2>

        </Card>

    </div>


    <div class="col-md-3">

        <Card>

            <h6 class="text-muted">

                Pendientes

            </h6>

            <h2 class="text-warning">

                {{
                    ventaStore.resumen
                        .pendientes
                }}

            </h2>

        </Card>

    </div>


    <div class="col-md-3">

        <Card>

            <h6 class="text-muted">

                Pagadas

            </h6>

            <h2 class="text-success">

                {{
                    ventaStore.resumen
                        .pagadas
                }}

            </h2>

        </Card>

    </div>

</div>

</template>


<script setup lang="ts">

import Card from "../cards/Card.vue";

import {
    useVentaStore
} from "../../stores/ventaStore";


const ventaStore =
    useVentaStore();

</script>