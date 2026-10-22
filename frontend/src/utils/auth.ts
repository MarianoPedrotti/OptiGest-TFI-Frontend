import type { LoginResponse } from "../types/auth";
const KEY = "session";

export function guardarSesion(session: LoginResponse){

    localStorage.setItem(
        KEY,
        JSON.stringify(session)
    );

}

export function obtenerSesion(): LoginResponse | null {

    const data = localStorage.getItem(KEY);

    return data
        ? JSON.parse(data) as LoginResponse
        : null;

}

export function borrarSesion(){

    localStorage.removeItem(KEY);

}