import { defineStore } from "pinia";

import marcaProductoService from "../services/marcaProductoService";

import type {
    MarcaProducto,
    MarcaProductoCreateDto,
    MarcaProductoUpdateDto
} from "../types/marcaProducto";

export const useMarcaProductoStore = defineStore("marcaProducto", {

    state: () => ({

        marcas: [] as MarcaProducto[]

    }),

    actions: {

        async cargarMarcas() {

            this.marcas =
                await marcaProductoService.obtenerTodos();

        },

        async crear(dto: MarcaProductoCreateDto) {

            await marcaProductoService.crear(dto);

            await this.cargarMarcas();

        },

        async actualizar(dto: MarcaProductoUpdateDto) {

            await marcaProductoService.actualizar(dto);

            await this.cargarMarcas();

        },

        async eliminar(id: number) {

            await marcaProductoService.eliminar(id);

            await this.cargarMarcas();

        }

    }

});