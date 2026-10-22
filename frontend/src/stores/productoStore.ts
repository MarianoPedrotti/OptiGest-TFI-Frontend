import { defineStore } from "pinia";

import productoService from "../services/productoService";

import type { Producto } from "../types/producto";
import type { ProductoCreateDto, ProductoUpdateDto, ProductoResumen} from "../types/producto";

export const useProductoStore = defineStore("productos", {

    state: () => ({

        productos: [] as Producto[],
        resumen: null as ProductoResumen | null,

        cargando: false

    }),

    actions: {

        async obtenerTodos(force = false) {

            if (this.productos.length > 0 && !force)
                return;

            this.cargando = true;

            try {

                this.productos =
                    await productoService.obtenerTodos();

            }

            finally {

                this.cargando = false;

            }

        },
        async crear(dto: ProductoCreateDto){

    const producto =
        await productoService.crear(dto);

    this.productos.push(producto);

},
async actualizar(dto: ProductoUpdateDto){

    await productoService.actualizar(dto);

    await this.obtenerTodos(true);

},
async eliminar(id:number){

    await productoService.eliminar(id);

    await this.obtenerTodos(true);

},
async cargarResumen() {

    this.resumen =
        await productoService.obtenerResumen();

}

    }

});