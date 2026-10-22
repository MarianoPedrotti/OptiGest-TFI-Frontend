import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import { useAuthStore } from "./stores/authStore";

import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/styles/index.css";


const app = createApp(App);

const pinia = createPinia();


app.use(pinia);


// ==========================
// Recuperar sesión
// ==========================

const authStore =
    useAuthStore();

authStore.cargarSesion();


// ==========================
// Router
// ==========================

app.use(router);


// ==========================
// Montar aplicación
// ==========================

app.mount("#app");