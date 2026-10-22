<template>

<div
    v-if="financiacionStore.resumen"
    class="row mb-4"
>

    <div class="col-md-3">

        <Card>

            <h6 class="text-muted">
                Financiaciones activas
            </h6>

            <h2 class="text-primary">

                {{
                    financiacionStore.resumen
                        .activas
                }}

            </h2>

        </Card>

    </div>


    <div class="col-md-3">

        <Card>

            <h6 class="text-muted">
                Canceladas
            </h6>

            <h2 class="text-success">

                {{
                    financiacionStore.resumen
                        .canceladas
                }}

            </h2>

        </Card>

    </div>


    <div class="col-md-3">

        <Card>

            <h6 class="text-muted">
                Total financiado
            </h6>

            <h2 class="text-primary">

                ${{
                    financiacionStore.resumen
                        .totalFinanciado
                        .toLocaleString("es-AR")
                }}

            </h2>

        </Card>

    </div>


    <div class="col-md-3">

        <Card>

            <h6 class="text-muted">
                Saldo pendiente
            </h6>

            <h2 class="text-warning">

                ${{
                    financiacionStore.resumen
                        .saldoPendiente
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
    useFinanciacionStore
} from "../../stores/financiacionStore";


const financiacionStore =
    useFinanciacionStore();

</script>