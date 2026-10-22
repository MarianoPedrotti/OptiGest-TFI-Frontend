import api from "./api";
import { ENDPOINTS } from "./endpoints";

import type {
    Financiacion,
    FinanciacionResumen
} from "../types/financiacion";


class FinanciacionService {

    async obtenerTodos(): Promise<Financiacion[]> {

        const { data } =
            await api.get<Financiacion[]>(
                ENDPOINTS.financiaciones
            );

        return data;

    }


    async obtenerPorId(
        id: number
    ): Promise<Financiacion> {

        const { data } =
            await api.get<Financiacion>(
                `${ENDPOINTS.financiaciones}/${id}`
            );

        return data;

    }


    async crear(dto: {

        ventaId: number;

        configuracionFinanciacionId: number;

    }): Promise<Financiacion> {

        const { data } =
            await api.post<Financiacion>(
                ENDPOINTS.financiaciones,
                dto
            );

        return data;

    }


    async obtenerResumen():
        Promise<FinanciacionResumen> {

        const { data } =
            await api.get<FinanciacionResumen>(
                `${ENDPOINTS.financiaciones}/resumen`
            );

        return data;

    }

}


export default new FinanciacionService();