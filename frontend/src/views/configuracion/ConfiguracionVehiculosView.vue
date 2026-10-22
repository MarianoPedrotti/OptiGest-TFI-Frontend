<template>

<div class="container-fluid">
    <div class="mb-3">

    <BackButton
        texto="Volver a configuración"
    ruta="/configuracion"
    />

</div>

    <PageHeader
        titulo="Configuración de vehículos"
        subtitulo="Administración de marcas y modelos"
    />


    <div class="row g-4">

        <!-- ========================= -->
        <!-- MARCAS -->
        <!-- ========================= -->

        <div class="col-lg-5">

            <Card>

                <div
                    class="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-3"
                >

                    <div>

                        <h5 class="fw-bold mb-1">
                            Marcas
                        </h5>

                        <small class="text-muted">
                            Marcas disponibles para los vehículos.
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
        <!-- MODELOS -->
        <!-- ========================= -->

        <div class="col-lg-7">

            <Card>

                <div
                    class="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-3"
                >

                    <div>

                        <h5 class="fw-bold mb-1">
                            Modelos
                        </h5>

                        <small class="text-muted">
                            Modelos asociados a cada marca.
                        </small>

                    </div>

                    <i class="bi bi-bicycle fs-4 text-muted"></i>

                </div>


                <div class="row g-3 mb-4">

                    <div class="col-md-6">

                        <BaseInput
                            label="Nombre"
                            v-model="formModelo.nombre"
                        />

                    </div>


                    <div class="col-md-6">

                        <SelectInput
                            label="Marca"
                            v-model="formModelo.marcaVehiculoId"
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
                            label="Cilindrada"
                            type="number"
                            min="1"
                            v-model="formModelo.cilindrada"
                        />

                    </div>


                    <div class="col-md-6">

                        <BaseInput
                            label="Tipo de motor"
                            v-model="formModelo.tipoMotor"
                        />

                    </div>


                    <div class="col-12">

                        <div class="responsive-actions">

                            <button
                                v-if="formModelo.id"
                                class="btn btn-outline-secondary"
                                @click="cancelarModelo"
                            >
                                Cancelar
                            </button>


                            <button
                                class="btn btn-primary"
                                @click="guardarModelo"
                            >

                                <i
                                    :class="
                                        formModelo.id
                                            ? 'bi bi-check-lg'
                                            : 'bi bi-plus-lg'
                                    "
                                    class="me-1"
                                ></i>

                                {{
                                    formModelo.id
                                        ? "Guardar modelo"
                                        : "Agregar modelo"
                                }}

                            </button>

                        </div>

                    </div>

                </div>


                <div class="table-responsive">

                    <table class="table align-middle">

                        <thead class="table-light">

                            <tr>

                                <th>Modelo</th>
                                <th>Marca</th>
                                <th>Cilindrada</th>
                                <th>Motor</th>

                                <th class="text-end">
                                    Acciones
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            <tr
                                v-for="modelo in modeloStore.modelos"
                                :key="modelo.id"
                            >

                                <td class="fw-semibold">
                                    {{ modelo.nombre }}
                                </td>


                                <td>
                                    {{
                                        obtenerNombreMarca(
                                            modelo.marcaVehiculoId
                                        )
                                    }}
                                </td>


                                <td>
                                    {{ modelo.cilindrada }} cc
                                </td>


                                <td>
                                    {{ modelo.tipoMotor }}
                                </td>


                                <td class="text-end">

                                    <button
                                        class="btn btn-sm btn-outline-primary me-2"
                                        @click="editarModelo(modelo)"
                                    >
                                        <i class="bi bi-pencil"></i>
                                    </button>


                                    <button
                                        class="btn btn-sm btn-outline-danger"
                                        @click="
                                            solicitarEliminar(
                                                'modelo',
                                                modelo.id,
                                                modelo.nombre
                                            )
                                        "
                                    >
                                        <i class="bi bi-trash"></i>
                                    </button>

                                </td>

                            </tr>


                            <tr
                                v-if="modeloStore.modelos.length === 0"
                            >

                                <td
                                    colspan="5"
                                    class="text-center text-muted py-4"
                                >
                                    No hay modelos registrados.
                                </td>

                            </tr>

                        </tbody>

                    </table>

                </div>

            </Card>

        </div>

    </div>


    <!-- Confirmar eliminación -->

    <ConfirmModal
        :visible="confirmarEliminarVisible"
        titulo="Confirmar eliminación"
        :mensaje="mensajeConfirmacion"
        @confirmar="confirmarEliminar"
        @cancelar="cancelarEliminar"
    />


    <!-- Alertas -->

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

import { useMarcaVehiculoStore } from "../../stores/marcaVehiculoStore";
import { useModeloStore } from "../../stores/modeloStore";

import type { MarcaVehiculo } from "../../types/marcaVehiculo";
import type { Modelo } from "../../types/modelo";


const marcaStore = useMarcaVehiculoStore();

const modeloStore = useModeloStore();


// ==========================
// Carga inicial
// ==========================

onMounted(async () => {

    try {

        await Promise.all([

            marcaStore.cargarMarcas(),

            modeloStore.cargarTodos()

        ]);

    }
    catch (error) {

        console.error(error);

        mostrarAlerta(
            "error",
            "Error",
            "No se pudo cargar la configuración de vehículos."
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
    marca: MarcaVehiculo
) {

    formMarca.id =
        marca.id;

    formMarca.nombre =
        marca.nombre;

}


function cancelarMarca() {

    formMarca.id = 0;

    formMarca.nombre = "";

}


// ==========================
// Modelo
// ==========================

const formModelo = reactive({

    id: 0,

    marcaVehiculoId: 0,

    nombre: "",

    cilindrada: 0,

    tipoMotor: ""

});


async function guardarModelo() {

    const nombre =
        formModelo.nombre.trim();

    const tipoMotor =
        formModelo.tipoMotor.trim();


    if (!nombre) {

        mostrarAlerta(
            "warning",
            "Nombre requerido",
            "Debe ingresar el nombre del modelo."
        );

        return;

    }


    if (!formModelo.marcaVehiculoId) {

        mostrarAlerta(
            "warning",
            "Marca requerida",
            "Debe seleccionar una marca."
        );

        return;

    }


    if (
        Number(formModelo.cilindrada) <= 0
    ) {

        mostrarAlerta(
            "warning",
            "Cilindrada inválida",
            "La cilindrada debe ser mayor a cero."
        );

        return;

    }


    if (!tipoMotor) {

        mostrarAlerta(
            "warning",
            "Motor requerido",
            "Debe indicar el tipo de motor."
        );

        return;

    }


    try {

        if (formModelo.id) {

            await modeloStore.actualizar({

                id:
                    formModelo.id,

                marcaVehiculoId:
                    Number(
                        formModelo.marcaVehiculoId
                    ),

                nombre,

                cilindrada:
                    Number(
                        formModelo.cilindrada
                    ),

                tipoMotor

            });


            mostrarAlerta(
                "success",
                "Modelo actualizado",
                "El modelo se actualizó correctamente."
            );

        }
        else {

            await modeloStore.crear({

                marcaVehiculoId:
                    Number(
                        formModelo.marcaVehiculoId
                    ),

                nombre,

                cilindrada:
                    Number(
                        formModelo.cilindrada
                    ),

                tipoMotor

            });


            mostrarAlerta(
                "success",
                "Modelo creado",
                "El modelo se creó correctamente."
            );

        }


        cancelarModelo();

    }
    catch (error) {

        console.error(error);

        mostrarAlerta(
            "error",
            "Error",
            obtenerMensajeError(
                error,
                "No se pudo guardar el modelo."
            )
        );

    }

}


function editarModelo(
    modelo: Modelo
) {

    formModelo.id =
        modelo.id;

    formModelo.marcaVehiculoId =
        modelo.marcaVehiculoId;

    formModelo.nombre =
        modelo.nombre;

    formModelo.cilindrada =
        modelo.cilindrada;

    formModelo.tipoMotor =
        modelo.tipoMotor;

}


function cancelarModelo() {

    formModelo.id = 0;

    formModelo.marcaVehiculoId = 0;

    formModelo.nombre = "";

    formModelo.cilindrada = 0;

    formModelo.tipoMotor = "";

}


// ==========================
// Resolver nombre de marca
// ==========================

function obtenerNombreMarca(
    marcaVehiculoId: number
) {

    return (
        marcaStore.marcas.find(
            marca =>
                marca.id === marcaVehiculoId
        )?.nombre ?? "Sin marca"
    );

}


// ==========================
// Eliminación
// ==========================

type TipoEliminacion =
    "marca" |
    "modelo";


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

        if (!nombreEliminar.value) {

            return "¿Está seguro de que desea eliminar este registro?";

        }

        return `¿Está seguro de que desea eliminar "${nombreEliminar.value}"?`;

    });


function solicitarEliminar(
    tipo: TipoEliminacion,
    id: number,
    nombre: string
) {

    tipoEliminar.value =
        tipo;

    idEliminar.value =
        id;

    nombreEliminar.value =
        nombre;

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

        if (
            tipoEliminar.value === "marca"
        ) {

            await marcaStore.eliminar(
                idEliminar.value
            );

        }


        if (
            tipoEliminar.value === "modelo"
        ) {

            await modeloStore.eliminar(
                idEliminar.value
            );

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
// Error API
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
