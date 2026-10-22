import { defineStore } from "pinia";

import configuracionFinanciacionService
from "../services/configuracionFinanciacionService";

import type {
    ConfiguracionFinanciacion,
    ConfiguracionFinanciacionCreateDto,
    ConfiguracionFinanciacionUpdateDto
} from "../types/ConfiguracionFinanciacion";

export const useConfiguracionFinanciacionStore = defineStore("configuracionFinanciacion", {

    state: () => ({

        configuraciones: [] as ConfiguracionFinanciacion[]

    }),

    actions: {

        async cargarConfiguraciones() {

            this.configuraciones =
                await configuracionFinanciacionService.obtenerTodos();

        },

        async cargarActivas() {

            this.configuraciones =
                await configuracionFinanciacionService.obtenerActivas();

        },

        async crear(dto: ConfiguracionFinanciacionCreateDto){

            await configuracionFinanciacionService.crear(dto);

            await this.cargarConfiguraciones();

        },

        async actualizar(dto: ConfiguracionFinanciacionUpdateDto){

            await configuracionFinanciacionService.actualizar(dto);

            await this.cargarConfiguraciones();

        },

        async eliminar(id:number){

            await configuracionFinanciacionService.eliminar(id);

            await this.cargarConfiguraciones();

        }

    }

});