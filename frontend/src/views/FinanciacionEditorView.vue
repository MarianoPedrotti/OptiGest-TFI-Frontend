<template>
<div class="container-fluid px-0">

    <h3>Nueva Financiación</h3>

    <div v-if="cargando" class="text-center py-5">
        <div class="spinner-border text-primary"></div>
        <p class="text-muted mt-3">Cargando información para financiar...</p>
    </div>

    <div v-else-if="errorCarga" class="alert alert-danger">
        {{ errorCarga }}
    </div>

    <template v-else-if="venta">
        <div class="row g-3 mt-3 mb-3">
            <div class="col-12 col-md-4">
                <strong>Cliente:</strong>
                {{ venta.nombreCliente }}
            </div>

            <div class="col-12 col-md-4">
                <strong>Vehículo:</strong>
                {{ venta.nombreVehiculo }}
            </div>

            <div class="col-12 col-md-4">
                <strong>Saldo a financiar:</strong>
                ${{ montoFinanciado.toLocaleString("es-AR") }}
            </div>
        </div>

        <div v-if="!esElegible" class="alert alert-warning" role="alert">
            Esta venta ya no reúne las condiciones para financiarse. Actualizá la venta antes de continuar.
        </div>

        <div v-else-if="resultadoDesconocido" class="alert alert-warning" role="alert">
            El servidor no pudo confirmar el resultado de la operación. Consultá el estado de la venta antes de intentar otra financiación.
        </div>

        <div v-else-if="financiacionConfirmada" class="alert alert-info" role="status">
            La financiación fue registrada. Podés volver a intentar abrir su plan de cuotas sin registrar otra financiación.
            <div v-if="financiacionCreadaId" class="responsive-actions justify-content-start mt-3">
                <PrimaryButton
                    :disabled="guardando"
                    @click="abrirCuotas(financiacionCreadaId)"
                >
                    Abrir plan de cuotas
                </PrimaryButton>
            </div>
        </div>

        <template v-else>
            <div v-if="configuracionesDisponibles.length === 0" class="alert alert-info" role="status">
                No hay planes activos compatibles con el saldo pendiente de esta venta.
            </div>

            <div class="row g-3">
                <div class="col-12 col-md-6">
                    <SelectInput
                        label="Plan de financiación"
                        v-model="configuracionId"
                    >
                        <option :value="0">Seleccione...</option>
                        <option
                            v-for="config in configuracionesDisponibles"
                            :key="config.id"
                            :value="config.id"
                        >
                            {{ config.cantidadCuotas }} cuotas - {{ config.tasaInteres }}%
                        </option>
                    </SelectInput>
                </div>
            </div>

            <div v-if="configuracionSeleccionada" class="row g-3 mt-4">
                <div class="col-12 col-md-4">
                    <h5>Monto financiado</h5>
                    <p>${{ montoFinanciado.toLocaleString("es-AR") }}</p>
                </div>

                <div class="col-12 col-md-4">
                    <h5>Cantidad de cuotas</h5>
                    <p>{{ configuracionSeleccionada.cantidadCuotas }}</p>
                </div>

                <div class="col-12 col-md-4">
                    <h5>Valor de la cuota</h5>
                    <p>${{ valorCuota.toLocaleString("es-AR") }}</p>
                </div>
            </div>

            <div class="responsive-actions justify-content-start mt-3">
                <PrimaryButton
                    :disabled="!puedeConfirmar"
                    @click="guardarFinanciacion"
                >
                    {{ guardando ? "Guardando..." : "Confirmar financiación" }}
                </PrimaryButton>
            </div>
        </template>
    </template>

    <ConfirmModal
        :visible="confirmarVisible"
        titulo="Confirmar financiación"
        :mensaje="mensajeConfirmacion"
        @confirmar="confirmarFinanciacion"
        @cancelar="confirmarVisible = false"
    />

    <ToastAlert
        :visible="alertaVisible"
        :tipo="alertaTipo"
        :titulo="alertaTitulo"
        :mensaje="alertaMensaje"
        @close="alertaVisible = false"
    />
</div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import ConfirmModal from "../components/alerts/ConfirmModal.vue";
import ToastAlert from "../components/alerts/ToastAlert.vue";
import SelectInput from "../components/forms/SelectInput.vue";
import PrimaryButton from "../components/buttons/PrimaryButton.vue";
import { useConfiguracionFinanciacionStore } from "../stores/configuracionFinanciacionStore";
import { useFinanciacionStore } from "../stores/financiacionStore";
import ventaService from "../services/ventaService";
import type { Venta } from "../types/venta";
import {
    getApiErrorCode,
    getApiErrors,
    getApiStatus
} from "../utils/formErrors";
import { esVentaElegibleParaFinanciar } from "../utils/ventaElegibilidad";

const router = useRouter();
const route = useRoute();
const configuracionStore = useConfiguracionFinanciacionStore();
const financiacionStore = useFinanciacionStore();
const venta = ref<Venta | null>(null);
const configuracionId = ref(0);
const cargando = ref(true);
const guardando = ref(false);
const resultadoDesconocido = ref(false);
const financiacionConfirmada = ref(false);
const financiacionCreadaId = ref<number | null>(null);
const errorCarga = ref("");
const confirmarVisible = ref(false);
const alertaVisible = ref(false);
const alertaTipo = ref<"success" | "error" | "warning" | "info">("success");
const alertaTitulo = ref("");
const alertaMensaje = ref("");

const esElegible = computed(() => venta.value !== null &&
    esVentaElegibleParaFinanciar(venta.value));
const montoFinanciado = computed(() => venta.value?.saldoPendiente ?? 0);
const configuracionesDisponibles = computed(() => configuracionStore.configuraciones
    .filter(configuracion => configuracion.activa &&
        montoFinanciado.value >= configuracion.montoMinimo &&
        montoFinanciado.value <= configuracion.montoMaximo));
const configuracionSeleccionada = computed(() => configuracionesDisponibles.value
    .find(configuracion => configuracion.id === configuracionId.value));
const puedeConfirmar = computed(() => esElegible.value &&
    configuracionSeleccionada.value !== undefined &&
    !guardando.value &&
    !resultadoDesconocido.value &&
    !financiacionConfirmada.value);
const montoTotalFinanciacion = computed(() => {
    if (!configuracionSeleccionada.value)
        return 0;

    return montoFinanciado.value *
        (1 + configuracionSeleccionada.value.tasaInteres / 100);
});
const valorCuota = computed(() => {
    if (!configuracionSeleccionada.value)
        return 0;

    return montoTotalFinanciacion.value /
        configuracionSeleccionada.value.cantidadCuotas;
});
const mensajeConfirmacion = computed(() => {
    if (!configuracionSeleccionada.value)
        return "";

    return `Se financiarán $${montoFinanciado.value.toLocaleString("es-AR")} ` +
        `en ${configuracionSeleccionada.value.cantidadCuotas} cuotas, ` +
        `por un total de $${montoTotalFinanciacion.value.toLocaleString("es-AR")}. ` +
        "¿Desea continuar?";
});

watch(configuracionesDisponibles, (configuraciones) => {
    if (configuracionId.value !== 0 &&
        !configuraciones.some(configuracion => configuracion.id === configuracionId.value)) {
        configuracionId.value = 0;
    }
});

async function cargarDatos() {
    cargando.value = true;
    errorCarga.value = "";

    try {
        const id = Number(route.params.id);
        const [ventaResponse] = await Promise.all([
            ventaService.obtenerPorId(id),
            configuracionStore.cargarActivas()
        ]);

        venta.value = ventaResponse;
    }
    catch (error) {
        console.error(error);
        errorCarga.value = "No se pudo cargar la venta o sus planes de financiación.";
    }
    finally {
        cargando.value = false;
    }
}

function guardarFinanciacion() {
    if (resultadoDesconocido.value) {
        mostrarAlerta(
            "warning",
            "Resultado pendiente de confirmar",
            "Consultá el estado de la venta antes de intentar otra financiación."
        );
        return;
    }

    if (!esElegible.value) {
        mostrarAlerta(
            "warning",
            "Venta no financiable",
            "La venta ya no reúne las condiciones para financiarse."
        );
        return;
    }

    if (!configuracionSeleccionada.value) {
        mostrarAlerta(
            "warning",
            "Plan requerido",
            "Seleccione un plan compatible con el saldo pendiente."
        );
        return;
    }

    confirmarVisible.value = true;
}

async function confirmarFinanciacion() {
    if (!venta.value || !puedeConfirmar.value)
        return;

    confirmarVisible.value = false;
    guardando.value = true;

    try {
        const financiacion = await financiacionStore.crear({
            ventaId: venta.value.id,
            configuracionFinanciacionId: configuracionId.value
        });

        financiacionConfirmada.value = true;
        const financiacionId = Number(financiacion.id);

        if (!Number.isInteger(financiacionId) || financiacionId <= 0) {
            mostrarAlerta(
                "warning",
                "Financiación registrada",
                "La financiación se registró, pero la respuesta no incluyó un identificador válido para abrir sus cuotas."
            );
            return;
        }

        financiacionCreadaId.value = financiacionId;
        await abrirCuotas(financiacionId);
    }
    catch (error) {
        const { general } = getApiErrors(error);
        const status = getApiStatus(error);
        const code = getApiErrorCode(error);

        if (status === 409) {
            await cargarDatos();
            mostrarAlerta(
                "warning",
                "La venta cambió",
                general || "La venta cambió mientras operabas. Revisá su estado antes de intentar nuevamente."
            );
        }
        else if (code === "resultado_no_confirmado" || status === undefined) {
            resultadoDesconocido.value = true;
            await cargarDatos();
            mostrarAlerta(
                "warning",
                "Resultado pendiente de confirmar",
                general || "El servidor no pudo confirmar el resultado. Consultá la venta antes de volver a intentarlo."
            );
        }
        else {
            mostrarAlerta(
                "error",
                "No se pudo financiar",
                general || "No se pudo registrar la financiación."
            );
        }

    }
    finally {
        guardando.value = false;
    }
}

async function abrirCuotas(financiacionId: number): Promise<void> {
    guardando.value = true;

    try {
        const resultado = await router.push(`/financiaciones/${financiacionId}/cuotas`);

        if (resultado) {
            mostrarAlerta(
                "warning",
                "Financiación registrada",
                "La financiación se registró, pero no se pudo abrir su plan de cuotas. Podés reintentar la navegación."
            );
        }
    }
    catch (error) {
        console.error(error);
        mostrarAlerta(
            "warning",
            "Financiación registrada",
            "La financiación se registró, pero no se pudo abrir su plan de cuotas. Podés reintentar la navegación."
        );
    }
    finally {
        guardando.value = false;
    }
}

function mostrarAlerta(
    tipo: "success" | "error" | "warning" | "info",
    titulo: string,
    mensaje: string
) {
    alertaTipo.value = tipo;
    alertaTitulo.value = titulo;
    alertaMensaje.value = mensaje;
    alertaVisible.value = true;
}

onMounted(cargarDatos);
</script>
