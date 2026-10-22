import api from "./api";
import { ENDPOINTS } from "./endpoints";

import type {
    MarcaVehiculo,
    MarcaVehiculoCreateDto,
    MarcaVehiculoUpdateDto
} from "../types/marcaVehiculo";

class MarcaVehiculoService {

    async obtenerTodos(): Promise<MarcaVehiculo[]> {

        const response = await api.get<MarcaVehiculo[]>(
            ENDPOINTS.marcasVehiculo
        );

        return response.data;

    }

    async obtenerPorId(id: number): Promise<MarcaVehiculo> {

        const response = await api.get<MarcaVehiculo>(
            `${ENDPOINTS.marcasVehiculo}/${id}`
        );

        return response.data;

    }

    async crear(dto: MarcaVehiculoCreateDto) {

        const response = await api.post<MarcaVehiculo>(
            ENDPOINTS.marcasVehiculo,
            dto
        );

        return response.data;

    }

    async actualizar(dto: MarcaVehiculoUpdateDto) {

        await api.put(
            `${ENDPOINTS.marcasVehiculo}/${dto.id}`,
            dto
        );

    }

    async eliminar(id: number) {

        await api.delete(
            `${ENDPOINTS.marcasVehiculo}/${id}`
        );

    }

}

export default new MarcaVehiculoService();