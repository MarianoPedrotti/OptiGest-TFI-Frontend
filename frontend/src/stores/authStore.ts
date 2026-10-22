import { defineStore } from "pinia";

import type {
    LoginResponse
} from "../types/auth";

import {
    guardarSesion,
    obtenerSesion,
    borrarSesion
} from "../utils/auth";


export const useAuthStore = defineStore("auth", {

    state: () => ({

        usuario: null as LoginResponse | null,

    }),

    getters: {

        estaLogueado:
            (state) =>
                state.usuario !== null,

        nombre:
            (state) =>
                state.usuario?.nombre ?? "",

        rol:
            (state) =>
                state.usuario?.rol ?? "",

        token:
            (state) =>
                state.usuario?.token ?? "",

    },

    actions: {

        cargarSesion() {

            this.usuario =
                obtenerSesion();

        },

        logout() {

            borrarSesion();

            this.usuario = null;

        },

        setUsuario(
            usuario: LoginResponse
        ) {

            guardarSesion(usuario);

            this.usuario = usuario;

        }

    }

});