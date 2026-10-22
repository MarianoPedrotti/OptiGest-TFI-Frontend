// services/cuentaCorrienteService.ts

import api from "./api";
import type { CuentaCorriente } from "../types/CuentaCorriente";

export default {

    async obtenerPorCliente(clienteId: number) {

        const { data } = await api.get<CuentaCorriente>(
            `/CuentaCorriente/${clienteId}`
        );

        return data;

    },
    async obtenerResumen() {
    const response = await api.get("/CuentaCorriente");
    return response.data;
}

};