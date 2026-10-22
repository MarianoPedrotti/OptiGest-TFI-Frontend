import api from "./api";
import { ENDPOINTS } from "./endpoints";

import type { Producto } from "../types/producto";
import type { ProductoCreateDto, ProductoUpdateDto, ProductoResumen } from "../types/producto";
class ProductoService {

    async obtenerTodos() {

        const response =
            await api.get<Producto[]>(
                ENDPOINTS.productos
            );

        return response.data;

    }
    async crear(dto: ProductoCreateDto) {

    const response =
        await api.post<Producto>(
            ENDPOINTS.productos,
            dto
        );

    return response.data;

}
    async actualizar(dto: ProductoUpdateDto){

    await api.put(

        `${ENDPOINTS.productos}/${dto.id}`,

        dto

    );

}
async eliminar(id:number){

    await api.delete(

        `${ENDPOINTS.productos}/${id}`

    );

}
async obtenerResumen() {

    const response =
        await api.get<ProductoResumen>(
            `${ENDPOINTS.productos}/resumen`
        );

    return response.data;

}
}

export default new ProductoService();