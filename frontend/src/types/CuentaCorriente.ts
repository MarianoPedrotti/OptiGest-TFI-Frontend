export interface MovimientoCuentaCorriente {

    id: number;

    fecha: string;

    concepto: string;

    debe: number;

    haber: number;

    saldo: number;

}

export interface CuentaCorriente {

    clienteId: number;

    saldoActual: number;

    movimientos: MovimientoCuentaCorriente[];

}
export interface ResumenCuentaCorriente {

    clienteId: number;

    nombreCliente: string;

    telefono: string;

    saldoActual: number;

    ultimoMovimiento: string;

}