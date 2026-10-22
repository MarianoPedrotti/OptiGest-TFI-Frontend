<script setup lang="ts">

import {
    computed,
    onMounted,
    ref
} from "vue";

import { useRouter } from "vue-router";

import Card from "../components/cards/Card.vue";
import PageHeader from "../components/page/PageHeader.vue";
import PrimaryButton from "../components/buttons/PrimaryButton.vue";
import BaseInput from "../components/base/BaseInput.vue";
import SelectInput from "../components/forms/SelectInput.vue";

import VentaTable from "../components/venta/VentaTable.vue";
import VentaStats from "../components/venta/VentaStats.vue";

import { useVentaStore } from "../stores/ventaStore";
import ventaService from "../services/ventaService";
import { puedeRequerirDetalleParaFinanciacion } from "../utils/ventaElegibilidad";
import { normalizarEstadoVentaPresentacion } from "../utils/ventaEstadoPresentacion";


const router = useRouter();

const ventaStore = useVentaStore();


// ==========================
// Filtros
// ==========================

const busqueda = ref("");

const estadoFiltro = ref("");

const periodoFiltro = ref("");


// ==========================
// Ventas filtradas
// ==========================

const ventasFiltradas = computed(() => {

    const texto =
        busqueda.value
            .trim()
            .toLowerCase();


    return ventaStore.ventas.filter(venta => {

        // --------------------------
        // Búsqueda
        // --------------------------

        const coincideBusqueda =
            !texto ||

            venta.nombreCliente
                ?.toLowerCase()
                .includes(texto) ||

            venta.nombreUsuario
                ?.toLowerCase()
                .includes(texto) ||

            venta.id
                .toString()
                .includes(texto);


        // --------------------------
        // Estado
        // --------------------------

        const coincideEstado =
            !estadoFiltro.value ||

            normalizarEstadoVentaPresentacion(venta.estado) ===
            estadoFiltro.value;


        // --------------------------
        // Período
        // --------------------------

        let coincidePeriodo = true;

        const fechaVenta =
            new Date(venta.fecha);

        const hoy =
            new Date();


        if (periodoFiltro.value === "hoy") {

            coincidePeriodo =
                fechaVenta.getDate() === hoy.getDate() &&
                fechaVenta.getMonth() === hoy.getMonth() &&
                fechaVenta.getFullYear() === hoy.getFullYear();

        }


        if (periodoFiltro.value === "mes") {

            coincidePeriodo =
                fechaVenta.getMonth() === hoy.getMonth() &&
                fechaVenta.getFullYear() === hoy.getFullYear();

        }


        return (
            coincideBusqueda &&
            coincideEstado &&
            coincidePeriodo
        );

    });

});


// ==========================
// Carga inicial
// ==========================

async function cargarVentas() {

    await Promise.all([

        ventaStore.cargarVentas(),

        ventaStore.cargarResumen()

    ]);

    const candidatas = ventaStore.ventas
        .filter(puedeRequerirDetalleParaFinanciacion);

    await Promise.all(candidatas.map(async (venta) => {
        try {
            const ventaCompleta = await ventaService.obtenerPorId(venta.id);
            const indice = ventaStore.ventas.findIndex(item => item.id === venta.id);

            if (indice >= 0 && ventaCompleta.id === venta.id)
                ventaStore.ventas[indice] = ventaCompleta;
        }
        catch (error) {
            console.error("No se pudo verificar la elegibilidad de financiación:", error);
        }
    }));

}

onMounted(cargarVentas);


// ==========================
// Nueva venta
// ==========================

function nuevaVenta() {

    router.push("/ventas/nuevo");

}

</script>


<template>

<Card>

    <PageHeader
        titulo="Ventas"
        subtitulo="Administración de Ventas"
    >

        <PrimaryButton @click="nuevaVenta">

            Nueva Venta

        </PrimaryButton>

    </PageHeader>


    <VentaStats />


    <!-- ========================== -->
    <!-- Filtros -->
    <!-- ========================== -->

    <div class="row g-3 mb-4">

        <div class="col-md-6">

            <BaseInput
                label="Buscar"
                placeholder="Cliente, vendedor o número de venta..."
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

                <option value="PagoParcial">
                    Pago parcial
                </option>

                <option value="Pagada">
                    Pagada
                </option>

            </SelectInput>

        </div>


        <div class="col-md-3">

            <SelectInput
                label="Período"
                v-model="periodoFiltro"
            >

                <option value="">
                    Todas
                </option>

                <option value="hoy">
                    Hoy
                </option>

                <option value="mes">
                    Este mes
                </option>

            </SelectInput>

        </div>

    </div>


    <VentaTable
        :ventas="ventasFiltradas"
    />

</Card>

</template>
