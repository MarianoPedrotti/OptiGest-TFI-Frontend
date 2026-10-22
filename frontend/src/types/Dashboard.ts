export interface Dashboard{

    ventasDelDia:number;

    vehiculosDisponibles:number;

    clientesConDeuda:number;

    financiacionesActivas:number;

    cuotasVencidas:number;

    ultimasVentas:UltimaVenta[];

    proximasCuotas:ProximaCuota[];
    ventasUltimos7Dias: VentaDashboard[];

}
export interface UltimaVenta{

    ventaId:number;

    cliente:string;

    total:number;

    fecha:string;

    estado:string;

}

export interface ProximaCuota{

    cuotaId:number;

    cliente:string;

    numeroCuota:number;

    fechaVencimiento:string;

    monto:number;

}
export interface VentaDashboard {
    fecha: string;
    total: number;
}