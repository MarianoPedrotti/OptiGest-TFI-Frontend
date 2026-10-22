<template>
<h3>Nueva Venta</h3>

<div class="row g-3">
    <div class="col-12 col-lg-6">
        <SelectInput label="Cliente" v-model="form.clienteId">
            <option :value="0">Seleccione...</option>
            <option
                v-for="cliente in clienteStore.clientes"
                :key="cliente.id"
                :value="cliente.id"
            >
                {{ cliente.nombre }}
            </option>
        </SelectInput>
    </div>

    <div class="col-12 col-lg-6">
        <SelectInput
            label="Tipo de venta"
            :model-value="tipoVentaPendiente ?? tipoVenta"
            @update:model-value="solicitarCambioTipoVenta"
        >
            <option value="articulos">Artículos</option>
            <option value="vehiculo">Vehículo</option>
        </SelectInput>
    </div>
</div>

<div v-if="tipoVenta === 'vehiculo'" class="row g-3">
    <div class="col-12">
        <SelectInput label="Vehículo" v-model="form.vehiculoId">
            <option :value="0">Seleccione...</option>
            <option
                v-for="vehiculo in vehiculoStore.vehiculos.filter(vehiculo => vehiculo.estado === 'Disponible')"
                :key="vehiculo.id"
                :value="vehiculo.id"
            >
                {{ vehiculo.marca }} {{ vehiculo.modelo }} - {{ vehiculo.anio }} - {{ vehiculo.patente }}
            </option>
        </SelectInput>
    </div>
</div>

<template v-else>
    <div class="row g-3 align-items-end">
        <div class="col-12 col-lg-7">
            <SelectInput label="Producto" v-model="productoAAgregar">
                <option :value="0">Seleccione...</option>
                <option
                    v-for="producto in productoStore.productos"
                    :key="producto.id"
                    :value="producto.id"
                >
                    {{ producto.nombre }} (Stock: {{ producto.stock }})
                </option>
            </SelectInput>
        </div>

        <div class="col-12 col-sm-6 col-lg-3">
            <BaseInput
                v-model="cantidadAAgregar"
                type="number"
                min="1"
                label="Cantidad"
            />
        </div>

        <div class="col-12 col-sm-6 col-lg-2 mb-3">
            <button class="btn btn-outline-primary w-100" @click="agregarProducto">
                Agregar Producto
            </button>
        </div>
    </div>

    <div v-if="form.detalles.length" class="table-responsive mt-4">
        <table class="table table-bordered align-middle">
            <thead>
                <tr>
                    <th>Producto</th>
                    <th class="cantidad-columna">Cantidad</th>
                    <th class="text-end">Precio</th>
                    <th class="text-end">Subtotal</th>
                    <th></th>
                </tr>
            </thead>

            <tbody>
                <tr v-for="item in form.detalles" :key="item.productoId">
                    <td>
                        <div>{{ obtenerProducto(item.productoId)?.nombre || "Producto no disponible" }}</div>
                        <small v-if="mensajeDetalle(item)" class="text-danger">
                            {{ mensajeDetalle(item) }}
                        </small>
                    </td>

                    <td>
                        <input
                            class="form-control form-control-sm"
                            type="number"
                            min="1"
                            :value="item.cantidad"
                            @input="actualizarCantidad(item, $event)"
                        >
                    </td>

                    <td class="text-end">
                        ${{ (obtenerProducto(item.productoId)?.precioVenta ?? 0).toLocaleString("es-AR") }}
                    </td>

                    <td class="text-end">
                        ${{ subtotalArticulo(item).toLocaleString("es-AR") }}
                    </td>

                    <td class="text-end">
                        <button
                            class="btn btn-danger btn-sm"
                            title="Eliminar producto"
                            @click="eliminarProducto(item.productoId)"
                        >
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <div v-else class="alert alert-light border mt-4 mb-0">
        Agregá uno o más artículos para registrar la venta.
    </div>
</template>

<div class="mt-3">
    <h5 v-if="tipoVenta === 'articulos'">
        Total artículos: ${{ totalProductos.toLocaleString("es-AR") }}
    </h5>

    <h5 v-else>
        Total vehículo: ${{ totalVehiculo.toLocaleString("es-AR") }}
    </h5>

    <h4 class="fw-bold">
        Total venta: ${{ totalVenta.toLocaleString("es-AR") }}
    </h4>
</div>

<div class="row g-3 mt-3">
    <div class="col-12 col-md-4">
        <SelectInput label="Pago inicial" v-model="form.tipoPago">
            <option value="SinPago">Sin pago</option>
            <option value="Parcial">Pago parcial</option>
            <option value="Total">Pago total</option>
        </SelectInput>
    </div>

    <div v-if="form.tipoPago !== 'SinPago'" class="col-12 col-md-4">
        <SelectInput label="Forma de pago" v-model="form.formaPago">
            <option value="">Seleccione...</option>
            <option value="Efectivo">Efectivo</option>
            <option value="Transferencia">Transferencia</option>
            <option value="Tarjeta">Tarjeta</option>
        </SelectInput>
    </div>

    <div v-if="form.tipoPago === 'Parcial'" class="col-12 col-md-4">
        <BaseInput
            v-model="form.montoPago"
            type="number"
            min="1"
            label="Monto del pago parcial"
        />
        <small v-if="mensajePagoInicialInvalido" class="text-danger d-block mt-n2">
            {{ mensajePagoInicialInvalido }}
        </small>
    </div>
</div>

<div class="responsive-actions justify-content-end mt-3">
    <PrimaryButton :disabled="guardando || resultadoVentaDesconocido" @click="guardarVenta">
        {{ guardando ? "Guardando..." : "Guardar Venta" }}
    </PrimaryButton>
</div>

<div v-if="resultadoVentaDesconocido" class="alert alert-warning mt-3 mb-0">
    El servidor no pudo confirmar el resultado de la venta. Consultá el estado antes de intentar registrar otra.
</div>

<ToastAlert
    :visible="alertaVisible"
    :tipo="alertaTipo"
    :titulo="alertaTitulo"
    :mensaje="alertaMensaje"
    @close="alertaVisible = false"
/>

<ConfirmModal
    :visible="confirmarCambioTipoVisible"
    titulo="Cambiar tipo de venta"
    :mensaje="mensajeCambioTipo"
    @confirmar="confirmarCambioTipoVenta"
    @cancelar="cancelarCambioTipoVenta"
/>

<ConfirmModal
    :visible="confirmarFinanciacionVisible"
    titulo="Financiar venta"
    mensaje="La venta fue registrada correctamente. ¿Desea financiar el saldo pendiente?"
    @confirmar="aceptarFinanciacion"
    @cancelar="cancelarFinanciacion"
/>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import BaseInput from "../base/BaseInput.vue";
import PrimaryButton from "../buttons/PrimaryButton.vue";
import ConfirmModal from "../alerts/ConfirmModal.vue";
import ToastAlert from "../alerts/ToastAlert.vue";
import SelectInput from "../forms/SelectInput.vue";
import { useClienteStore } from "../../stores/clienteStore";
import { useProductoStore } from "../../stores/productoStore";
import { useVehiculoStore } from "../../stores/vehiculoStore";
import ventaService from "../../services/ventaService";
import type { DetalleVentaDto, PagoInicialVentaDto, Venta } from "../../types/venta";
import {
    getApiErrorCode,
    getApiErrors,
    getApiStatus
} from "../../utils/formErrors";
import { esVentaElegibleParaFinanciar } from "../../utils/ventaElegibilidad";

type TipoVenta = "vehiculo" | "articulos";

interface ArticuloSeleccionado {
    productoId: number;
    cantidad: number | string;
}

const router = useRouter();
const productoStore = useProductoStore();
const clienteStore = useClienteStore();
const vehiculoStore = useVehiculoStore();
const tipoVenta = ref<TipoVenta>("articulos");
const tipoVentaPendiente = ref<TipoVenta | null>(null);
const confirmarCambioTipoVisible = ref(false);
const productoAAgregar = ref(0);
const cantidadAAgregar = ref<number | string>(1);
const guardando = ref(false);
const resultadoVentaDesconocido = ref(false);
const confirmarFinanciacionVisible = ref(false);
const ventaCreadaId = ref<number | null>(null);
const alertaVisible = ref(false);
const alertaTipo = ref<"success" | "error" | "warning" | "info">("success");
const alertaTitulo = ref("");
const alertaMensaje = ref("");
let timeoutAlerta: ReturnType<typeof setTimeout> | null = null;

const form = reactive({
    clienteId: 0,
    vehiculoId: 0,
    tipoPago: "SinPago",
    formaPago: "",
    montoPago: 0 as number | string,
    detalles: [] as ArticuloSeleccionado[]
});

const mensajeCambioTipo = computed(() => tipoVentaPendiente.value === "vehiculo"
    ? "Se eliminarán los artículos seleccionados. ¿Desea continuar?"
    : "Se eliminará el vehículo seleccionado. ¿Desea continuar?");
const totalProductos = computed(() => form.detalles
    .reduce((total, item) => total + subtotalArticulo(item), 0));
const totalVehiculo = computed(() => {
    if (tipoVenta.value !== "vehiculo")
        return 0;

    return vehiculoStore.vehiculos
        .find(vehiculo => vehiculo.id === form.vehiculoId)
        ?.precioVenta ?? 0;
});
const totalVenta = computed(() => totalProductos.value + totalVehiculo.value);
const mensajePagoInicialInvalido = computed(() => {
    if (form.tipoPago !== "Parcial")
        return "";

    const monto = Number(form.montoPago);

    if (!Number.isFinite(monto) || monto <= 0)
        return "Ingrese un pago inicial positivo.";

    if (monto >= totalVenta.value)
        return "El pago parcial debe ser menor al total actual de la venta.";

    return "";
});

watch(() => form.tipoPago, (tipoPago) => {
    if (tipoPago === "SinPago") {
        form.formaPago = "";
        form.montoPago = 0;
    }
    else if (tipoPago === "Total") {
        form.montoPago = 0;
    }
    else {
        form.montoPago = 0;
    }
});

onMounted(async () => {
    try {
        await Promise.all([
            clienteStore.obtenerTodos(),
            vehiculoStore.cargarVehiculos(),
            productoStore.obtenerTodos()
        ]);
    }
    catch (error) {
        console.error(error);
        mostrarAlerta(
            "error",
            "Error de carga",
            "No se pudieron cargar los datos necesarios para registrar la venta."
        );
    }
});

function obtenerProducto(id: number) {
    return productoStore.productos.find(producto => producto.id === id);
}

function esCantidadValida(cantidad: number | string): boolean {
    const valor = Number(cantidad);

    return Number.isInteger(valor) && valor > 0;
}

function mensajeDetalle(item: ArticuloSeleccionado): string {
    const producto = obtenerProducto(item.productoId);
    const cantidad = Number(item.cantidad);

    if (!producto)
        return "El producto ya no está disponible.";

    if (!esCantidadValida(item.cantidad))
        return "La cantidad debe ser un número entero positivo.";

    if (cantidad > producto.stock)
        return `Stock disponible: ${producto.stock}.`;

    return "";
}

function subtotalArticulo(item: ArticuloSeleccionado): number {
    const producto = obtenerProducto(item.productoId);

    if (!producto || !esCantidadValida(item.cantidad))
        return 0;

    return producto.precioVenta * Number(item.cantidad);
}

function solicitarCambioTipoVenta(valor: string | number) {
    const nuevoTipo: TipoVenta = valor === "vehiculo" ? "vehiculo" : "articulos";

    if (nuevoTipo === tipoVenta.value)
        return;

    const requiereConfirmacion = tipoVenta.value === "articulos"
        ? form.detalles.length > 0
        : form.vehiculoId !== 0;

    if (requiereConfirmacion) {
        tipoVentaPendiente.value = nuevoTipo;
        confirmarCambioTipoVisible.value = true;
        return;
    }

    aplicarCambioTipoVenta(nuevoTipo);
}

function confirmarCambioTipoVenta() {
    if (tipoVentaPendiente.value)
        aplicarCambioTipoVenta(tipoVentaPendiente.value);

    confirmarCambioTipoVisible.value = false;
    tipoVentaPendiente.value = null;
}

function cancelarCambioTipoVenta() {
    confirmarCambioTipoVisible.value = false;
    tipoVentaPendiente.value = null;
}

function aplicarCambioTipoVenta(nuevoTipo: TipoVenta) {
    tipoVenta.value = nuevoTipo;

    if (nuevoTipo === "vehiculo") {
        form.detalles = [];
        productoAAgregar.value = 0;
        cantidadAAgregar.value = 1;
    }
    else {
        form.vehiculoId = 0;
    }
}

function agregarProducto() {
    const producto = obtenerProducto(productoAAgregar.value);
    const cantidad = Number(cantidadAAgregar.value);

    if (!producto) {
        mostrarAlerta("warning", "Producto requerido", "Seleccione un producto para agregar.");
        return;
    }

    if (!Number.isInteger(cantidad) || cantidad <= 0) {
        mostrarAlerta("warning", "Cantidad inválida", "La cantidad debe ser un número entero positivo.");
        return;
    }

    const existente = form.detalles.find(item => item.productoId === producto.id);
    const cantidadActual = existente ? Number(existente.cantidad) : 0;

    if (existente && !esCantidadValida(existente.cantidad)) {
        mostrarAlerta("warning", "Cantidad inválida", "Corrija la cantidad actual antes de agregar más unidades.");
        return;
    }

    const cantidadAcumulada = cantidadActual + cantidad;

    if (cantidadAcumulada > producto.stock) {
        mostrarAlerta(
            "warning",
            "Stock insuficiente",
            `No hay stock suficiente de ${producto.nombre}. Stock disponible: ${producto.stock}.`
        );
        return;
    }

    if (existente)
        existente.cantidad = cantidadAcumulada;
    else
        form.detalles.push({ productoId: producto.id, cantidad });

    productoAAgregar.value = 0;
    cantidadAAgregar.value = 1;
}

function actualizarCantidad(item: ArticuloSeleccionado, event: Event) {
    item.cantidad = (event.target as HTMLInputElement).value;
}

function eliminarProducto(productoId: number) {
    const indice = form.detalles.findIndex(item => item.productoId === productoId);

    if (indice >= 0)
        form.detalles.splice(indice, 1);
}

function construirDetalles(): DetalleVentaDto[] | null {
    if (tipoVenta.value === "vehiculo") {
        if (form.vehiculoId <= 0) {
            mostrarAlerta("warning", "Vehículo requerido", "Seleccione un vehículo para registrar la venta.");
            return null;
        }

        return [{ vehiculoId: form.vehiculoId, cantidad: 1 }];
    }

    if (form.detalles.length === 0) {
        mostrarAlerta("warning", "Venta sin artículos", "Debe seleccionar al menos un artículo o un vehículo.");
        return null;
    }

    const detalles: DetalleVentaDto[] = [];

    for (const item of form.detalles) {
        const error = mensajeDetalle(item);

        if (error) {
            mostrarAlerta("warning", "Artículo inválido", error);
            return null;
        }

        detalles.push({
            productoId: item.productoId,
            cantidad: Number(item.cantidad)
        });
    }

    return detalles;
}

function construirPagoInicial(): PagoInicialVentaDto | undefined | null {
    if (form.tipoPago === "SinPago")
        return undefined;

    if (!form.formaPago) {
        mostrarAlerta("warning", "Forma de pago requerida", "Debe seleccionar una forma de pago.");
        return null;
    }

    if (form.tipoPago === "Total") {
        return {
            formaPago: form.formaPago,
            monto: totalVenta.value
        };
    }

    if (mensajePagoInicialInvalido.value) {
        mostrarAlerta("warning", "Pago inicial inválido", mensajePagoInicialInvalido.value);
        return null;
    }

    return {
        formaPago: form.formaPago,
        monto: Number(form.montoPago)
    };
}

async function guardarVenta() {
    if (guardando.value || resultadoVentaDesconocido.value)
        return;

    if (form.clienteId <= 0) {
        mostrarAlerta("warning", "Cliente requerido", "Debe seleccionar un cliente para registrar la venta.");
        return;
    }

    const detalles = construirDetalles();

    if (!detalles)
        return;

    const pagoInicial = construirPagoInicial();

    if (pagoInicial === null)
        return;

    guardando.value = true;

    let venta: Venta;

    try {
        venta = await ventaService.crear({
            clienteId: form.clienteId,
            detalles,
            pagoInicial
        });
    }
    catch (error) {
        console.error(error);
        const { general } = getApiErrors(error);
        const status = getApiStatus(error);
        const code = getApiErrorCode(error);

        if (code === "resultado_no_confirmado" || status === undefined) {
            resultadoVentaDesconocido.value = true;
            mostrarAlerta(
                "warning",
                "Resultado pendiente de confirmar",
                general || "El servidor no pudo confirmar el resultado. Consultá el estado antes de volver a intentarlo."
            );
        }
        else if (status === 409) {
            try {
                await Promise.all([
                    productoStore.obtenerTodos(true),
                    vehiculoStore.cargarVehiculos()
                ]);
            }
            catch (refreshError) {
                console.error("No se pudo actualizar el inventario tras el conflicto:", refreshError);
            }
            mostrarAlerta(
                "warning",
                "El inventario cambió",
                general || "La disponibilidad cambió mientras registrabas la venta. Revisá los datos e intentá nuevamente."
            );
        }
        else {
            mostrarAlerta(
                "error",
                "Error al registrar la venta",
                general || "No se pudo registrar la venta."
            );
        }

        guardando.value = false;
        return;
    }

    try {
        await Promise.all([
            productoStore.obtenerTodos(true),
            vehiculoStore.cargarVehiculos()
        ]);

        let ventaCompleta = venta;

        if (venta.tieneVehiculo) {
            try {
                ventaCompleta = await ventaService.obtenerPorId(venta.id);
            }
            catch (error) {
                console.error("No se pudo comprobar la elegibilidad de financiación:", error);
            }
        }

        if (esVentaElegibleParaFinanciar(ventaCompleta)) {
            ventaCreadaId.value = venta.id;
            confirmarFinanciacionVisible.value = true;
            return;
        }

        finalizarVentaRegistrada();
    }
    catch (error) {
        console.error("No se pudieron actualizar los datos posteriores a una venta creada:", error);
        mostrarAlerta(
            "warning",
            "Venta registrada",
            "La venta se registró, pero no se pudieron actualizar algunos datos de pantalla. Consultá el estado antes de continuar."
        );
        limpiarFormulario();
        guardando.value = false;
    }
}

function aceptarFinanciacion() {
    confirmarFinanciacionVisible.value = false;

    if (ventaCreadaId.value)
        router.push(`/financiaciones/nueva/${ventaCreadaId.value}`);
}

function cancelarFinanciacion() {
    confirmarFinanciacionVisible.value = false;
    ventaCreadaId.value = null;
    finalizarVentaRegistrada();
}

function finalizarVentaRegistrada() {
    mostrarAlerta("success", "Venta registrada", "La venta se registró correctamente.");
    limpiarFormulario();
    guardando.value = false;
}

function limpiarFormulario() {
    form.clienteId = 0;
    form.vehiculoId = 0;
    form.tipoPago = "SinPago";
    form.formaPago = "";
    form.montoPago = 0;
    form.detalles = [];
    productoAAgregar.value = 0;
    cantidadAAgregar.value = 1;
    tipoVenta.value = "articulos";
}

function mostrarAlerta(
    tipo: "success" | "error" | "warning" | "info",
    titulo: string,
    mensaje: string
) {
    if (timeoutAlerta)
        clearTimeout(timeoutAlerta);

    alertaTipo.value = tipo;
    alertaTitulo.value = titulo;
    alertaMensaje.value = mensaje;
    alertaVisible.value = true;
    timeoutAlerta = setTimeout(() => {
        alertaVisible.value = false;
    }, 3500);
}
</script>

<style scoped>
.cantidad-columna {
    min-width: 120px;
}
</style>
