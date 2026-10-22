export interface MarcaVehiculo {

    id: number;
    nombreMarca: string;

    nombre: string;

}

export interface MarcaVehiculoCreateDto {

    nombre: string;

}

export interface MarcaVehiculoUpdateDto {

    id: number;

    nombre: string;

}