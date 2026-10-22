export interface Cliente{

    id:number

    nombre:string

    telefono:string

    email:string
    
    direccion:string

    dni:string
}
export interface ClienteCreateDto {


    nombre:string

    telefono:string

    email:string
    
    direccion:string

    dni:string

}
export interface ClienteUpdateDto {
    
    id:number

    nombre:string

    telefono:string

    email:string
    
    direccion:string

    dni:string

}
export interface ClienteResumen {

    totalClientes: number;

    clientesConDeuda: number;

    clientesAlDia: number;

    deudaTotal: number;

}