<template>

<div>

    <div class="mb-3">

        <BackButton
            texto="Volver al dashboard"
            ruta="/"
        />

    </div>

    <Card>

        <PageHeader
            titulo="Cuotas"
            subtitulo="Todas las cuotas registradas"
        />

        <div class="row g-3 mb-4">

            <div class="col-md-6">

                <BaseInput
                    label="Buscar"
                    placeholder="Cliente..."
                    v-model="busqueda"
                />

            </div>

            <div class="col-md-3">

                <SelectInput
                    label="Estado"
                    v-model="estadoFiltro"
                >

                    <option value="">
                        Todos
                    </option>

                    <option value="Pendiente">
                        Pendiente
                    </option>

                    <option value="Pagada">
                        Pagada
                    </option>

                </SelectInput>

            </div>

            <div class="col-md-3">

                <SelectInput
                    label="Vencimiento"
                    v-model="vencimientoFiltro"
                >

                    <option value="">
                        Todos
                    </option>

                    <option value="vencidas">
                        Vencidas
                    </option>

                    <option value="hoy">
                        Vencen hoy
                    </option>

                    <option value="proximas">
                        Próximas
                    </option>

                </SelectInput>

            </div>

        </div>

        <CuotasTodasTable
            :cuotas="cuotasFiltradas"
        />

    </Card>

</div>

</template>


<script setup lang="ts">

import {
    computed,
    onMounted,
    ref
} from "vue";

import { useCuotaStore } from "../stores/cuotaStore";

import Card from "../components/cards/Card.vue";
import PageHeader from "../components/page/PageHeader.vue";
import BackButton from "../components/buttons/BackButton.vue";

import BaseInput from "../components/base/BaseInput.vue";
import SelectInput from "../components/forms/SelectInput.vue";

import CuotasTodasTable
    from "../components/cuotas/CuotasTodasTable.vue";


const cuotaStore =
    useCuotaStore();


const busqueda =
    ref("");

const estadoFiltro =
    ref("");

const vencimientoFiltro =
    ref("");


// ==========================
// Carga
// ==========================

onMounted(async () => {

    await cuotaStore.cargarTodas();

});


// ==========================
// Filtro
// ==========================

const cuotasFiltradas = computed(() => {

    const texto =
        busqueda.value
            .trim()
            .toLowerCase();

    const hoy =
        new Date();

    hoy.setHours(0, 0, 0, 0);


    return cuotaStore.cuotas
        .filter(cuota => {

            // --------------------------
            // Búsqueda
            // --------------------------

            const coincideBusqueda =
                !texto ||

                cuota.nombreCliente
                    ?.toLowerCase()
                    .includes(texto);


            // --------------------------
            // Estado
            // --------------------------

            const coincideEstado =
                !estadoFiltro.value ||

                cuota.estado ===
                    estadoFiltro.value;


            // --------------------------
            // Vencimiento
            // --------------------------

            let coincideVencimiento =
                true;

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


            if (
                vencimientoFiltro.value ===
                "vencidas"
            ) {

                coincideVencimiento =
                    cuota.estado !== "Pagada" &&
                    fecha < hoy;

            }


            if (
                vencimientoFiltro.value ===
                "hoy"
            ) {

                coincideVencimiento =
                    cuota.estado !== "Pagada" &&
                    fecha.getTime() ===
                        hoy.getTime();

            }


            if (
                vencimientoFiltro.value ===
                "proximas"
            ) {

                coincideVencimiento =
                    cuota.estado !== "Pagada" &&
                    fecha > hoy;

            }


            return (
                coincideBusqueda &&
                coincideEstado &&
                coincideVencimiento
            );

        })

        // Pendientes primero,
        // luego por vencimiento
        .sort((a, b) => {

            if (
                a.estado !== b.estado
            ) {

                if (
                    a.estado === "Pendiente"
                )
                    return -1;

                if (
                    b.estado === "Pendiente"
                )
                    return 1;

            }

            return (
                new Date(
                    a.fechaVencimiento
                ).getTime()
                -
                new Date(
                    b.fechaVencimiento
                ).getTime()
            );

        });

});

</script>