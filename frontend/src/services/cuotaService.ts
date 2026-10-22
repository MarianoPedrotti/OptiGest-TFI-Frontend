import api from "./api";
import type { Cuota } from "../types/cuota";

export default {

    async obtenerTodos(): Promise<Cuota[]> {

        const response = await api.get("/Cuota");

        return response.data;

    },

    async obtenerPorId(id: number): Promise<Cuota> {

        const response = await api.get(`/Cuota/${id}`);

        return response.data;

    },

    async obtenerPorFinanciacion(financiacionId: number): Promise<Cuota[]> {

        const response = await api.get(`/Cuota/financiacion/${financiacionId}`);

        return response.data;

    }

}