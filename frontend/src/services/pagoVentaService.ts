import api from "./api";

import type {
    PagoVenta,
    CrearPagoVentaDto
} from "../types/pagoVenta";

export default {

    async crear(dto: CrearPagoVentaDto) {

        const { data } = await api.post<PagoVenta>(
            "/PagoVenta",
            dto
        );

        return data;

    },

    async obtenerTodos() {

        const { data } = await api.get<PagoVenta[]>(
            "/PagoVenta"
        );

        return data;

    },

    async obtenerPorId(id: number) {

        const { data } = await api.get<PagoVenta>(
            `/PagoVenta/${id}`
        );

        return data;

    }

};