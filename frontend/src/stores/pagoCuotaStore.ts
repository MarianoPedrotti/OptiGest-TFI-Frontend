import { defineStore } from "pinia";

import pagoCuotaService from "../services/pagoCuotaService";

import type {
    PagoCuota,
    CrearPagoCuotaDto
} from "../types/pagoCuota";

export const usePagoCuotaStore = defineStore("pagosCuota",{

    state:()=>({

        pagos:[] as PagoCuota[]

    }),

    actions:{

        async crear(dto:CrearPagoCuotaDto){

            return await pagoCuotaService.crear(dto);

        },

        async obtenerTodos(){

            this.pagos = await pagoCuotaService.obtenerTodos();

        }

    }

});