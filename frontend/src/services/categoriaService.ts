import api from "./api";
import { ENDPOINTS } from "./endpoints";

import type {
    Categoria,
    CategoriaCreateDto,
    CategoriaUpdateDto
} from "../types/categoria";

class CategoriaService {

    async obtenerTodos(){

        const response = await api.get<Categoria[]>(
            ENDPOINTS.categorias
        );

        return response.data;

    }

    async crear(dto:CategoriaCreateDto){

        const response = await api.post<Categoria>(
            ENDPOINTS.categorias,
            dto
        );

        return response.data;

    }

    async actualizar(dto:CategoriaUpdateDto){

        await api.put(
            `${ENDPOINTS.categorias}/${dto.id}`,
            dto
        );

    }

    async eliminar(id:number){

        await api.delete(
            `${ENDPOINTS.categorias}/${id}`
        );

    }

}

export default new CategoriaService();