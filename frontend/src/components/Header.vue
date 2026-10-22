<template>

<header class="app-header border-bottom">

    <div class="header-title">

        <button
            type="button"
            class="sidebar-toggle d-lg-none"
            aria-label="Abrir menú de navegación"
            @click="$emit('toggle-sidebar')"
        >
            <i class="bi bi-list"></i>
        </button>

        <h1 class="m-0">{{ titulo }}</h1>

    </div>

    <div
     v-if="auth.estaLogueado"
     class="header-user d-flex align-items-center gap-2 gap-sm-3"
>

    <div class="text-end header-user-name">

        <div class="fw-semibold text-light">
            {{ auth.nombre }}
            <i class="bi bi-person-circle me-1"></i>
        </div>

    </div>

    <button
        class="btn btn-outline-light btn-xs"
        @click="logout"
    >

        <i class="bi bi-box-arrow-right"></i>

    </button>

</div>
    

</header>

</template>

<script setup lang="ts">

import { computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/authStore";

const router = useRouter();
const auth = useAuthStore();

defineEmits<{
    (e: "toggle-sidebar"): void;
}>();

const titulo = computed(() => {

    return router.currentRoute.value.meta.header as string ;

});
function logout(){

    auth.logout();

    router.push("/login");

}

</script>

<style scoped>
.btn-xs {
  padding: 0.15rem 0.4rem;
  font-size: 0.84rem;
  border-radius: 0.1rem;
}
.app-header{

    min-height:60px;

    background:#7A1E24;

    display:flex;

    justify-content:space-between;

    align-items:center;

    gap:14px;

    padding:0 30px;

    
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

}

.header-title{

    display:flex;

    align-items:center;

    gap:12px;

    min-width:0;

}

.sidebar-toggle{

    width:40px;

    height:40px;

    border:1px solid rgba(255,255,255,.45);

    border-radius:10px;

    background:rgba(255,255,255,.08);

    color:#fff;

    display:inline-flex;

    align-items:center;

    justify-content:center;

    font-size:1.35rem;

}

.header-user{

    flex:0 0 auto;

}

.header-user-name{

    max-width:32vw;

    overflow:hidden;

    text-overflow:ellipsis;

    white-space:nowrap;

}

span{

    
    color:#FFFFFF;

    font-size:14px;

}
h1{

    color:#fff;
    font-size:clamp(1.15rem, 2.8vw, 1.75rem);
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.4);
    font-weight:600;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;

}

@media (max-width: 575.98px){

    .app-header{

        min-height:56px;

        padding:8px 12px;

    }

    .header-title{

        gap:8px;

    }

    .sidebar-toggle{

        width:38px;

        height:38px;

    }

    .header-user-name{

        max-width:26vw;

        font-size:.9rem;

    }

}

</style>
