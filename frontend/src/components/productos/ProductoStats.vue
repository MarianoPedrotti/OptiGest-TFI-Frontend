<template>

<div
    v-if="productoStore.resumen"
    class="row mb-4"
>

    <div class="col-md-3">

        <Card>

            <h6 class="text-muted">
                Total productos
            </h6>

            <h2>
                {{ productoStore.resumen.totalProductos }}
            </h2>

        </Card>

    </div>


    <div class="col-md-3">

        <Card>

            <h6 class="text-muted">
                Valor de stock
            </h6>

            <h2 class="text-primary">

                ${{
                    productoStore.resumen
                        .valorStockVenta
                        .toLocaleString("es-AR")
                }}

            </h2>

        </Card>

    </div>


    <div class="col-md-3">

        <Card>

            <h6 class="text-muted">
                Bajo stock
            </h6>

            <h2 class="text-warning">

                {{ productoStore.resumen.bajoStock }}

            </h2>

        </Card>

    </div>


    <div class="col-md-3">

        <Card>

            <h6 class="text-muted">
                Sin stock
            </h6>

            <h2 class="text-danger">

                {{ productoStore.resumen.sinStock }}

            </h2>

        </Card>

    </div>

</div>

</template>

<script setup lang="ts">

import Card from "../cards/Card.vue";

import { useProductoStore } from "../../stores/productoStore";


const productoStore =
    useProductoStore();

</script>