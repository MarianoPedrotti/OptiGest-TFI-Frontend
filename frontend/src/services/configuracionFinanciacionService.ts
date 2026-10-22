import api from "./api";
import { ENDPOINTS } from "./endpoints";

import type {
    ConfiguracionFinanciacion,
    ConfiguracionFinanciacionCreateDto,
    ConfiguracionFinanciacionUpdateDto
} from "../types/ConfiguracionFinanciacion";

class ConfiguracionFinanciacionService {

    async obtenerTodos() {

        const response = await api.get<ConfiguracionFinanciacion[]>(
            ENDPOINTS.configuracionFinanciacion
        );

        return response.data;

    }

    async obtenerActivas() {

        const response = await api.get<ConfiguracionFinanciacion[]>(
            `${ENDPOINTS.configuracionFinanciacion}/activas`
        );

        return response.data;

    }

    async crear(dto: ConfiguracionFinanciacionCreateDto) {

        const response = await api.post<ConfiguracionFinanciacion>(
            ENDPOINTS.configuracionFinanciacion,
            dto
        );

        return response.data;

    }

    async actualizar(dto: ConfiguracionFinanciacionUpdateDto) {

        await api.put(
            `${ENDPOINTS.configuracionFinanciacion}/${dto.id}`,
            dto
        );

    }

    async eliminar(id:number){

        await api.delete(
            `${ENDPOINTS.configuracionFinanciacion}/${id}`
        );

    }

}

export default new ConfiguracionFinanciacionService();