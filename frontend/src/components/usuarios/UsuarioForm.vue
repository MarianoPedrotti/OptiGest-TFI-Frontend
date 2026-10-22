<template>

<form @submit.prevent="guardar">

    <div class="row g-3">

        <div class="col-md-6">

            <BaseInput
                label="Nombre"
                v-model="form.nombre"
            />

        </div>

        <div class="col-md-6">

            <BaseInput
                label="Apellido"
                v-model="form.apellido"
            />

        </div>

        <div class="col-md-6">

            <BaseInput
                label="Email"
                type="email"
                v-model="form.email"
            />

        </div>

        <div class="col-md-6">

            <BaseInput
                label="Comisión (%)"
                type="number"
                min="0"
                step="0.01"
                v-model="form.comision"
            />

        </div>

        <div class="col-md-6">

            <BaseInput
                :label="
                    modoEdicion
                        ? 'Nueva contraseña (opcional)'
                        : 'Contraseña'
                "
                type="password"
                v-model="form.password"
            />

            <small
                v-if="modoEdicion"
                class="text-muted"
            >
                Dejá vacío para mantener la contraseña actual.
            </small>

        </div>

    </div>


    <div class="responsive-actions mt-4">

        <button
            type="button"
            class="btn btn-outline-secondary"
            @click="cancelar"
        >
            Cancelar
        </button>

        <PrimaryButton type="submit">

            {{ modoEdicion ? "Guardar cambios" : "Crear vendedor" }}

        </PrimaryButton>

    </div>

</form>


<ToastAlert
    :visible="alertaVisible"
    :tipo="alertaTipo"
    :titulo="alertaTitulo"
    :mensaje="alertaMensaje"
    @close="alertaVisible = false"
/>

</template>

<script setup lang="ts">

import { computed, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import BaseInput from "../base/BaseInput.vue";
import PrimaryButton from "../buttons/PrimaryButton.vue";
import ToastAlert from "../alerts/ToastAlert.vue";

import { useUsuarioStore } from "../../stores/usuarioStore.ts";


const route = useRoute();
const router = useRouter();

const usuarioStore = useUsuarioStore();


const usuarioId = computed(() => {

    const id = Number(route.params.id);

    return Number.isNaN(id) ? 0 : id;

});


const modoEdicion = computed(() => {

    return usuarioId.value > 0;

});


const form = reactive({

    nombre: "",

    apellido: "",

    email: "",

    password: "",

    comision: 0

});


// ==========================
// Toast
// ==========================

const alertaVisible = ref(false);

const alertaTipo =
    ref<"success" | "error" | "warning" | "info">("success");

const alertaTitulo = ref("");

const alertaMensaje = ref("");


function mostrarAlerta(
    tipo: "success" | "error" | "warning" | "info",
    titulo: string,
    mensaje: string
) {

    alertaTipo.value = tipo;

    alertaTitulo.value = titulo;

    alertaMensaje.value = mensaje;

    alertaVisible.value = true;

}


// ==========================
// Carga
// ==========================

onMounted(async () => {

    if (!modoEdicion.value)
        return;

    try {

        await usuarioStore.cargarUsuario(
            usuarioId.value
        );

        const usuario =
            usuarioStore.usuarioActual;

        if (!usuario) {

            mostrarAlerta(
                "error",
                "Usuario no encontrado",
                "No se encontró el vendedor seleccionado."
            );

            return;

        }

        form.nombre =
            usuario.nombre;

        form.apellido =
            usuario.apellido;

        form.email =
            usuario.email;

        form.comision =
            usuario.comision;

    }
    catch (error) {

        console.error(error);

        mostrarAlerta(
            "error",
            "Error",
            "No se pudo cargar el vendedor."
        );

    }

});


// ==========================
// Guardar
// ==========================

async function guardar() {

    if (!form.nombre.trim()) {

        mostrarAlerta(
            "warning",
            "Nombre requerido",
            "Debe ingresar el nombre del vendedor."
        );

        return;

    }


    if (!form.apellido.trim()) {

        mostrarAlerta(
            "warning",
            "Apellido requerido",
            "Debe ingresar el apellido del vendedor."
        );

        return;

    }


    if (!form.email.trim()) {

        mostrarAlerta(
            "warning",
            "Email requerido",
            "Debe ingresar un email."
        );

        return;

    }


    if (
        !modoEdicion.value &&
        !form.password.trim()
    ) {

        mostrarAlerta(
            "warning",
            "Contraseña requerida",
            "Debe ingresar una contraseña."
        );

        return;

    }


    if (Number(form.comision) < 0) {

        mostrarAlerta(
            "warning",
            "Comisión inválida",
            "La comisión no puede ser negativa."
        );

        return;

    }


    try {

        if (modoEdicion.value) {

            await usuarioStore.actualizar(
                usuarioId.value,
                {
                    nombre:
                        form.nombre.trim(),

                    apellido:
                        form.apellido.trim(),

                    email:
                        form.email.trim(),

                    password:
                        form.password.trim()
                            ? form.password
                            : undefined,

                    comision:
                        Number(form.comision)
                }
            );

        }
        else {

            await usuarioStore.crear({

                nombre:
                    form.nombre.trim(),

                apellido:
                    form.apellido.trim(),

                email:
                    form.email.trim(),

                password:
                    form.password,

                comision:
                    Number(form.comision)

            });

        }


        mostrarAlerta(
            "success",
            modoEdicion.value
                ? "Vendedor actualizado"
                : "Vendedor creado",
            modoEdicion.value
                ? "Los datos se actualizaron correctamente."
                : "El vendedor fue creado correctamente."
        );


        setTimeout(() => {

            router.push(
                "/configuracion/usuarios"
            );

        }, 900);

    }
    catch (error) {

        console.error(error);

        mostrarAlerta(
            "error",
            "Error",
            modoEdicion.value
                ? "No se pudo actualizar el vendedor."
                : "No se pudo crear el vendedor."
        );

    }

}


function cancelar() {

    router.push(
        "/configuracion/usuarios"
    );

}

</script>
