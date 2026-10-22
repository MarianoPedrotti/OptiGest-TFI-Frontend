<template>
  <div class="login-page">
    <div class="login-card" rounded-0>
      
      <div class="login-logo">

    <div class="logo-wrapper">

        <img
            src="../assets/imagen/logo2.png"
            alt="Be Bikers"
        >

    </div>


    <img
        src="../assets/imagen/be bikers.png"
        alt="Be Bikers"
        class="brand-name"
    >


    <p>
        Motos & Accesorios
    </p>

</div>

      <div class="login-form">
        <h2>Sistema de Gestión</h2>
        <p class="text-secondary mb-4">
          Ingrese sus datos para continuar
        </p>

        <form @submit.prevent="login">
          <div class="mb-3">
            <label class="form-label">Email</label>
            <input
              class="form-control"
              v-model="form.email"
              type="email"
              placeholder="Correo electrónico"
            >
          </div>

          <div class="mb-3">
            <label class="form-label">Contraseña</label>
            <input
              class="form-control"
              v-model="form.password"
              type="password"
              placeholder="Contraseña"
            >
          </div>

          <p
            v-if="error"
            class="text-danger mb-3"
          >
            {{ error }}
          </p>

          <PrimaryButton
            class="w-100"
            type="submit"
            :disabled="cargando"
          >
            {{ cargando ? "Ingresando..." : "Ingresar" }}
          </PrimaryButton>
        </form>

        <div class="version">
          Versión 1.0
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import PrimaryButton from "../components/buttons/PrimaryButton.vue";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";

import authService from "../services/authService";
import { useAuthStore } from "../stores/authStore";

const router = useRouter();
const authStore = useAuthStore();

const cargando = ref(false);
const error = ref("");

const form = reactive({
  email: "",
  password: ""
});

async function login(){
  try {
    cargando.value = true;
    error.value = "";
    const session = await authService.login(form);
    authStore.setUsuario(session);
    router.push("/");
  }
  catch {
    error.value = "Usuario o contraseña incorrectos.";
  }
  finally {
    cargando.value = false;
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100dvh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px 16px;

  /* Fondo base gris claro limpio */
  background-color: var(--color-background); 
  
  /* Grilla tricolor ERP / Noventera */
  background-image: 
    /* 1. La grilla estructural gris de fondo (fina) */
    linear-gradient(var(--color-border) 1px, transparent 1px),
    linear-gradient(90deg, var(--color-border) 1px, transparent 1px),
    
    /* 2. Línea guía horizontal en Bordó (pasa cada 120px) */
    linear-gradient(rgba(122, 30, 36, 0.15) 2px, transparent 2px),
    
    /* 3. Línea guía vertical en Amarillo (pasa cada 120px) */
    linear-gradient(90deg, rgba(242, 183, 5, 0.25) 2px, transparent 2px);
  
  background-size: 30px 30px, 30px 30px, 120px 120px, 120px 120px;
}

.login-card {
  width: min(850px, 100%);
  min-height: 480px;
  height: auto;
  display: flex;
  overflow: hidden;
  
  /* Estilos de superficie y bordes corporativos */
  background-color: var(--color-surface);
  border: 2px solid var(--color-border);
  
  /* Sombra sólida noventera en bloque bordó */
  box-shadow: 12px 12px 0px var(--color-secondary);
}
.brand-name {

    width: 180px;

    max-width: 90%;

    height: auto;

    object-fit: contain;

    margin-bottom: 8px;

}

/* LADO IZQUIERDO: Bloque oscuro del logo */
.login-logo {
  width: 35%; /* Ajustado levemente para mejor balance del círculo */
  background-color: var(--color-sidebar); /* Cambiado a tu variable fija #1F1F1F */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: var(--color-text-light);
  padding: 20px;
}

/* Contenedor circular perfecto del logo */
.logo-wrapper {

    width: 140px;

    height: 140px;

    border-radius: 50%;

    overflow: hidden;

    margin-bottom: 18px;

}

.logo-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Recorta y evita que se distorsione la imagen */
}

.login-logo h3 {
  color: var(--color-primary); /* Cambiado a tu amarillo de variables #F2B705 */
  font-weight: bold;
  margin-bottom: 5px;
}

.login-logo p {
  color: #d6d6d6;
  margin: 0;
  font-size: 0.95rem;
}

/* LADO DERECHO: Formulario */
.login-form {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 50px;
}

.version {
  margin-top: 40px;
  text-align: center;
  color: #999;
  font-size: .9rem;
}

@media (max-width: 767.98px) {
  .login-card {
    flex-direction: column;
    min-height: 0;
    box-shadow: 8px 8px 0 var(--color-secondary);
  }

  .login-logo {
    width: 100%;
    padding: 24px 16px;
  }

  .logo-wrapper {
    width: 96px;
    height: 96px;
    margin-bottom: 12px;
  }

  .brand-name {
    width: 150px;
  }

  .login-form {
    padding: 32px 24px;
  }
}

@media (max-width: 575.98px) {
  .login-page {
    padding: 16px 12px;
  }

  .login-card {
    box-shadow: 6px 6px 0 var(--color-secondary);
  }

  .login-form {
    padding: 24px 18px;
  }
}
</style>
