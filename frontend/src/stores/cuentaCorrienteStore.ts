import { defineStore } from "pinia";
import { ref } from "vue";

import cuentaCorrienteService from "../services/cuentaCorrienteService";

import type { CuentaCorriente } from "../types/CuentaCorriente";
import type { ResumenCuentaCorriente } from "../types/CuentaCorriente";

export const useCuentaCorrienteStore = defineStore("cuentaCorriente", () => {

    const cuenta = ref<CuentaCorriente | null>(null);
    const resumen = ref<ResumenCuentaCorriente[]>([]);

    async function cargar(clienteId: number) {

        cuenta.value =
            await cuentaCorrienteService.obtenerPorCliente(clienteId);

    }

    return {

        cuenta,

        resumen,

        cargar,

        cargarResumen

    };
    async function cargarResumen() {

    resumen.value =
        await cuentaCorrienteService.obtenerResumen();

}

});