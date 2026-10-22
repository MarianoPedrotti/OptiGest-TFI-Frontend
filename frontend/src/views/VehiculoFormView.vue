<template>

<div class="container-fluid">

    <Card>
        
        <div class="container-fluid">
                <BackButton
            texto="Volver a vehiculos"
            ruta="/vehiculos"
        />
        </div>
        <PageHeader
            :titulo="
                esEdicion
                    ? 'Editar Vehículo'
                    : 'Nuevo Vehículo'
            "
            subtitulo="Completá los datos del vehículo"
        />


        <VehiculoForm
            :vehiculo="vehiculo"
            @guardar="guardarVehiculo"
        />

    </Card>


    <ToastAlert
        :visible="alertaVisible"
        tipo="error"
        titulo="No se pudo guardar"
        :mensaje="alertaMensaje"
        @close="alertaVisible = false"
    />
</div>
</template>


<script setup lang="ts">

import {
    computed,
    onMounted,
    ref
} from "vue";

import {
    useRoute,
    useRouter
} from "vue-router";


import { useVehiculoStore } from "../stores/vehiculoStore.ts";

import { getApiErrors } from "../utils/formErrors.ts";
import BackButton from "../components/buttons/BackButton.vue";


import type {

    Vehiculo,

    VehiculoCreateDto,

    VehiculoUpdateDto

} from "../types/vehiculo.ts";


import Card from "../components/cards/Card.vue";

import PageHeader from "../components/page/PageHeader.vue";

import VehiculoForm from "../components/vehiculo/VehiculoForm.vue";

import ToastAlert from "../components/alerts/ToastAlert.vue";


const route =
    useRoute();


const router =
    useRouter();


const vehiculoStore =
    useVehiculoStore();


const vehiculo =
    ref<Vehiculo | null>(null);


const alertaVisible =
    ref(false);


const alertaMensaje =
    ref("");


const esEdicion =
    computed(
        () =>
            route.name ===
            "editar-vehiculo"
    );


function mostrarError(
    mensaje: string
) {

    alertaMensaje.value =
        mensaje ||
        "No se pudo guardar el vehículo.";

    alertaVisible.value =
        true;

}


async function guardarVehiculo(
    value:
        | VehiculoCreateDto
        | VehiculoUpdateDto
) {

    try {

        if ("id" in value) {

            await vehiculoStore
                .actualizar(value);

        }
        else {

            await vehiculoStore
                .crear(value);

        }


        await router.push(
            "/vehiculos"
        );

    }
    catch (error: unknown) {

        const parsed =
            getApiErrors(error);


        let mensaje =
            parsed.general;


        if (!mensaje) {

            const primerError =
                Object.values(
                    parsed.fields
                )[0];


            if (primerError) {

                mensaje =
                    primerError;

            }

        }


        mostrarError(

            mensaje ||

            "No se pudo guardar el vehículo."

        );

    }

}


onMounted(async () => {

    if (!esEdicion.value) {

        return;

    }


    await vehiculoStore
        .cargarVehiculos();


    const id =
        Number(
            route.params.id
        );


    if (
        !Number.isInteger(id) ||
        id <= 0
    ) {

        await router.replace(
            "/vehiculos"
        );

        return;

    }


    vehiculo.value =
        vehiculoStore.vehiculos.find(
            item =>
                item.id === id
        ) ?? null;


    if (!vehiculo.value) {

        await router.replace(
            "/vehiculos"
        );

    }

});

</script>