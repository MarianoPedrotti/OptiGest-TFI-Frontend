import { defineStore } from "pinia";

import vehiculoService from "../services/vehiculoService";

import type {
    Vehiculo,
    VehiculoCreateDto,
    VehiculoUpdateDto,
    VehiculoResumen
} from "../types/vehiculo";

export const useVehiculoStore = defineStore("vehiculo", {

    state: () => ({

        vehiculos: [] as Vehiculo[],
        vehiculoSeleccionado: null as Vehiculo | null,
        resumen: null as VehiculoResumen | null

    }),

    actions: {

        async cargarVehiculos() {

            this.vehiculos =
                await vehiculoService.obtenerTodos();

        },

        async cargarDisponibles() {

            this.vehiculos =
                await vehiculoService.obtenerDisponibles();

        },

        async crear(dto: VehiculoCreateDto) {

            await vehiculoService.crear(dto);

            await this.cargarVehiculos();

        },

        async actualizar(dto: VehiculoUpdateDto) {

            await vehiculoService.actualizar(dto);

            await this.cargarVehiculos();

        },

        async eliminar(id: number) {

            await vehiculoService.eliminar(id);

            await this.cargarVehiculos();

        },
        async cargarResumen() {

    this.resumen =
        await vehiculoService.obtenerResumen();

}

    }

});