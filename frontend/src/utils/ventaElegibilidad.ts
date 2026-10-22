import type { Venta } from "../types/venta";

function tieneFinanciacionRegistrada(venta: Venta): boolean {
    return venta.tieneFinanciacion ||
        venta.financiacionId !== null ||
        venta.financiacion !== null;
}

function tieneEstadoOperable(venta: Venta): boolean {
    return venta.estado === "Pendiente" ||
        venta.estado === "PagoParcial" ||
        venta.estado === "Parcial";
}

function tieneUnSoloVehiculo(venta: Venta): boolean {
    if (venta.detalles.length !== 1)
        return false;

    const [detalle] = venta.detalles;

    return venta.tieneVehiculo &&
        detalle?.vehiculoId !== null &&
        detalle?.vehiculoId !== undefined &&
        detalle.productoId === null &&
        detalle.cantidad === 1;
}

export function puedeRequerirDetalleParaFinanciacion(venta: Venta): boolean {
    return venta.tieneVehiculo &&
        !tieneFinanciacionRegistrada(venta) &&
        tieneEstadoOperable(venta) &&
        venta.saldoPendiente > 0;
}

export function esVentaElegibleParaFinanciar(venta: Venta): boolean {
    return puedeRequerirDetalleParaFinanciacion(venta) &&
        tieneUnSoloVehiculo(venta);
}

export function puedeRegistrarPagoDirecto(venta: Venta): boolean {
    return !tieneFinanciacionRegistrada(venta) &&
        tieneEstadoOperable(venta) &&
        venta.saldoPendiente > 0;
}
