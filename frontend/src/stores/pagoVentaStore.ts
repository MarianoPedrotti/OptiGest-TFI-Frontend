import { defineStore } from "pinia";

import pagoVentaService from "../services/pagoVentaService";

import type {
    PagoVenta,
    CrearPagoVentaDto
} from "../types/pagoVenta";

export const usePagoVentaStore = defineStore("pagosVenta", {

    state: () => ({

        pagos: [] as PagoVenta[],

        cargando: false

    }),

    actions: {

        async obtenerTodos(force = false) {

            if (this.pagos.length > 0 && !force)
                return;

            this.cargando = true;

            try {

                this.pagos =
                    await pagoVentaService.obtenerTodos();

            }

            finally {

                this.cargando = false;

            }

        },

        async crear(dto: CrearPagoVentaDto) {

            return await pagoVentaService.crear(dto);

        }

    }

});