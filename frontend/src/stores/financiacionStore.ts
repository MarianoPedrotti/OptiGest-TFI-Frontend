import { defineStore } from "pinia";

import financiacionService from "../services/financiacionService";

import type {
    Financiacion,
    FinanciacionResumen
} from "../types/financiacion";


export const useFinanciacionStore =
defineStore("financiaciones", {

    state: () => ({

        financiaciones:
            [] as Financiacion[],

        resumen:
            null as FinanciacionResumen | null,

        filtros: {
            busqueda: "",
            estado: "",
            cuotas: 0
        },

        cargando: false,

        listadoDesactualizado: false,

        versionListado: 0,

        solicitudListado: 0,

        solicitudResumen: 0

    }),

    actions: {

        async obtenerTodos(force = false) {

            if (
                this.financiaciones.length > 0 &&
                !force
            )
                return;


            const solicitud = ++this.solicitudListado;

            this.cargando = true;

            try {

                const financiaciones =
                    await financiacionService
                        .obtenerTodos();

                if (solicitud === this.solicitudListado)
                    this.financiaciones = financiaciones;

            }
            catch (error) {

                if (solicitud === this.solicitudListado)
                    throw error;

            }
            finally {

                if (solicitud === this.solicitudListado)
                    this.cargando = false;

            }

        },


        async obtenerPorId(id: number) {

            return await financiacionService
                .obtenerPorId(id);

        },


        async crear(dto: {

            ventaId: number;

            configuracionFinanciacionId: number;

        }) {

            const financiacion =
                await financiacionService
                    .crear(dto);

            this.invalidarDatos();

            return financiacion;

        },


        invalidarDatos() {

            this.resumen = null;
            this.listadoDesactualizado = true;
            this.versionListado += 1;
            this.solicitudListado += 1;
            this.solicitudResumen += 1;
            this.cargando = false;

        },


        async cargarResumen(force = false) {

            if (this.resumen && !force)
                return;

            const solicitud = ++this.solicitudResumen;

            try {

                const resumen =
                    await financiacionService
                        .obtenerResumen();

                if (solicitud === this.solicitudResumen)
                    this.resumen = resumen;

            }
            catch (error) {

                if (solicitud === this.solicitudResumen)
                    throw error;

            }

        },


        async cargarListado() {

            const version = this.versionListado;
            const force = this.listadoDesactualizado;

            await Promise.all([
                this.obtenerTodos(force),
                this.cargarResumen(force)
            ]);

            if (force && version === this.versionListado)
                this.listadoDesactualizado = false;

        }

    }

});
