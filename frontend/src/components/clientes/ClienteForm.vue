<template>

<div class="row g-3">

    <div class="col-md-6">

        <BaseInput
            label="Nombre"
            placeholder="Nombre del cliente"
            v-model="form.nombre"
        />

    </div>

    <div class="col-md-6">

        <BaseInput
            label="DNI"
            placeholder="DNI del cliente"
            v-model="form.dni"
        />

    </div>

    <div class="col-md-6">

        <BaseInput
            label="Teléfono"
            placeholder="Número de teléfono"
            v-model="form.telefono"
        />

    </div>

    <div class="col-md-6">

        <BaseInput
            label="Email"
            placeholder="Correo electrónico"
            v-model="form.email"
        />

    </div>

    <div class="col-md-6">

        <BaseInput
            label="Dirección"
            placeholder="Dirección del cliente"
            v-model="form.direccion"
        />
    </div>
<div class="col-md-6 ">

    <PrimaryButton 
        @click="guardar"
    >

        {{ props.cliente ? "Actualizar" : "Guardar" }}

    </PrimaryButton>

</div>
</div>

</template>

<script setup lang="ts">
import type { ClienteUpdateDto } from "../../types/cliente";
import BaseInput from "../base/BaseInput.vue";
import { reactive, watch } from "vue";
import PrimaryButton from "../buttons/PrimaryButton.vue";
const emit = defineEmits(["guardar"]);
const form = reactive({

    nombre: "",
    dni: "",
    telefono: "",
    email: "",
    direccion:"",

});
function guardar(){

    if(props.cliente){

    emit("guardar",{

        id:props.cliente.id,

        ...form

    });

}
    else{

    emit("guardar",{

        ...form

    });

}

}
const props = defineProps<{

    cliente?: ClienteUpdateDto | null;

}>();
watch(

    () => props.cliente,

    (nuevoCliente) => {

        if(!nuevoCliente){

            form.nombre = "";
            form.dni = "";
            form.telefono = "";
            form.email = "";
            form.direccion = "";

            return;

        }

        form.nombre = nuevoCliente.nombre;
        form.dni = nuevoCliente.dni;
        form.telefono = nuevoCliente.telefono;
        form.email = nuevoCliente.email;
        form.direccion = nuevoCliente.direccion;
    },

    { immediate:true }

);
</script>
