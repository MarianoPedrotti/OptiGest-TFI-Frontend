import api from "./api";
import { ENDPOINTS } from "./endpoints";

import type {
    Modelo,
    ModeloCreateDto,
    ModeloUpdateDto
} from "../types/modelo";

class ModeloService {

    async obtenerTodos(): Promise<Modelo[]> {

        const response = await api.get<Modelo[]>(
            ENDPOINTS.modelos
        );

        return response.data;

    }

    async obtenerPorId(id:number): Promise<Modelo>{

        const response = await api.get<Modelo>(
            `${ENDPOINTS.modelos}/${id}`
        );

        return response.data;

    }

    async obtenerPorMarca(marcaVehiculoId:number): Promise<Modelo[]>{

        const response = await api.get<Modelo[]>(
            `${ENDPOINTS.modelos}/marca/${marcaVehiculoId}`
        );

        return response.data;

    }

    async crear(dto:ModeloCreateDto){

        const response = await api.post<Modelo>(
            ENDPOINTS.modelos,
            dto
        );

        return response.data;

    }

    async actualizar(dto:ModeloUpdateDto){

        await api.put(
            `${ENDPOINTS.modelos}/${dto.id}`,
            dto
        );

    }

    async eliminar(id:number){

        await api.delete(
            `${ENDPOINTS.modelos}/${id}`
        );

    }

}

export default new ModeloService();