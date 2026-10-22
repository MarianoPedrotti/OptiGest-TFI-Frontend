export interface Usuario {

    id: number;

    nombre: string;

    apellido: string;

    email: string;

    role: string;

    comision: number;

}


export interface UsuarioCreateDto {

    nombre: string;

    apellido: string;

    email: string;

    password: string;

    comision: number;

}


export interface UsuarioUpdateDto {

    nombre: string;

    apellido: string;

    email: string;

    password?: string;

    comision: number;

}