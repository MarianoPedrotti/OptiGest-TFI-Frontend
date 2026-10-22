import { defineStore } from "pinia";

import cuotaService from "../services/cuotaService";

import type { Cuota } from "../types/cuota";


export const useCuotaStore =
    defineStore("cuotas", {

        state: () => ({

            cuotas: [] as Cuota[],

            cargando: false,

            solicitudCarga: 0

        }),

        actions: {

        async cargarTodas() {

            const solicitud = ++this.solicitudCarga;
            this.cargando = true;

            try {

                const cuotas =
                    await cuotaService.obtenerTodos();

                if (solicitud === this.solicitudCarga)
                    this.cuotas = cuotas;

            }
            catch (error) {

                if (solicitud === this.solicitudCarga)
                    throw error;

            }
            finally {

                if (solicitud === this.solicitudCarga)
                    this.cargando = false;

                }

            },


        async cargarPorFinanciacion(
            financiacionId: number
        ) {

            const solicitud = ++this.solicitudCarga;
            this.cargando = true;

            try {

                const cuotas =
                    await cuotaService
                        .obtenerPorFinanciacion(
                            financiacionId
                        );

                if (solicitud === this.solicitudCarga)
                    this.cuotas = cuotas;

            }
            catch (error) {

                if (solicitud === this.solicitudCarga)
                    throw error;

            }
            finally {

                if (solicitud === this.solicitudCarga)
                    this.cargando = false;

                }

            }

        }

    });
