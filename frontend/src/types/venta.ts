export interface Venta {

    id: number;

    fecha: string;

    clienteId: number;
    nombreCliente: string;

    usuarioId: number;
    nombreUsuario: string;

    subtotal: number;
    total: number;

    estado: string;

    vehiculoId: number | null;
    nombreVehiculo: string;

    precioVehiculo: number;

    tieneVehiculo: boolean;
    tieneFinanciacion: boolean;

    estaPagada: boolean;
    saldoPendiente: number;
    financiacionId: number | null;
    detalles: DetalleVenta[];
    pagos: PagoVenta[];
    financiacion: FinanciacionResumen | null;

}


export interface DetalleVenta {

    id: number;

    productoId: number | null;
    nombreProducto: string | null;

    vehiculoId: number | null;
    nombreVehiculo: string | null;

    cantidad: number;

    precioUnitario: number;

    subtotal: number;

}


export interface DetalleVentaDto {

    productoId?: number;

    vehiculoId?: number;

    cantidad: number;

}


export interface PagoInicialVentaDto {

    monto: number;

    formaPago: string;

}


export interface CrearVentaDto {

    clienteId: number;

    detalles: DetalleVentaDto[];

    pagoInicial?: PagoInicialVentaDto;

}
export interface PagoVenta {

    id: number;

    ventaId: number;

    formaPago: string;

    monto: number;

    fecha: string;

}
export interface FinanciacionResumen {

    id: number;

    ventaId: number;

    cantidadCuotas: number;

    montoFinanciado: number;

    coeficienteAplicado: number;

    montoTotal: number;

    estado: string;

    fechaCreacion: string;
    interesTotal: number;

montoPagado: number;

saldoPendiente: number;

}
export interface VentaResumen {

    ventasDelMes: number;

    montoVendidoMes: number;

    pendientes: number;

    pagadas: number;

}