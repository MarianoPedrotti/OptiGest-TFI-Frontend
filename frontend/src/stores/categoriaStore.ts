import { defineStore } from "pinia";

import categoriaService from "../services/categoriaService";

import type {
    Categoria,
    CategoriaCreateDto,
    CategoriaUpdateDto
} from "../types/categoria";

export const useCategoriaStore = defineStore("categoria", {

    state: () => ({

        categorias: [] as Categoria[]

    }),

    actions: {

        async cargarCategorias() {

            this.categorias =
                await categoriaService.obtenerTodos();

        },

        async crear(dto: CategoriaCreateDto) {

            await categoriaService.crear(dto);

            await this.cargarCategorias();

        },

        async actualizar(dto: CategoriaUpdateDto) {

            await categoriaService.actualizar(dto);

            await this.cargarCategorias();

        },

        async eliminar(id: number) {

            await categoriaService.eliminar(id);

            await this.cargarCategorias();

        }

    }

});