import { defineStore } from "pinia";

import marcaVehiculoService from "../services/marcaVehiculoService";

import type {
    MarcaVehiculo,
    MarcaVehiculoCreateDto,
    MarcaVehiculoUpdateDto
} from "../types/marcaVehiculo";

export const useMarcaVehiculoStore = defineStore("marcaVehiculo", {

    state: () => ({

        marcas: [] as MarcaVehiculo[]

    }),

    actions: {

        async cargarMarcas() {

            this.marcas =
                await marcaVehiculoService.obtenerTodos();

        },

        async crear(dto: MarcaVehiculoCreateDto) {

            await marcaVehiculoService.crear(dto);

            await this.cargarMarcas();

        },

        async actualizar(dto: MarcaVehiculoUpdateDto) {

            await marcaVehiculoService.actualizar(dto);

            await this.cargarMarcas();

        },

        async eliminar(id: number) {

            await marcaVehiculoService.eliminar(id);

            await this.cargarMarcas();

        }

    }

});