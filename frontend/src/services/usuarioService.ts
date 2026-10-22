import api from "./api";

import { ENDPOINTS } from "../services/endpoints";

import type {
    Usuario,
    UsuarioCreateDto,
    UsuarioUpdateDto
} from "../types/usuario";


class UsuarioService {

    async obtenerTodos() {

        const response =
            await api.get<Usuario[]>(
                ENDPOINTS.usuarios
            );

        return response.data;

    }


    async obtenerPorId(id: number) {

        const response =
            await api.get<Usuario>(
                `${ENDPOINTS.usuarios}/${id}`
            );

        return response.data;

    }


    async crear(
        dto: UsuarioCreateDto
    ) {

        const response =
            await api.post<Usuario>(
                ENDPOINTS.usuarios,
                dto
            );

        return response.data;

    }


    async actualizar(
        id: number,
        dto: UsuarioUpdateDto
    ) {

        const response =
            await api.put<Usuario>(
                `${ENDPOINTS.usuarios}/${id}`,
                dto
            );

        return response.data;

    }


    async eliminar(id: number) {

        await api.delete(
            `${ENDPOINTS.usuarios}/${id}`
        );

    }

}


export default new UsuarioService();