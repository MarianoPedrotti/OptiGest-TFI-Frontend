import { defineStore } from "pinia";

import subCategoriaService from "../services/subCategoriaService";

import type {
    SubCategoria,
    SubCategoriaCreateDto,
    SubCategoriaUpdateDto
} from "../types/subCategoria";

export const useSubCategoriaStore = defineStore("subCategoria", {

    state: () => ({

        subCategorias: [] as SubCategoria[]

    }),

    actions: {

        async cargarSubCategorias() {

            this.subCategorias =
                await subCategoriaService.obtenerTodos();

        },
        async cargarPorCategoria(categoriaId: number) {

    this.subCategorias =
        await subCategoriaService.obtenerPorCategoria(categoriaId);

},

        async crear(dto: SubCategoriaCreateDto) {

            await subCategoriaService.crear(dto);

            await this.cargarSubCategorias();

        },

        async actualizar(dto: SubCategoriaUpdateDto) {

            await subCategoriaService.actualizar(dto);

            await this.cargarSubCategorias();

        },

        async eliminar(id: number) {

            await subCategoriaService.eliminar(id);

            await this.cargarSubCategorias();

        }

    }

});