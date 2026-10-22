<template>

<div class="row mb-4">

    <div class="col-md-4">

        <Card>

            <h6 class="text-muted">

                Clientes con deuda

            </h6>

            <h2 class="text-danger">

                {{ clientesConDeuda }}

            </h2>

        </Card>

    </div>

    <div class="col-md-4">

        <Card>

            <h6 class="text-muted">

                Total adeudado

            </h6>

            <h2 class="text-primary">

                ${{ totalAdeudado.toLocaleString("es-AR") }}

            </h2>

        </Card>

    </div>

    <div class="col-md-4">

        <Card>

            <h6 class="text-muted">

                Clientes al día

            </h6>

            <h2 class="text-success">

                {{ clientesAlDia }}

            </h2>

        </Card>

    </div>

</div>

</template>

<script setup lang="ts">

import { computed } from "vue";
import { useCuentaCorrienteStore } from "../../stores/cuentaCorrienteStore";
import Card from "../cards/Card.vue";

const store = useCuentaCorrienteStore();

const clientesConDeuda = computed(() =>
    store.resumen.filter(c => c.saldoActual > 0).length
);

const clientesAlDia = computed(() =>
    store.resumen.filter(c => c.saldoActual <= 0).length
);

const totalAdeudado = computed(() =>
    store.resumen
        .filter(c => c.saldoActual > 0)
        .reduce((total, c) => total + c.saldoActual, 0)
);

</script>