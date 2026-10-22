export interface Vehiculo {
    id: number;

    modeloId: number;
    modelo: string;

    marcaVehiculoId: number;
    marca: string;

    anio: number;

    vin: string;

    numeroMotor: string;
    kilometraje: number;
    patente: string;

    color: string;

    precioCompra: number;

    precioVenta: number;

    estado: string;
}

export interface VehiculoCreateDto {
    modeloId: number;

    anio: number;

    vin: string;

    numeroMotor: string;
    kilometraje: number;
    patente: string;

    color: string;

    precioCompra: number;

    precioVenta: number;
}

export interface VehiculoUpdateDto {
    id: number;

    modeloId: number;

    anio: number;

    vin: string;

    numeroMotor: string;
    kilometraje: number;
    patente: string;

    color: string;

    precioCompra: number;

    precioVenta: number;

    estado: string;
}
export interface VehiculoResumen {
    totalVehiculos: number;
    disponibles: number;
    vendidos: number;
    valorDisponibles: number;
}