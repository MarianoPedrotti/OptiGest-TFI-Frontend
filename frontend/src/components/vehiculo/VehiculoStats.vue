<template>

<div
    v-if="vehiculoStore.resumen"
    class="row mb-4"
>

    <div class="col-md-3">

        <Card>

            <h6 class="text-muted">
                Total vehículos
            </h6>

            <h2>
                {{ vehiculoStore.resumen.totalVehiculos }}
            </h2>

        </Card>

    </div>


    <div class="col-md-3">

        <Card>

            <h6 class="text-muted">
                Disponibles
            </h6>

            <h2 class="text-success">
                {{ vehiculoStore.resumen.disponibles }}
            </h2>

        </Card>

    </div>


    <div class="col-md-3">

        <Card>

            <h6 class="text-muted">
                Vendidos
            </h6>

            <h2 class="text-primary">
                {{ vehiculoStore.resumen.vendidos }}
            </h2>

        </Card>

    </div>


    <div class="col-md-3">

        <Card>

            <h6 class="text-muted">
                Valor disponible
            </h6>

            <h2 class="text-warning">

                ${{
                    vehiculoStore.resumen
                        .valorDisponibles
                        .toLocaleString("es-AR")
                }}

            </h2>

        </Card>

    </div>

</div>

</template>

<script setup lang="ts">

import Card from "../cards/Card.vue";

import { useVehiculoStore } from "../../stores/vehiculoStore";

const vehiculoStore =
    useVehiculoStore();

</script>