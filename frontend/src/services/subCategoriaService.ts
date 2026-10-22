import api from "./api";
import { ENDPOINTS } from "./endpoints";

import type {
    SubCategoria,
    SubCategoriaCreateDto,
    SubCategoriaUpdateDto
} from "../types/subCategoria";

class SubCategoriaService {

    async obtenerTodos() {

        const response = await api.get<SubCategoria[]>(
            ENDPOINTS.subCategorias
        );

        return response.data;

    }

    async obtenerPorCategoria(categoriaId: number) {

        const response = await api.get<SubCategoria[]>(
            `${ENDPOINTS.subCategorias}/categoria/${categoriaId}`
        );

        return response.data;

    }

    async crear(dto: SubCategoriaCreateDto) {

        const response = await api.post<SubCategoria>(
            ENDPOINTS.subCategorias,
            dto
        );

        return response.data;

    }

    async actualizar(dto: SubCategoriaUpdateDto) {

        await api.put(
            `${ENDPOINTS.subCategorias}/${dto.id}`,
            dto
        );

    }

    async eliminar(id: number) {

        await api.delete(
            `${ENDPOINTS.subCategorias}/${id}`
        );

    }

}

export default new SubCategoriaService();