<template>
    
    <div class="layout">
        
        <Sidebar
            :abierto="sidebarAbierto"
            @cerrar="cerrarSidebar"
        />

        <div
            class="sidebar-backdrop"
            :class="{
                'sidebar-backdrop-visible': sidebarAbierto
            }"
            aria-hidden="true"
            @click="cerrarSidebar"
        ></div>
        
        <div class="main-content">
            
            <Header @toggle-sidebar="alternarSidebar"/>
            
            <main class="page-content">
                
                <RouterView/>
                
            </main>
            
        </div>
        
    </div>
    
</template>

<script setup lang="ts">

import { ref, watch } from "vue";
import { useRoute } from "vue-router";

import Sidebar from "../components/Sidebar.vue";
import Header from "../components/Header.vue";

const route = useRoute();

const sidebarAbierto = ref(false);

function alternarSidebar() {

    sidebarAbierto.value = !sidebarAbierto.value;

}

function cerrarSidebar() {

    sidebarAbierto.value = false;

}

watch(
    () => route.fullPath,
    () => cerrarSidebar()
);

</script>
