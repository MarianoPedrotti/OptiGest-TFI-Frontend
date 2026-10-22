<template>
    <div class="row g-3">
        <div class="col-md-6">
            <BaseInput
                label="Nombre"
                placeholder="Nombre del producto"
                v-model="form.nombre"
            />
        </div>

        <div class="col-md-6">
            <BaseInput
                label="SKU"
                placeholder="SKU"
                v-model="form.sku"
            />
        </div>

        <div class="col-md-6">
            <SelectInput
                label="Categoría"
                v-model="form.categoriaId"
            >
                <option :value="0">
                    Seleccione...
                </option>

                <option
                    v-for="categoria in categoriaStore.categorias"
                    :key="categoria.id"
                    :value="categoria.id"
                >
                    {{ categoria.nombre }}
                </option>
            </SelectInput>
        </div>

        <div class="col-md-6">
            <SelectInput
                label="Subcategoría"
                v-model="form.subCategoriaId"
            >
                <option :value="0">
                    Seleccione...
                </option>

                <option
                    v-for="sub in subCategoriaStore.subCategorias"
                    :key="sub.id"
                    :value="sub.id"
                >
                    {{ sub.nombre }}
                </option>
            </SelectInput>
        </div>

        <div class="col-md-6">
            <SelectInput
                label="Marca"
                v-model="form.marcaProductoId"
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
            <BaseInput
                label="Modelo"
                placeholder="Modelo"
                v-model="form.modelo"
            />
        </div>

        <div class="col-md-6">
            <BaseInput
                label="Precio Compra"
                type="number"
                placeholder="Precio de compra"
                v-model="form.precioCompra"
            />
        </div>

        <div class="col-md-6">
            <BaseInput
                label="Precio Venta"
                type="number"
                placeholder="Precio de venta"
                v-model="form.precioVenta"
            />
        </div>

        <div class="col-md-6">
            <BaseInput
                label="Stock"
                type="number"
                placeholder="Stock disponible"
                v-model="form.stock"
            />
        </div>

        <div class="col-12">
            <BaseInput
                label="Descripción"
                placeholder="Descripción"
                v-model="form.descripcion"
            />
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

import ToastAlert from "../alerts/ToastAlert.vue";
import BaseInput from "../base/BaseInput.vue";
import SelectInput from "../forms/SelectInput.vue";
import PrimaryButton from "../buttons/PrimaryButton.vue";

import { useMarcaProductoStore } from "../../stores/marcaProductoStore";
import { useCategoriaStore } from "../../stores/categoriaStore";
import { useSubCategoriaStore } from "../../stores/subCategoriaStore";

import type {
    Producto,
    ProductoCreateDto,
    ProductoUpdateDto
} from "../../types/producto";

const props = defineProps<{
    producto?: Producto | null;
}>();

const emit = defineEmits<{
    (
        e: "guardar",
        value: ProductoCreateDto | ProductoUpdateDto
    ): void;
}>();

const marcaStore = useMarcaProductoStore();
const categoriaStore = useCategoriaStore();
const subCategoriaStore = useSubCategoriaStore();

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
    nombre: "",
    descripcion: "",
    sku: "",
    categoriaId: 0,
    subCategoriaId: 0,
    marcaProductoId: 0,
    modelo: "",
    precioCompra: 0,
    precioVenta: 0,
    stock: 0
});

onMounted(async () => {
    await Promise.all([
        marcaStore.cargarMarcas(),
        categoriaStore.cargarCategorias()
    ]);
});

watch(
    () => form.categoriaId,
    async id => {
        // Al cambiar de categoría,
        // limpiamos la subcategoría anterior.
        form.subCategoriaId = 0;

        if (id > 0) {
            await subCategoriaStore
                .cargarPorCategoria(id);
        }
    }
);

watch(
    () => props.producto,
    async producto => {
        if (!producto) {
            Object.assign(form, {
                id: 0,
                nombre: "",
                descripcion: "",
                sku: "",
                categoriaId: 0,
                subCategoriaId: 0,
                marcaProductoId: 0,
                modelo: "",
                precioCompra: 0,
                precioVenta: 0,
                stock: 0
            });

            return;
        }

        form.id = producto.id;

        form.categoriaId =
            producto.categoriaId;

        await subCategoriaStore
            .cargarPorCategoria(
                producto.categoriaId
            );

        form.subCategoriaId =
            producto.subCategoriaId;

        form.marcaProductoId =
            producto.marcaProductoId;

        form.nombre = producto.nombre;
        form.descripcion = producto.descripcion;
        form.sku = producto.sku;
        form.modelo = producto.modelo;
        form.precioCompra = producto.precioCompra;
        form.precioVenta = producto.precioVenta;
        form.stock = producto.stock;
    },
    {
        immediate: true
    }
);

function guardar() {
    if (!validarFormulario()) {
        return;
    }

    if (props.producto) {
        const dto: ProductoUpdateDto = {
            id: form.id,
            nombre: form.nombre.trim(),
            descripcion: form.descripcion.trim(),
            sku: form.sku.trim(),
            categoriaId: form.categoriaId,
            subCategoriaId: form.subCategoriaId,
            marcaProductoId: form.marcaProductoId,
            modelo: form.modelo.trim(),
            precioCompra: form.precioCompra,
            precioVenta: form.precioVenta,
            stock: form.stock
        };

        emit("guardar", dto);

        return;
    }

    const dto: ProductoCreateDto = {
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim(),
        sku: form.sku.trim(),
        categoriaId: form.categoriaId,
        subCategoriaId: form.subCategoriaId,
        marcaProductoId: form.marcaProductoId,
        modelo: form.modelo.trim(),
        precioCompra: form.precioCompra,
        precioVenta: form.precioVenta,
        stock: form.stock
    };

    emit("guardar", dto);
}

function validarFormulario(): boolean {
    if (form.nombre.trim() === "") {
        mostrarAlerta(
            "warning",
            "Nombre requerido",
            "Debe ingresar un nombre."
        );

        return false;
    }

    if (form.sku.trim() === "") {
        mostrarAlerta(
            "warning",
            "SKU requerido",
            "Debe ingresar un SKU."
        );

        return false;
    }

    if (form.categoriaId === 0) {
        mostrarAlerta(
            "warning",
            "Categoría requerida",
            "Seleccione una categoría."
        );

        return false;
    }

    if (form.subCategoriaId === 0) {
        mostrarAlerta(
            "warning",
            "Subcategoría requerida",
            "Seleccione una subcategoría."
        );

        return false;
    }

    if (form.marcaProductoId === 0) {
        mostrarAlerta(
            "warning",
            "Marca requerida",
            "Seleccione una marca."
        );

        return false;
    }

    if (form.modelo.trim() === "") {
        mostrarAlerta(
            "warning",
            "Modelo requerido",
            "Debe ingresar un modelo."
        );

        return false;
    }

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

    if (form.stock < 0) {
        mostrarAlerta(
            "warning",
            "Stock inválido",
            "El stock no puede ser negativo."
        );

        return false;
    }

    return true;
}
</script>