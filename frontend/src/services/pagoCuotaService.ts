import api from "./api";

import type {
    PagoCuota,
    CrearPagoCuotaDto
} from "../types/pagoCuota";

export default {

    async crear(dto: CrearPagoCuotaDto): Promise<PagoCuota>{

        const response = await api.post("/PagoCuota", dto);

        return response.data;

    },

    async obtenerTodos(): Promise<PagoCuota[]>{

        const response = await api.get("/PagoCuota");

        return response.data;

    },

    async obtenerPorId(id:number): Promise<PagoCuota>{

        const response = await api.get(`/PagoCuota/${id}`);

        return response.data;

    }

}