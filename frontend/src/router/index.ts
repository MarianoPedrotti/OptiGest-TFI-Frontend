import { createRouter, createWebHistory } from "vue-router";

import { useAuthStore } from "../stores/authStore";

// Layout
import MainLayout from "../layouts/MainLayout.vue";

// Auth
import LoginView from "../views/LoginView.vue";

// Dashboard
import DashboardView from "../views/DashboardView.vue";

// Clientes
import ClientesView from "../views/ClientesView.vue";
import CuentaClienteView from "../views/CuentaClienteView.vue";

// Productos
import ProductosView from "../views/ProductosView.vue";
import ProductoFormView from "../views/ProductoFormView.vue";

// Vehículos
import VehiculoView from "../views/VehiculoView.vue";
import VehiculoFormView from "../views/VehiculoFormView.vue";

// Ventas
import VentasView from "../views/VentasView.vue";
import VentaEditorView from "../views/VentaEditorView.vue";
import VentaDetalleView from "../views/VentaDetalleView.vue";
import PagoVentaEditorView from "../views/PagoVentaEditorView.vue";

// Financiación
import FinanciacionView from "../views/FinanciacionView.vue";
import FinanciacionEditorView from "../views/FinanciacionEditorView.vue";
import CuotasTodasView from "../views/CuotasTodasView.vue";
import CuotasView from "../views/CuotasView.vue";
import PagoCuotaEditorView from "../views/PagoCuotaEditorView.vue";

// Cuenta corriente
import CuentaCorrienteView from "../views/CuentaCorrienteView.vue";

// Configuración
import ConfiguracionView from "../views/ConfiguracionView.vue";
import ConfiguracionUsuariosView from "../views/configuracion/ConfiguracionUsuariosView.vue";
import ConfiguracionProductosView from "../views/configuracion/ConfiguracionProductosView.vue";
import ConfiguracionVehiculosView from "../views/configuracion/ConfiguracionVehiculosView.vue";
import ConfiguracionFinanciacionView from "../views/configuracion/ConfiguracionFinanciacionView.vue";
import UsuarioEditorView from "../views/configuracion/UsuarioEditorView.vue";


const ROLES_CONFIGURACION = [
    "Admin",
    "Dueno"
];


const router = createRouter({

    history: createWebHistory(),

    routes: [

        // ==========================
        // Login
        // ==========================

        {
            path: "/login",
            component: LoginView,

            meta: {
                title: "Login",
                header: "Iniciar Sesión"
            }
        },


        // ==========================
        // Aplicación
        // ==========================

        {
            path: "/",
            component: MainLayout,

            meta: {
                requiresAuth: true
            },

            children: [

                // ==========================
                // Dashboard
                // ==========================

                {
                    path: "",
                    component: DashboardView,

                    meta: {
                        title: "Dashboard",
                        header: "Panel de Control"
                    }
                },


                // ==========================
                // Clientes
                // ==========================

                {
                    path: "clientes",
                    component: ClientesView,

                    meta: {
                        title: "Clientes",
                        header: "Administración de Clientes"
                    }
                },

                {
                    path: "cuenta-corriente/:clienteId",
                    name: "CuentaCorrienteDetalle",
                    component: CuentaClienteView,

                    meta: {
                        title: "Cuenta Corriente",
                        header: "Detalle de Cuenta Corriente"
                    }
                },


                // ==========================
                // Productos
                // ==========================

                {
                    path: "productos",
                    component: ProductosView,

                    meta: {
                        title: "Productos",
                        header: "Administración de Productos"
                    }
                },
                {
                    path: "productos/nuevo",
                    name: "nuevo-producto",
                    component: ProductoFormView,

                    meta: {
                        title: "Nuevo Producto",
                        header: "Registrar Producto"
                    }
                },

                {
                    path: "productos/:id/editar",
                    name: "editar-producto",
                    component: ProductoFormView,

                    meta: {
                        title: "Editar Producto",
                        header: "Modificar Producto"
                    }
                },


                // ==========================
                // Vehículos
                // ==========================

                {
                    path: "vehiculos",
                    component: VehiculoView,

                    meta: {
                        title: "Vehículos",
                        header: "Administración de Vehículos"
                    }
                },
                                {
                    path: "vehiculos/nuevo",
                    name: "nuevo-vehiculo",
                    component: VehiculoFormView,

                    meta: {
                        title: "Nuevo Vehículo",
                        header: "Registrar Vehículo"
                    }
                },

                {
                    path: "vehiculos/:id/editar",
                    name: "editar-vehiculo",
                    component: VehiculoFormView,

                    meta: {
                        title: "Editar Vehículo",
                        header: "Modificar Vehículo"
                    }
                },


                // ==========================
                // Ventas
                // ==========================

                {
                    path: "ventas",
                    component: VentasView,

                    meta: {
                        title: "Ventas",
                        header: "Administración de Ventas"
                    }
                },

                {
                    path: "ventas/nuevo",
                    name: "VentaEditor",
                    component: VentaEditorView,

                    meta: {
                        title: "Nueva Venta",
                        header: "Registrar Nueva Venta"
                    }
                },

                {
                    path: "ventas/:id",
                    name: "venta-detalle",
                    component: VentaDetalleView,

                    meta: {
                        title: "Detalle de Venta",
                        header: "Información de la Venta"
                    }
                },

                {
                    path: "pagos/nuevo/:id",
                    component: PagoVentaEditorView,

                    meta: {
                        title: "Registrar Pago",
                        header: "Registrar Pago de Venta"
                    }
                },


                // ==========================
                // Financiaciones
                // ==========================

                {
                    path: "financiaciones",
                    component: FinanciacionView,

                    meta: {
                        title: "Financiaciones",
                        header: "Administración de Financiaciones"
                    }
                },
                {
                    path: "cuotas",
                    name: "cuotas-todas",
                    component: CuotasTodasView,
                    meta: {
                        title: "Cuotas",
                        header: "Administración de Cuotas"
                    }
                },

                {
                    path: "financiaciones/nueva/:id",
                    name: "financiacionNueva",
                    component: FinanciacionEditorView,

                    meta: {
                        title: "Nueva Financiación",
                        header: "Registrar Nueva Financiación"
                    }
                },

                {
                    path: "financiaciones/:id/cuotas",
                    component: CuotasView,

                    meta: {
                        title: "Cuotas",
                        header: "Administración de Cuotas"
                    }
                },

                {
                    path: "pagos-cuota/nuevo/:id",
                    name: "PagoCuotaEditor",
                    component: PagoCuotaEditorView,

                    meta: {
                        title: "Registrar Pago",
                        header: "Registrar Pago de Cuota"
                    }
                },


                // ==========================
                // Cuenta Corriente
                // ==========================

                {
                    path: "cuentacorriente",
                    component: CuentaCorrienteView,

                    meta: {
                        title: "Cuenta Corriente",
                        header: "Administración de Cuenta Corriente"
                    }
                },


                // ==========================
                // Configuración
                // ==========================

                {
                    path: "configuracion",
                    component: ConfiguracionView,

                    meta: {
                        title: "Configuración",
                        header: "Configuración del Sistema",
                        roles: ROLES_CONFIGURACION
                    }
                },

                {
                    path: "configuracion/usuarios",
                    component: ConfiguracionUsuariosView,

                    meta: {
                        title: "Usuarios",
                        header: "Administración de Vendedores",
                        roles: ROLES_CONFIGURACION
                    }
                },

                {
                    path: "configuracion/usuarios/nuevo",
                    component: UsuarioEditorView,

                    meta: {
                        title: "Nuevo Vendedor",
                        header: "Registrar Vendedor",
                        roles: ROLES_CONFIGURACION
                    }
                },

                {
                    path: "configuracion/usuarios/:id/editar",
                    component: UsuarioEditorView,

                    meta: {
                        title: "Editar Vendedor",
                        header: "Modificar Vendedor",
                        roles: ROLES_CONFIGURACION
                    }
                },

                {
                    path: "configuracion/productos",
                    component: ConfiguracionProductosView,

                    meta: {
                        title: "Configuración de Productos",
                        header: "Marcas, Categorías y Subcategorías",
                        roles: ROLES_CONFIGURACION
                    }
                },

                {
                    path: "configuracion/vehiculos",
                    component: ConfiguracionVehiculosView,

                    meta: {
                        title: "Configuración de Vehículos",
                        header: "Marcas y Modelos",
                        roles: ROLES_CONFIGURACION
                    }
                },

                {
                    path: "configuracion/financiacion",
                    component: ConfiguracionFinanciacionView,

                    meta: {
                        title: "Configuración de Financiación",
                        header: "Planes de Financiación",
                        roles: ROLES_CONFIGURACION
                    }
                }

            ]

        }

    ]

});


// ==========================
// Guardia global
// ==========================

router.beforeEach((to) => {

    const auth = useAuthStore();


    // Requiere autenticación
    if (
        to.meta.requiresAuth &&
        !auth.estaLogueado
    ) {

        return "/login";

    }


    // Evitar volver al login
    // si ya existe sesión
    if (
        to.path === "/login" &&
        auth.estaLogueado
    ) {

        return "/";

    }


    // Control por rol
    const rolesPermitidos =
        to.meta.roles as string[] | undefined;


    if (
        rolesPermitidos &&
        !rolesPermitidos.includes(auth.rol)
    ) {

        return "/";

    }

});


export default router;