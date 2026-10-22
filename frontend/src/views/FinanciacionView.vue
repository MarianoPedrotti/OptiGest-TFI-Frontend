<template>

<Card>

    <PageHeader
        titulo="Financiaciones"
        subtitulo="Administración de Financiaciones"
    />


    <FinanciacionStats />


    <!-- ========================== -->
    <!-- Filtros -->
    <!-- ========================== -->

    <div class="row g-3 mb-4">

        <div class="col-md-6">

            <BaseInput
                label="Buscar"
                placeholder="Cliente o vehículo..."
                v-model="financiacionStore.filtros.busqueda"
            />

        </div>


        <div class="col-md-3">

            <SelectInput
                label="Estado"
                v-model="financiacionStore.filtros.estado"
            >

                <option value="">
                    Todos
                </option>

                <option value="Activa">
                    Activa
                </option>

                <option value="Cancelada">
                    Cancelada
                </option>

            </SelectInput>

        </div>


        <div class="col-md-3">

            <SelectInput
                label="Cantidad de cuotas"
                v-model="financiacionStore.filtros.cuotas"
            >

                <option :value="0">
                    Todas
                </option>

                <option
                    v-for="cantidad in cantidadesCuotas"
                    :key="cantidad"
                    :value="cantidad"
                >

                    {{ cantidad }} cuotas

                </option>

            </SelectInput>

        </div>

    </div>


    <div v-if="financiacionStore.cargando" class="text-center py-5" role="status">
        <div class="spinner-border text-primary"></div>
        <p class="text-muted mt-3">Actualizando financiaciones...</p>
    </div>

    <FinanciacionTable
        v-else
        :financiaciones="financiacionesFiltradas"
    />

</Card>

</template>


<script setup lang="ts">

import {
    computed,
    onMounted
} from "vue";

import Card from "../components/cards/Card.vue";
import PageHeader from "../components/page/PageHeader.vue";

import BaseInput from "../components/base/BaseInput.vue";
import SelectInput from "../components/forms/SelectInput.vue";

import FinanciacionTable from "../components/financiaciones/FinanciacionTable.vue";
import FinanciacionStats from "../components/financiaciones/FinanciacionStats.vue";

import {
    useFinanciacionStore
} from "../stores/financiacionStore";


const financiacionStore =
    useFinanciacionStore();


// ==========================
// Cantidades de cuotas
// disponibles
// ==========================

const cantidadesCuotas =
    computed(() => {

        return [
            ...new Set(
                financiacionStore.financiaciones
                    .map(f =>
                        f.cantidadCuotas
                    )
            )
        ]
        .sort((a, b) => a - b);

    });


// ==========================
// Financiaciones filtradas
// ==========================

const financiacionesFiltradas =
    computed(() => {

        const texto =
            financiacionStore.filtros.busqueda
                .trim()
                .toLowerCase();


        return financiacionStore
            .financiaciones
            .filter(financiacion => {

                const coincideBusqueda =
                    !texto ||

                    financiacion.nombreCliente
                        .toLowerCase()
                        .includes(texto) ||

                    financiacion.nombreVehiculo
                        ?.toLowerCase()
                        .includes(texto);


                const coincideEstado =
                    !financiacionStore.filtros.estado ||

                    financiacion.estado ===
                    financiacionStore.filtros.estado;


                const coincideCuotas =
                    Number(financiacionStore.filtros.cuotas) === 0 ||

                    financiacion.cantidadCuotas ===
                    Number(financiacionStore.filtros.cuotas);


                return (
                    coincideBusqueda &&
                    coincideEstado &&
                    coincideCuotas
                );

            });

    });


// ==========================
// Carga
// ==========================

onMounted(async () => {

    await financiacionStore.cargarListado();

});

</script>
