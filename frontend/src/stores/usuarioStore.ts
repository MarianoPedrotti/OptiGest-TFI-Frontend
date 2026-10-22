import { defineStore } from "pinia";

import usuarioService from "../services/usuarioService";

import type {
    Usuario,
    UsuarioCreateDto,
    UsuarioUpdateDto
} from "../types/usuario";


export const useUsuarioStore =
    defineStore(
        "usuario",
        {

            state: () => ({

                usuarios: [] as Usuario[],

                usuarioActual:
                    null as Usuario | null

            }),


            actions: {

                async cargarUsuarios() {

                    this.usuarios =
                        await usuarioService
                            .obtenerTodos();

                },


                async cargarUsuario(
                    id: number
                ) {

                    this.usuarioActual =
                        await usuarioService
                            .obtenerPorId(id);

                },


                async crear(
                    dto: UsuarioCreateDto
                ) {

                    const usuario =
                        await usuarioService
                            .crear(dto);

                    this.usuarios.push(
                        usuario
                    );

                    return usuario;

                },


                async actualizar(
                    id: number,
                    dto: UsuarioUpdateDto
                ) {

                    const actualizado =
                        await usuarioService
                            .actualizar(
                                id,
                                dto
                            );

                    const index =
                        this.usuarios
                            .findIndex(
                                u => u.id === id
                            );

                    if (index !== -1) {

                        this.usuarios[index] =
                            actualizado;

                    }

                    return actualizado;

                },


                async eliminar(id: number) {

                    await usuarioService
                        .eliminar(id);

                    this.usuarios =
                        this.usuarios.filter(
                            u => u.id !== id
                        );

                }

            }

        }
    );