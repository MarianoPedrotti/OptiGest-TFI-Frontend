export interface Financiacion{

    id:number;

    ventaId:number;

    nombreCliente:string;

    nombreVehiculo:string;

    cantidadCuotas:number;

    montoFinanciado:number;

    coeficienteAplicado:number;

    montoTotal:number;

    estado:string;

    fechaCreacion:string;

}
export interface FinanciacionResumen {

    activas: number;

    canceladas: number;

    totalFinanciado: number;

    saldoPendiente: number;

}
