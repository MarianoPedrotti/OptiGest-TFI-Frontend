<template>
<aside
    class="sidebar"
    :class="{
        'sidebar-open': abierto
    }"
    aria-label="Navegación principal"
>

    <div class="sidebar-top">

    <div class="avatar-container" >

        <img src="../assets/imagen/logo1.png" alt="Be Bikers" class="avatar-img">

    </div>

    <button
        type="button"
        class="sidebar-close d-lg-none"
        aria-label="Cerrar menú de navegación"
        @click="emit('cerrar')"
    >
        <i class="bi bi-x-lg"></i>
    </button>

    </div>

    <nav @click="emit('cerrar')">

<SidebarItem
    texto="Dashboard"
    ruta="/"
    icone="bi bi-speedometer2"
/>

<SidebarItem
    texto="Clientes"
    ruta="/clientes"
    icone="bi bi-people"
/>

<SidebarItem
    texto="Productos"
    ruta="/productos"
    icone="bi bi-box-seam"
/>
<SidebarItem
    texto="Vehículos"
    ruta="/vehiculos"
    icone="bi bi-car-front"
/>

<SidebarItem
    texto="Ventas"
    ruta="/ventas"
    icone="bi bi-cart-check"
/>

<SidebarItem
    texto="Financiaciones"
    ruta="/financiaciones"
    icone="bi bi-credit-card"
/>

<SidebarItem
    texto="Cuenta Corriente"
    ruta="/cuentacorriente"
    icone="bi bi-journal-text"
/>

<SidebarItem
    v-if="puedeConfigurar"
    texto="Configuración"
    ruta="/configuracion"
    icone="bi bi-gear"
/>

    </nav>
</aside>
</template>

<script setup lang="ts">


import { computed } from "vue";

import SidebarItem from "./SidebarItem.vue";

import { useAuthStore } from "../stores/authStore";

withDefaults(
    defineProps<{
        abierto?: boolean;
    }>(),
    {
        abierto: false
    }
);

const emit = defineEmits<{
    (e: "cerrar"): void;
}>();

const authStore = useAuthStore();

const puedeConfigurar = computed(() => {

    return (
        authStore.rol === "Admin" ||
        authStore.rol === "Dueno"
    );

});

</script>

<style scoped>
h2{
    /*text-shadow: 0px 1px 2px rgba(239, 183, 182, 0.4);*/
    text-shadow: 4px 4px 0px #7A1E24;
}
.sidebar{

    width:195px;

    flex:0 0 195px;

    min-height:100vh;

    background:var(--color-sidebar);

    color:white;

    display:flex;

    flex-direction:column;

    padding:12px 15px;

}
.sidebar-top{

    position:relative;

    display:flex;

    justify-content:center;

}
.sidebar-close{

    position:absolute;

    top:0;

    right:0;

    width:38px;

    height:38px;

    border:1px solid rgba(255,255,255,.25);

    border-radius:10px;

    background:rgba(255,255,255,.08);

    color:#fff;

    display:inline-flex;

    align-items:center;

    justify-content:center;

}
.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;      /* Evita que la imagen se deforme o estire */
}
.avatar-container {

    width: 120px;
    height: 120px;

    border-radius: 50%;
    overflow: hidden;

    border: 3px solid var(--color-border);

    align-self: center;

}
.logo{

    text-align:center;

    margin-bottom:40px;

}

.logo img{

    width:120px;

    border-radius:50%;


}

.logo h2{

    margin-top:15px;

    font-size:22px;

    color:var(--color-primary);

}

nav {

    display: flex;

    flex-direction: column;

    gap: 10px;

    margin-top: 22px;

}

@media (max-width: 991.98px){

    .sidebar{

        position:fixed;

        top:0;

        bottom:0;

        left:0;

        width:min(82vw, 280px);

        min-height:100dvh;

        overflow-y:auto;

        transform:translateX(-100%);

        transition:transform .25s ease;

        z-index:1040;

        box-shadow:var(--shadow-lg);

    }

    .sidebar-open{

        transform:translateX(0);

    }

}

@media (max-width: 575.98px){

    .sidebar{

        width:min(86vw, 270px);

        padding:12px;

    }

    .avatar-container{

        width:96px;

        height:96px;

    }

    nav{

        gap:8px;

        margin-top:18px;

    }

}

</style>
