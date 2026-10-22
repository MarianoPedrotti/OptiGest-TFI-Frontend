<template>
    <div class="row g-3">

        <div class="col-md-6">
            <SelectInput
                label="Marca"
                v-model="form.marcaVehiculoId"
            >
                <option :value="0">
                    Seleccione...
                </option>

                <option
                    v-for="marca in marcaStore.marcas"
                    :key="marca.id"
                    :value="marca.id"
                >
                    {{ marca.nombre }}
                </option>
            </SelectInput>
        </div>


        <div class="col-md-6">
            <SelectInput
                label="Modelo"
                v-model="form.modeloId"
            >
                <option :value="0">
                    Seleccione...
                </option>

                <option
                    v-for="modelo in modeloStore.modelos"
                    :key="modelo.id"
                    :value="modelo.id"
                >
                    {{ modelo.nombre }}
                </option>
            </SelectInput>
        </div>


        <div class="col-md-4">
            <BaseInput
                label="Año"
                type="number"
                v-model="form.anio"
            />
        </div>


        <div class="col-md-4">
            <BaseInput
                label="Color"
                placeholder="Color"
                v-model="form.color"
            />
        </div>


        <div class="col-md-4">
            <BaseInput
                label="Kilometraje"
                type="number"
                v-model="form.kilometraje"
            />
        </div>


        <div class="col-md-6">
            <BaseInput
                label="VIN"
                placeholder="VIN"
                v-model="form.vin"
            />
        </div>


        <div class="col-md-6">
            <BaseInput
                label="Número Motor"
                placeholder="Número de motor"
                v-model="form.numeroMotor"
            />
        </div>


        <div class="col-md-4">
            <BaseInput
                label="Patente"
                placeholder="Patente"
                v-model="form.patente"
            />
        </div>


        <div class="col-md-4">
            <BaseInput
                label="Precio Compra"
                type="number"
                placeholder="Precio de compra"
                v-model="form.precioCompra"
            />
        </div>


        <div class="col-md-4">
            <BaseInput
                label="Precio Venta"
                type="number"
                placeholder="Precio de venta"
                v-model="form.precioVenta"
            />
        </div>


        <div
            class="col-md-6"
            v-if="vehiculo"
        >
            <SelectInput
                label="Estado"
                v-model="form.estado"
            >
                <option value="Disponible">
                    Disponible
                </option>

                <option value="Reservado">
                    Reservado
                </option>

                <option value="Vendido">
                    Vendido
                </option>
            </SelectInput>
        </div>


        <div class="col-12">
            <PrimaryButton @click="guardar">
                Guardar
            </PrimaryButton>
        </div>

    </div>


    <ToastAlert
        :visible="alertaVisible"
        :tipo="alertaTipo"
        :titulo="alertaTitulo"
        :mensaje="alertaMensaje"
        @close="alertaVisible = false"
    />
</template>


<script setup lang="ts">

import {
    reactive,
    watch,
    onMounted,
    ref
} from "vue";

import BaseInput from "../base/BaseInput.vue";
import SelectInput from "../forms/SelectInput.vue";
import PrimaryButton from "../buttons/PrimaryButton.vue";
import ToastAlert from "../alerts/ToastAlert.vue";

import { useMarcaVehiculoStore } from "../../stores/marcaVehiculoStore";
import { useModeloStore } from "../../stores/modeloStore";

import type {
    Vehiculo,
    VehiculoCreateDto,
    VehiculoUpdateDto
} from "../../types/vehiculo";


const props = defineProps<{
    vehiculo?: Vehiculo | null;
}>();


const emit = defineEmits<{
    (
        e: "guardar",
        value: VehiculoCreateDto | VehiculoUpdateDto
    ): void;
}>();


const marcaStore = useMarcaVehiculoStore();
const modeloStore = useModeloStore();


const alertaVisible = ref(false);

const alertaTipo = ref<
    "success" |
    "error" |
    "warning" |
    "info"
>("warning");

const alertaTitulo = ref("");
const alertaMensaje = ref("");

let timeoutAlerta:
    ReturnType<typeof setTimeout> | null = null;


function mostrarAlerta(
    tipo:
        | "success"
        | "error"
        | "warning"
        | "info",
    titulo: string,
    mensaje: string
) {
    if (timeoutAlerta) {
        clearTimeout(timeoutAlerta);
    }

    alertaTipo.value = tipo;
    alertaTitulo.value = titulo;
    alertaMensaje.value = mensaje;
    alertaVisible.value = true;

    timeoutAlerta = setTimeout(() => {
        alertaVisible.value = false;
    }, 3500);
}


const form = reactive({

    id: 0,

    marcaVehiculoId: 0,

    modeloId: 0,

    anio: new Date().getFullYear(),

    vin: "",

    numeroMotor: "",

    kilometraje: 0,

    patente: "",

    color: "",

    precioCompra: 0,

    precioVenta: 0,

    estado: "Disponible"

});


onMounted(async () => {

    await marcaStore.cargarMarcas();

});


watch(
    () => form.marcaVehiculoId,

    async id => {

        // Cuando el usuario cambia la marca,
        // no debemos conservar el modelo anterior.
        form.modeloId = 0;

        if (id > 0) {

            await modeloStore
                .cargarPorMarca(id);

        }

    }
);


watch(
    () => props.vehiculo,

    async vehiculo => {

        if (!vehiculo) {

            Object.assign(form, {

                id: 0,

                marcaVehiculoId: 0,

                modeloId: 0,

                anio: new Date().getFullYear(),

                vin: "",

                numeroMotor: "",

                kilometraje: 0,

                patente: "",

                color: "",

                precioCompra: 0,

                precioVenta: 0,

                estado: "Disponible"

            });

            return;

        }


        form.id =
            vehiculo.id;


        form.marcaVehiculoId =
            vehiculo.marcaVehiculoId;


        await modeloStore
            .cargarPorMarca(
                vehiculo.marcaVehiculoId
            );


        form.modeloId =
            vehiculo.modeloId;


        form.anio =
            vehiculo.anio;


        form.vin =
            vehiculo.vin;


        form.numeroMotor =
            vehiculo.numeroMotor;


        form.kilometraje =
            vehiculo.kilometraje;


        form.patente =
            vehiculo.patente;


        form.color =
            vehiculo.color;


        form.precioCompra =
            vehiculo.precioCompra;


        form.precioVenta =
            vehiculo.precioVenta;


        form.estado =
            vehiculo.estado;

    },

    {
        immediate: true
    }
);


function guardar() {

    if (!validarFormulario()) {
        return;
    }


    if (props.vehiculo) {

        const dto: VehiculoUpdateDto = {

            id: form.id,

            modeloId:
                form.modeloId,

            anio:
                form.anio,

            vin:
                form.vin.trim(),

            numeroMotor:
                form.numeroMotor.trim(),

            kilometraje:
                form.kilometraje,

            patente:
                form.patente.trim(),

            color:
                form.color.trim(),

            precioCompra:
                form.precioCompra,

            precioVenta:
                form.precioVenta,

            estado:
                form.estado

        };


        emit(
            "guardar",
            dto
        );

        return;

    }


    const dto: VehiculoCreateDto = {

        modeloId:
            form.modeloId,

        anio:
            form.anio,

        vin:
            form.vin.trim(),

        numeroMotor:
            form.numeroMotor.trim(),

        kilometraje:
            form.kilometraje,

        patente:
            form.patente.trim(),

        color:
            form.color.trim(),

        precioCompra:
            form.precioCompra,

        precioVenta:
            form.precioVenta

    };


    emit(
        "guardar",
        dto
    );

}


function validarFormulario(): boolean {

    if (form.marcaVehiculoId === 0) {

        mostrarAlerta(
            "warning",
            "Marca requerida",
            "Seleccione una marca."
        );

        return false;

    }


    if (form.modeloId === 0) {

        mostrarAlerta(
            "warning",
            "Modelo requerido",
            "Seleccione un modelo."
        );

        return false;

    }


    if (form.anio <= 0) {

        mostrarAlerta(
            "warning",
            "Año inválido",
            "Debe ingresar un año válido."
        );

        return false;

    }


    if (form.color.trim() === "") {

        mostrarAlerta(
            "warning",
            "Color requerido",
            "Debe ingresar un color."
        );

        return false;

    }


    if (form.kilometraje < 0) {

        mostrarAlerta(
            "warning",
            "Kilometraje inválido",
            "El kilometraje no puede ser negativo."
        );

        return false;

    }


    if (form.vin.trim() === "") {

        mostrarAlerta(
            "warning",
            "VIN requerido",
            "Debe ingresar el VIN."
        );

        return false;

    }


    if (form.numeroMotor.trim() === "") {

        mostrarAlerta(
            "warning",
            "Número de motor requerido",
            "Debe ingresar el número de motor."
        );

        return false;

    }


    // Patente NO la valido como obligatoria,
    // porque tu backend ya permite patente vacía.


    if (form.precioCompra <= 0) {

        mostrarAlerta(
            "warning",
            "Precio de compra inválido",
            "El precio de compra debe ser mayor a cero."
        );

        return false;

    }


    if (form.precioVenta <= 0) {

        mostrarAlerta(
            "warning",
            "Precio de venta inválido",
            "El precio de venta debe ser mayor a cero."
        );

        return false;

    }


    return true;

}

</script>