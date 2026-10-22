import api from "./api";
import { ENDPOINTS } from "./endpoints";

import type {
    MarcaProducto,
    MarcaProductoCreateDto,
    MarcaProductoUpdateDto
} from "../types/marcaProducto";

class MarcaProductoService {

    async obtenerTodos() {

        const response = await api.get<MarcaProducto[]>(
            ENDPOINTS.marcasProducto
        );

        return response.data;

    }

    async crear(dto: MarcaProductoCreateDto) {

        const response = await api.post<MarcaProducto>(
            ENDPOINTS.marcasProducto,
            dto
        );

        return response.data;

    }

    async actualizar(dto: MarcaProductoUpdateDto) {

        await api.put(
            `${ENDPOINTS.marcasProducto}/${dto.id}`,
            dto
        );

    }

    async eliminar(id: number) {

        await api.delete(
            `${ENDPOINTS.marcasProducto}/${id}`
        );

    }

}

export default new MarcaProductoService();