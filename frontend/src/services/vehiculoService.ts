import api from "./api";
import { ENDPOINTS } from "./endpoints";

import type {
    Vehiculo,
    VehiculoCreateDto,
    VehiculoUpdateDto,
    VehiculoResumen
} from "../types/vehiculo";

class VehiculoService {

    async obtenerTodos(): Promise<Vehiculo[]> {

        const response = await api.get<Vehiculo[]>(
            ENDPOINTS.vehiculos
        );

        return response.data;
    }
async obtenerDisponibles(): Promise<Vehiculo[]> {

    const response = await api.get<Vehiculo[]>(
        `${ENDPOINTS.vehiculos}/disponibles`
    );

    return response.data;
}
    async obtenerPorId(id: number): Promise<Vehiculo> {

        const response = await api.get<Vehiculo>(
            `${ENDPOINTS.vehiculos}/${id}`
        );

        return response.data;
    }

    async obtenerPorModelo(modeloId: number): Promise<Vehiculo[]> {

        const response = await api.get<Vehiculo[]>(
            `${ENDPOINTS.vehiculos}/modelo/${modeloId}`
        );

        return response.data;
    }

    async crear(dto: VehiculoCreateDto): Promise<Vehiculo> {

        const response = await api.post<Vehiculo>(
            ENDPOINTS.vehiculos,
            dto
        );

        return response.data;
    }

    async actualizar(dto: VehiculoUpdateDto): Promise<void> {

        await api.put(
            `${ENDPOINTS.vehiculos}/${dto.id}`,
            dto
        );
    }

    async eliminar(id: number): Promise<void> {

        await api.delete(
            `${ENDPOINTS.vehiculos}/${id}`
        );
    }
    async obtenerResumen() {

    const response =
        await api.get<VehiculoResumen>(
            `${ENDPOINTS.vehiculos}/resumen`
        );

    return response.data;

}
}

export default new VehiculoService();