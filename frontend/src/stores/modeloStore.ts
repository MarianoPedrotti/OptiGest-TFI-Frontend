import { defineStore } from "pinia";

import modeloService from "../services/modeloService";

import type {
    Modelo,
    ModeloCreateDto,
    ModeloUpdateDto
} from "../types/modelo";

export const useModeloStore = defineStore("modelo", {

    state: () => ({

        modelos: [] as Modelo[]

    }),

    actions: {

        async cargarTodos() {

            this.modelos =
                await modeloService.obtenerTodos();

        },

        async cargarPorMarca(marcaId: number) {

            this.modelos =
                await modeloService.obtenerPorMarca(marcaId);

        },

        async crear(dto: ModeloCreateDto) {

            await modeloService.crear(dto);

            await this.cargarTodos();

        },

        async actualizar(dto: ModeloUpdateDto) {

            await modeloService.actualizar(dto);

            await this.cargarTodos();

        },

        async eliminar(id: number) {

            await modeloService.eliminar(id);

            await this.cargarTodos();

        }

    }

});