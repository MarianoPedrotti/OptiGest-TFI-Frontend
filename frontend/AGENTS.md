# SistemaDeVentas Frontend
Aplicacion Vue para operar el sistema de ventas desde el navegador: login, dashboard, clientes, productos, vehiculos, ventas, cuotas y configuracion.

## Stack
- Lenguaje: TypeScript con `vue-tsc` estricto.
- Framework / runtime: Vue 3 + Vite + Pinia + Vue Router.
- Base de datos: no accede directo; consume la API por Axios.
- Tests: no hay scripts de test/lint configurados en `package.json`.

## Comandos
- `npm install` — instala dependencias desde `package-lock.json`.
- `npm run dev` — arranca Vite en desarrollo.
- `npm run build` — ejecuta typecheck con `vue-tsc -b` y build de Vite.
- `npm run preview` — sirve el build localmente.

## Estructura del proyecto
- `src/main.ts` — crea Vue, Pinia, recupera sesion, instala router y monta la app.
- `src/router/index.ts` — rutas, metadatos de pantalla y guardia global.
- `src/services/` — Axios centralizado y clientes por recurso.
- `src/stores/` — estado Pinia y acciones usadas por vistas.
- `src/views/` — pantallas; componen stores, modales, tablas, formularios y alerts.
- `src/components/` — componentes base y componentes de dominio por modulo.
- `src/assets/styles/` — CSS global importado desde `index.css`.

## Convenciones
- Para un recurso nuevo, actualiza en conjunto `src/types`, `src/services`, `src/stores` y la vista/componente correspondiente.
- Los stores no llaman a Axios directo; usan services. Los services devuelven `response.data`.
- Los formularios existentes emiten `guardar` y reciben una entidad opcional para editar; segui ese contrato.
- Usa `ConfirmModal.vue` y `ToastAlert.vue` para confirmaciones y feedback en vez de alertas ad hoc.
- Las rutas de pantalla deben definir `meta.title` y `meta.header`; configuracion reutiliza `ROLES_CONFIGURACION`.
- Bootstrap y Bootstrap Icons ya se importan en `src/main.ts`; no los reimportes en componentes.

## No hagas
- No hardcodees URLs de API en services; usa `src/services/endpoints.ts` y la instancia de `api.ts`.
- No llames a `localStorage` fuera de `src/utils/auth.ts` salvo necesidad concreta.
- No dejes imports, parametros o variables sin usar: `vue-tsc` falla con `noUnusedLocals` y `noUnusedParameters`.
- No uses enums u otros constructos TypeScript que violen `erasableSyntaxOnly`.

## Flujo de trabajo
- Antes de una tarea no trivial, propone un plan y espera mi OK.
- Una tarea a la vez; al terminar, dime que cambiaste para que lo revise.
- Si no estas seguro al 80%, pregunta. No inventes.

## Documentacion
- Reglas generales del repo: `../../AGENTS.md`.
- Endpoints compartidos: `src/services/endpoints.ts`.
- Sesion persistida: `src/utils/auth.ts` usa la clave `session`.
