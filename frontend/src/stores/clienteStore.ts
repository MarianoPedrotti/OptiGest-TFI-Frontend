import { defineStore } from "pinia";

import clienteService from "../services/clienteService";

import type { Cliente, ClienteCreateDto, ClienteUpdateDto,ClienteResumen } from "../types/cliente";

export const useClienteStore = defineStore("clientes", {

    state: () => ({

        clientes: [] as Cliente[],
        resumen: null as ClienteResumen | null,
        cargando: false,
    }),
    actions: {

        async obtenerTodos(force = false) {

            if (this.clientes.length > 0 && !force)
                return;

            this.cargando = true;

            try {

                this.clientes =
                    await clienteService.obtenerTodos();

            }

            finally {

                this.cargando = false;

            }

        },
        async crear(dto: ClienteCreateDto){

    const cliente =
        await clienteService.crear(dto);

    this.clientes.push(cliente);

},
async actualizar(dto: ClienteUpdateDto){

    await clienteService.actualizar(dto);

    await this.obtenerTodos(true);

},
async eliminar(id:number){

    await clienteService.eliminar(id);

    await this.obtenerTodos(true);

},
async cargarResumen() {

    this.resumen =
        await clienteService.obtenerResumen();

},
    }

});