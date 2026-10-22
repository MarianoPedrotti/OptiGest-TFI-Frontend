export interface ConfiguracionFinanciacion {

    id: number;

    cantidadCuotas: number;

    tasaInteres: number;

    montoMinimo:number;

    montoMaximo:number;

    activa: boolean;

}

export interface ConfiguracionFinanciacionCreateDto {

    cantidadCuotas: number;

    tasaInteres: number;

    montoMinimo:number;

    montoMaximo:number;

}

export interface ConfiguracionFinanciacionUpdateDto {

    id: number;

    cantidadCuotas: number;

    tasaInteres: number;

    montoMinimo:number;

    montoMaximo:number;

    activa: boolean;

}