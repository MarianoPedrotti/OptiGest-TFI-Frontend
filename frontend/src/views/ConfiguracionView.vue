<template>

<div class="container-fluid">

    <PageHeader
        titulo="Configuración"
        subtitulo="Administración general del sistema"
    />

    <div class="row g-4">

        <!-- Usuarios -->
        <div class="col-md-6 col-xl-3">

            <div
                class="config-card h-100"
                @click="irUsuarios"
            >

                <div class="config-icon">
                    <i class="bi bi-people"></i>
                </div>

                <h5 class="fw-bold mb-2">
                    Usuarios
                </h5>

                <p class="text-muted mb-0">
                    Administrar vendedores y sus comisiones.
                </p>

            </div>

        </div>


        <!-- Productos -->
        <div class="col-md-6 col-xl-3">

            <div
                class="config-card h-100"
                @click="irProductos"
            >

                <div class="config-icon">
                    <i class="bi bi-box-seam"></i>
                </div>

                <h5 class="fw-bold mb-2">
                    Productos
                </h5>

                <p class="text-muted mb-0">
                    Marcas, categorías y subcategorías.
                </p>

            </div>

        </div>


        <!-- Vehículos -->
        <div class="col-md-6 col-xl-3">

            <div
                class="config-card h-100"
                @click="irVehiculos"
            >

                <div class="config-icon">
                    <i class="bi bi-bicycle"></i>
                </div>

                <h5 class="fw-bold mb-2">
                    Vehículos
                </h5>

                <p class="text-muted mb-0">
                    Marcas y modelos de motocicletas.
                </p>

            </div>

        </div>


        <!-- Financiación -->
        <div class="col-md-6 col-xl-3">

            <div
                class="config-card h-100"
                @click="irFinanciacion"
            >

                <div class="config-icon">
                    <i class="bi bi-bank"></i>
                </div>

                <h5 class="fw-bold mb-2">
                    Financiación
                </h5>

                <p class="text-muted mb-0">
                    Configurar planes y condiciones.
                </p>

            </div>

        </div>

    </div>

</div>

</template>

<script setup lang="ts">

import { useRouter } from "vue-router";

import PageHeader from "../components/page/PageHeader.vue";

const router = useRouter();


function irUsuarios() {

    router.push("/configuracion/usuarios");

}


function irProductos() {

    router.push("/configuracion/productos");

}


function irVehiculos() {

    router.push("/configuracion/vehiculos");

}


function irFinanciacion() {

    router.push("/configuracion/financiacion");

}

</script>

<style scoped>

.config-card {

    background: white;

    border: 1px solid #dee2e6;

    border-radius: 12px;

    padding: 24px;

    cursor: pointer;

    transition:
        transform 0.2s ease,
        box-shadow 0.2s ease,
        border-color 0.2s ease;

}

.config-card:hover {

    transform: translateY(-3px);

    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);

    border-color: #adb5bd;

}

.config-icon {

    width: 48px;

    height: 48px;

    border-radius: 10px;

    background: #f1f3f5;

    display: flex;

    align-items: center;

    justify-content: center;

    font-size: 1.4rem;

    margin-bottom: 16px;

}

</style>