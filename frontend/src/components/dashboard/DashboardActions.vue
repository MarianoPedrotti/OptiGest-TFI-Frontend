<template>

<div class="card shadow-sm h-100">

    <div class="card-header">

        <h5 class="mb-0">

            Acciones rápidas

        </h5>

    </div>

    <div class="card-body">

        <div class="row g-3">

            <div class="col-6">

                <RouterLink
                    to="/ventas/nuev0"
                    class="btn btn-primary w-100 py-3"
                >

                    <i class="bi bi-cart-plus fs-3 d-block mb-2"></i>

                    Nueva Venta

                </RouterLink>

            </div>

            <div class="col-6">

                <RouterLink
                    to="/clientes"
                    class="btn btn-success w-100 py-3"
                >

                    <i class="bi bi-person-plus fs-3 d-block mb-2"></i>

                    Nuevo Cliente

                </RouterLink>

            </div>

            <div class="col-6">

                <RouterLink
                    to="/vehiculos"
                    class="btn btn-warning w-100 py-3"
                >

                    <i class="bi bi-bicycle fs-3 d-block mb-2"></i>

                    Nuevo Vehículo

                </RouterLink>

            </div>

            <div class="col-6">

                <RouterLink
                    to="/pagos"
                    class="btn btn-info w-100 py-3 text-white"
                >

                    <i class="bi bi-cash-stack fs-3 d-block mb-2"></i>

                    Registrar Pago

                </RouterLink>

            </div>

        </div>

    </div>

</div>

</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>