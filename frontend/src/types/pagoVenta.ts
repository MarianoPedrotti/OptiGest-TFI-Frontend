export interface PagoVenta {

    id: number;

    ventaId: number;

    monto: number;

    formaPago: string;

    fecha: string;

}

export interface CrearPagoVentaDto {

    ventaId: number;

    formaPago: string;
    monto: number;

}