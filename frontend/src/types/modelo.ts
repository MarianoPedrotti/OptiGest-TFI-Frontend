export interface Modelo {

    id: number;

    marcaVehiculoId: number;

    nombre: string;

    cilindrada: number;

    tipoMotor: string;

}

export interface ModeloCreateDto {

    marcaVehiculoId: number;

    nombre: string;

    cilindrada: number;

    tipoMotor: string;

}

export interface ModeloUpdateDto {

    id: number;

    marcaVehiculoId: number;

    nombre: string;

    cilindrada: number;

    tipoMotor: string;

}