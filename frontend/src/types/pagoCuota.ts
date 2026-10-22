export interface PagoCuota {

    id: number;

    cuotaId: number;

    numeroCuota: number;

    financiacionId: number;

    ventaId: number;

    clienteId: number;

    nombreCliente: string;

    fecha: string;

    monto: number;

    formaPago: string;

}

export interface CrearPagoCuotaDto {

    cuotaId: number;

    monto: number;

    formaPago: string;

}