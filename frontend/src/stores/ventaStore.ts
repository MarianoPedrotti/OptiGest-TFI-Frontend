import { defineStore } from "pinia";

import ventaService from "../services/ventaService";

import type {
    Venta,
    CrearVentaDto,
    VentaResumen
} from "../types/venta";

export const useVentaStore = defineStore("venta", {

    state: () => ({

        ventas: [] as Venta[],

        ventaActual: null as Venta | null,

        resumen: null as VentaResumen | null

    }),

    actions: {

        async cargarVentas() {

            this.ventas =
                await ventaService.obtenerTodos();

        },


        async crear(dto: CrearVentaDto) {

            await ventaService.crear(dto);

            await this.cargarVentas();

        },


        async cargarVenta(id: number) {

            this.ventaActual =
                await ventaService.obtenerPorId(id);

        },


        async cargarResumen() {

            this.resumen =
                await ventaService.obtenerResumen();

        }

    }

});