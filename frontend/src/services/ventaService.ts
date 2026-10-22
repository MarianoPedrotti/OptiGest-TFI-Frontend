import api from "./api";
import { ENDPOINTS } from "./endpoints";

import type {
    Venta,
    CrearVentaDto,
    VentaResumen
} from "../types/venta";


class VentaService {

    async obtenerTodos() {

        const response =
            await api.get<Venta[]>(
                ENDPOINTS.ventas
            );

        return response.data;

    }


    async obtenerPorId(id: number) {

        const response =
            await api.get<Venta>(
                `${ENDPOINTS.ventas}/${id}`
            );

        return response.data;

    }


    async crear(dto: CrearVentaDto) {

        const response =
            await api.post<Venta>(
                ENDPOINTS.ventas,
                dto
            );

        return response.data;

    }


    async obtenerResumen() {

        const response =
            await api.get<VentaResumen>(
                `${ENDPOINTS.ventas}/resumen`
            );

        return response.data;

    }

}


export default new VentaService();