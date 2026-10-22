<template>

<div class="container-fluid">
    <div class="mb-3">

    <BackButton
        texto="Volver a configuración"
    ruta="/configuracion"
    />

</div>

    <PageHeader
        titulo="Configuración de productos"
        subtitulo="Administración de marcas, categorías y subcategorías"
    />


    <div class="row g-4">

        <!-- ========================= -->
        <!-- MARCAS -->
        <!-- ========================= -->

        <div class="col-lg-6">

            <Card>

                <div class="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-3">

                    <div>

                        <h5 class="fw-bold mb-1">
                            Marcas
                        </h5>

                        <small class="text-muted">
                            Marcas disponibles para los productos.
                        </small>

                    </div>

                    <i class="bi bi-tags fs-4 text-muted"></i>

                </div>


                <div class="row g-2 align-items-end mb-4">

                    <div class="col-12 col-sm">

                        <BaseInput
                            label="Nombre"
                            v-model="formMarca.nombre"
                        />

                    </div>

                    <div class="col-12 col-sm-auto">

                        <button
                            class="btn btn-primary w-100"
                            @click="guardarMarca"
                        >

                            <i
                                :class="
                                    formMarca.id
                                        ? 'bi bi-check-lg'
                                        : 'bi bi-plus-lg'
                                "
                                class="me-1"
                            ></i>

                            {{
                                formMarca.id
                                    ? "Guardar"
                                    : "Agregar"
                            }}

                        </button>

                    </div>

                    <div
                        v-if="formMarca.id"
                        class="col-12 col-sm-auto"
                    >

                        <button
                            class="btn btn-outline-secondary w-100"
                            @click="cancelarMarca"
                        >
                            Cancelar
                        </button>

                    </div>

                </div>


                <div class="table-responsive">

                    <table class="table align-middle">

                        <thead class="table-light">

                            <tr>

                                <th>Marca</th>

                                <th class="text-end">
                                    Acciones
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            <tr
                                v-for="marca in marcaStore.marcas"
                                :key="marca.id"
                            >

                                <td class="fw-semibold">

                                    {{ marca.nombre }}

                                </td>

                                <td class="text-end">

                                    <button
                                        class="btn btn-sm btn-outline-primary me-2"
                                        @click="editarMarca(marca)"
                                    >

                                        <i class="bi bi-pencil"></i>

                                    </button>

                                    <button
                                        class="btn btn-sm btn-outline-danger"
                                        @click="
                                            solicitarEliminar(
                                                'marca',
                                                marca.id,
                                                marca.nombre
                                            )
                                        "
                                    >

                                        <i class="bi bi-trash"></i>

                                    </button>

                                </td>

                            </tr>


                            <tr
                                v-if="marcaStore.marcas.length === 0"
                            >

                                <td
                                    colspan="2"
                                    class="text-center text-muted py-4"
                                >
                                    No hay marcas registradas.
                                </td>

                            </tr>

                        </tbody>

                    </table>

                </div>

            </Card>

        </div>


        <!-- ========================= -->
        <!-- CATEGORÍAS -->
        <!-- ========================= -->

        <div class="col-lg-6">

            <Card>

                <div class="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-3">

                    <div>

                        <h5 class="fw-bold mb-1">
                            Categorías
                        </h5>

                        <small class="text-muted">
                            Clasificación principal de productos.
                        </small>

                    </div>

                    <i class="bi bi-grid fs-4 text-muted"></i>

                </div>


                <div class="row g-2 align-items-end mb-4">

                    <div class="col-12 col-sm">

                        <BaseInput
                            label="Nombre"
                            v-model="formCategoria.nombre"
                        />

                    </div>

                    <div class="col-12 col-sm-auto">

                        <button
                            class="btn btn-primary w-100"
                            @click="guardarCategoria"
                        >

                            <i
                                :class="
                                    formCategoria.id
                                        ? 'bi bi-check-lg'
                                        : 'bi bi-plus-lg'
                                "
                                class="me-1"
                            ></i>

                            {{
                                formCategoria.id
                                    ? "Guardar"
                                    : "Agregar"
                            }}

                        </button>

                    </div>

                    <div
                        v-if="formCategoria.id"
                        class="col-12 col-sm-auto"
                    >

                        <button
                            class="btn btn-outline-secondary w-100"
                            @click="cancelarCategoria"
                        >
                            Cancelar
                        </button>

                    </div>

                </div>


                <div class="table-responsive">

                    <table class="table align-middle">

                        <thead class="table-light">

                            <tr>

                                <th>Categoría</th>

                                <th class="text-end">
                                    Acciones
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            <tr
                                v-for="categoria in categoriaStore.categorias"
                                :key="categoria.id"
                            >

                                <td class="fw-semibold">

                                    {{ categoria.nombre }}

                                </td>

                                <td class="text-end">

                                    <button
                                        class="btn btn-sm btn-outline-primary me-2"
                                        @click="editarCategoria(categoria)"
                                    >

                                        <i class="bi bi-pencil"></i>

                                    </button>

                                    <button
                                        class="btn btn-sm btn-outline-danger"
                                        @click="
                                            solicitarEliminar(
                                                'categoria',
                                                categoria.id,
                                                categoria.nombre
                                            )
                                        "
                                    >

                                        <i class="bi bi-trash"></i>

                                    </button>

                                </td>

                            </tr>


                            <tr
                                v-if="categoriaStore.categorias.length === 0"
                            >

                                <td
                                    colspan="2"
                                    class="text-center text-muted py-4"
                                >
                                    No hay categorías registradas.
                                </td>

                            </tr>

                        </tbody>

                    </table>

                </div>

            </Card>

        </div>


        <!-- ========================= -->
        <!-- SUBCATEGORÍAS -->
        <!-- ========================= -->

        <div class="col-12">

            <Card>

                <div class="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-3">

                    <div>

                        <h5 class="fw-bold mb-1">
                            Subcategorías
                        </h5>

                        <small class="text-muted">
                            Clasificación específica dentro de cada categoría.
                        </small>

                    </div>

                    <i class="bi bi-diagram-3 fs-4 text-muted"></i>

                </div>


                <div class="row g-3 align-items-end mb-4">

                    <div class="col-md-5">

                        <BaseInput
                            label="Nombre"
                            v-model="formSubCategoria.nombre"
                        />

                    </div>


                    <div class="col-md-4">

                        <SelectInput
                            label="Categoría"
                            v-model="formSubCategoria.categoriaId"
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


                    <div class="col-12 col-sm-auto">

                        <button
                            class="btn btn-primary w-100"
                            @click="guardarSubCategoria"
                        >

                            <i
                                :class="
                                    formSubCategoria.id
                                        ? 'bi bi-check-lg'
                                        : 'bi bi-plus-lg'
                                "
                                class="me-1"
                            ></i>

                            {{
                                formSubCategoria.id
                                    ? "Guardar"
                                    : "Agregar"
                            }}

                        </button>

                    </div>


                    <div
                        v-if="formSubCategoria.id"
                        class="col-12 col-sm-auto"
                    >

                        <button
                            class="btn btn-outline-secondary w-100"
                            @click="cancelarSubCategoria"
                        >
                            Cancelar
                        </button>

                    </div>

                </div>


                <div class="table-responsive">

                    <table class="table align-middle">

                        <thead class="table-light">

                            <tr>

                                <th>Subcategoría</th>

                                <th>Categoría</th>

                                <th class="text-end">
                                    Acciones
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            <tr
                                v-for="subCategoria in subCategoriaStore.subCategorias"
                                :key="subCategoria.id"
                            >

                                <td class="fw-semibold">

                                    {{ subCategoria.nombre }}

                                </td>

                                <td>

                                    <span class="badge bg-light text-dark border">

                                        {{
                                            obtenerNombreCategoria(
                                                subCategoria.categoriaId
                                            )
                                        }}

                                    </span>

                                </td>

                                <td class="text-end">

                                    <button
                                        class="btn btn-sm btn-outline-primary me-2"
                                        @click="editarSubCategoria(subCategoria)"
                                    >

                                        <i class="bi bi-pencil"></i>

                                    </button>

                                    <button
                                        class="btn btn-sm btn-outline-danger"
                                        @click="
                                            solicitarEliminar(
                                                'subcategoria',
                                                subCategoria.id,
                                                subCategoria.nombre
                                            )
                                        "
                                    >

                                        <i class="bi bi-trash"></i>

                                    </button>

                                </td>

                            </tr>


                            <tr
                                v-if="
                                    subCategoriaStore.subCategorias.length === 0
                                "
                            >

                                <td
                                    colspan="3"
                                    class="text-center text-muted py-4"
                                >
                                    No hay subcategorías registradas.
                                </td>

                            </tr>

                        </tbody>

                    </table>

                </div>

            </Card>

        </div>

    </div>


    <!-- ========================= -->
    <!-- CONFIRMAR ELIMINACIÓN -->
    <!-- ========================= -->

    <ConfirmModal
        :visible="confirmarEliminarVisible"
        titulo="Confirmar eliminación"
        :mensaje="mensajeConfirmacion"
        @confirmar="confirmarEliminar"
        @cancelar="cancelarEliminar"
    />


    <!-- ========================= -->
    <!-- TOAST -->
    <!-- ========================= -->

    <ToastAlert
        :visible="alertaVisible"
        :tipo="alertaTipo"
        :titulo="alertaTitulo"
        :mensaje="alertaMensaje"
        @close="alertaVisible = false"
    />

</div>

</template>


<script setup lang="ts">

import { computed, onMounted, reactive, ref } from "vue";
import BackButton from "../../components/buttons/BackButton.vue";

import Card from "../../components/cards/Card.vue";
import PageHeader from "../../components/page/PageHeader.vue";

import BaseInput from "../../components/base/BaseInput.vue";
import SelectInput from "../../components/forms/SelectInput.vue";

import ToastAlert from "../../components/alerts/ToastAlert.vue";
import ConfirmModal from "../../components/alerts/ConfirmModal.vue";

import { useMarcaProductoStore } from "../../stores/marcaProductoStore";
import { useCategoriaStore } from "../../stores/categoriaStore";
import { useSubCategoriaStore } from "../../stores/subCategoriaStore";

import type { MarcaProducto } from "../../types/marcaProducto";
import type { Categoria } from "../../types/categoria";
import type { SubCategoria } from "../../types/subCategoria";


const marcaStore =
    useMarcaProductoStore();

const categoriaStore =
    useCategoriaStore();

const subCategoriaStore =
    useSubCategoriaStore();


// ==========================
// Carga inicial
// ==========================

onMounted(async () => {

    try {

        await Promise.all([

            marcaStore.cargarMarcas(),

            categoriaStore.cargarCategorias(),

            subCategoriaStore.cargarSubCategorias()

        ]);

    }
    catch (error) {

        console.error(error);

        mostrarAlerta(
            "error",
            "Error",
            "No se pudo cargar la configuración de productos."
        );

    }

});


// ==========================
// Marca
// ==========================

const formMarca = reactive({

    id: 0,

    nombre: ""

});


async function guardarMarca() {

    const nombre =
        formMarca.nombre.trim();

    if (!nombre) {

        mostrarAlerta(
            "warning",
            "Nombre requerido",
            "Debe ingresar el nombre de la marca."
        );

        return;

    }


    try {

        if (formMarca.id) {

            await marcaStore.actualizar({

                id: formMarca.id,

                nombre

            });

            mostrarAlerta(
                "success",
                "Marca actualizada",
                "La marca se actualizó correctamente."
            );

        }
        else {

            await marcaStore.crear({

                nombre

            });

            mostrarAlerta(
                "success",
                "Marca creada",
                "La marca se creó correctamente."
            );

        }

        cancelarMarca();

    }
    catch (error) {

        console.error(error);

        mostrarAlerta(
            "error",
            "Error",
            obtenerMensajeError(
                error,
                "No se pudo guardar la marca."
            )
        );

    }

}


function editarMarca(
    marca: MarcaProducto
) {

    formMarca.id = marca.id;

    formMarca.nombre = marca.nombre;

}


function cancelarMarca() {

    formMarca.id = 0;

    formMarca.nombre = "";

}


// ==========================
// Categoría
// ==========================

const formCategoria = reactive({

    id: 0,

    nombre: ""

});


async function guardarCategoria() {

    const nombre =
        formCategoria.nombre.trim();

    if (!nombre) {

        mostrarAlerta(
            "warning",
            "Nombre requerido",
            "Debe ingresar el nombre de la categoría."
        );

        return;

    }


    try {

        if (formCategoria.id) {

            await categoriaStore.actualizar({

                id: formCategoria.id,

                nombre

            });

            mostrarAlerta(
                "success",
                "Categoría actualizada",
                "La categoría se actualizó correctamente."
            );

        }
        else {

            await categoriaStore.crear({

                nombre

            });

            mostrarAlerta(
                "success",
                "Categoría creada",
                "La categoría se creó correctamente."
            );

        }

        cancelarCategoria();

    }
    catch (error) {

        console.error(error);

        mostrarAlerta(
            "error",
            "Error",
            obtenerMensajeError(
                error,
                "No se pudo guardar la categoría."
            )
        );

    }

}


function editarCategoria(
    categoria: Categoria
) {

    formCategoria.id =
        categoria.id;

    formCategoria.nombre =
        categoria.nombre;

}


function cancelarCategoria() {

    formCategoria.id = 0;

    formCategoria.nombre = "";

}


// ==========================
// Subcategoría
// ==========================

const formSubCategoria = reactive({

    id: 0,

    nombre: "",

    categoriaId: 0

});


async function guardarSubCategoria() {

    const nombre =
        formSubCategoria.nombre.trim();


    if (!nombre) {

        mostrarAlerta(
            "warning",
            "Nombre requerido",
            "Debe ingresar el nombre de la subcategoría."
        );

        return;

    }


    if (!formSubCategoria.categoriaId) {

        mostrarAlerta(
            "warning",
            "Categoría requerida",
            "Debe seleccionar una categoría."
        );

        return;

    }


    try {

        if (formSubCategoria.id) {

            await subCategoriaStore.actualizar({

                id:
                    formSubCategoria.id,

                nombre,

                categoriaId:
                    Number(
                        formSubCategoria.categoriaId
                    )

            });

            mostrarAlerta(
                "success",
                "Subcategoría actualizada",
                "La subcategoría se actualizó correctamente."
            );

        }
        else {

            await subCategoriaStore.crear({

                nombre,

                categoriaId:
                    Number(
                        formSubCategoria.categoriaId
                    )

            });

            mostrarAlerta(
                "success",
                "Subcategoría creada",
                "La subcategoría se creó correctamente."
            );

        }

        cancelarSubCategoria();

    }
    catch (error) {

        console.error(error);

        mostrarAlerta(
            "error",
            "Error",
            obtenerMensajeError(
                error,
                "No se pudo guardar la subcategoría."
            )
        );

    }

}


function editarSubCategoria(
    subCategoria: SubCategoria
) {

    formSubCategoria.id =
        subCategoria.id;

    formSubCategoria.nombre =
        subCategoria.nombre;

    formSubCategoria.categoriaId =
        subCategoria.categoriaId;

}


function cancelarSubCategoria() {

    formSubCategoria.id = 0;

    formSubCategoria.nombre = "";

    formSubCategoria.categoriaId = 0;

}


// ==========================
// Nombre categoría
// ==========================

function obtenerNombreCategoria(
    categoriaId: number
) {

    return (
        categoriaStore.categorias.find(
            categoria =>
                categoria.id === categoriaId
        )?.nombre ?? "Sin categoría"
    );

}


// ==========================
// Eliminación
// ==========================

type TipoEliminacion =
    "marca" |
    "categoria" |
    "subcategoria";


const confirmarEliminarVisible =
    ref(false);

const tipoEliminar =
    ref<TipoEliminacion | null>(null);

const idEliminar =
    ref<number | null>(null);

const nombreEliminar =
    ref("");


const mensajeConfirmacion =
    computed(() => {

        if (!nombreEliminar.value)
            return "¿Está seguro de que desea eliminar este registro?";

        return `¿Está seguro de que desea eliminar "${nombreEliminar.value}"?`;

    });


function solicitarEliminar(
    tipo: TipoEliminacion,
    id: number,
    nombre: string
) {

    tipoEliminar.value = tipo;

    idEliminar.value = id;

    nombreEliminar.value = nombre;

    confirmarEliminarVisible.value =
        true;

}


async function confirmarEliminar() {

    if (
        !tipoEliminar.value ||
        !idEliminar.value
    ) {
        return;
    }


    try {

        switch (tipoEliminar.value) {

            case "marca":

                await marcaStore.eliminar(
                    idEliminar.value
                );

                break;


            case "categoria":

                await categoriaStore.eliminar(
                    idEliminar.value
                );

                break;


            case "subcategoria":

                await subCategoriaStore.eliminar(
                    idEliminar.value
                );

                break;

        }


        mostrarAlerta(
            "success",
            "Registro eliminado",
            "El registro se eliminó correctamente."
        );

    }
    catch (error) {

        console.error(error);

        mostrarAlerta(
            "error",
            "No se pudo eliminar",
            obtenerMensajeError(
                error,
                "El registro podría estar siendo utilizado por otros datos del sistema."
            )
        );

    }
    finally {

        cancelarEliminar();

    }

}


function cancelarEliminar() {

    confirmarEliminarVisible.value =
        false;

    tipoEliminar.value =
        null;

    idEliminar.value =
        null;

    nombreEliminar.value =
        "";

}


// ==========================
// Toast
// ==========================

const alertaVisible =
    ref(false);

const alertaTipo =
    ref<
        "success" |
        "error" |
        "warning" |
        "info"
    >("success");

const alertaTitulo =
    ref("");

const alertaMensaje =
    ref("");

let alertaTimeout:
    ReturnType<typeof setTimeout> |
    null = null;


function mostrarAlerta(
    tipo:
        "success" |
        "error" |
        "warning" |
        "info",
    titulo: string,
    mensaje: string
) {

    if (alertaTimeout) {

        clearTimeout(
            alertaTimeout
        );

    }

    alertaTipo.value =
        tipo;

    alertaTitulo.value =
        titulo;

    alertaMensaje.value =
        mensaje;

    alertaVisible.value =
        true;


    alertaTimeout =
        setTimeout(() => {

            alertaVisible.value =
                false;

        }, 3500);

}


// ==========================
// Errores API
// ==========================

function obtenerMensajeError(
    error: any,
    mensajeDefault: string
) {

    const data =
        error?.response?.data;

    if (typeof data === "string") {

        return data;

    }

    if (data?.message) {

        return data.message;

    }

    return mensajeDefault;

}

</script>
