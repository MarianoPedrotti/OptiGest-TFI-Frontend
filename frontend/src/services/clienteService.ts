import api from "./api";
import { ENDPOINTS } from "./endpoints";

import type { Cliente, ClienteCreateDto, ClienteUpdateDto,  ClienteResumen } from "../types/cliente";

class ClienteService {

    async obtenerTodos(): Promise<Cliente[]> {

        const response =
            await api.get<Cliente[]>
            (ENDPOINTS.clientes);

        return response.data;

    }
    async crear(dto: ClienteCreateDto) {

    const response =
        await api.post<Cliente>(
            ENDPOINTS.clientes,
            dto
        );

    return response.data;

    }
    async actualizar(dto: ClienteUpdateDto){

    await api.put(

        `${ENDPOINTS.clientes}/${dto.id}`,

        dto

    );
    }
    async eliminar(id:number){

    await api.delete(

        `${ENDPOINTS.clientes}/${id}`

    );

}
async obtenerResumen(): Promise<ClienteResumen> {

    const response =
        await api.get<ClienteResumen>(
            `${ENDPOINTS.clientes}/resumen`
        );

    return response.data;

}
}

export default new ClienteService();