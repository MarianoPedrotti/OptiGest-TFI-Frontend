# OptiGest frontend - Fase 0

## Worktree y alcance

- Rama: fix/stable-sales-financing-ui.
- Base: 513ce535c3b056e6f70cf8cea3cf5655b0a62950.
- Worktree: C:/Users/Pc/AppData/Local/Temp/opencode/optigest-stable-frontend.
- Aplicacion: frontend/ dentro del worktree.
- Backend coordinado: fix/stable-sales-financing-rules, base
  0450b9bf898863eb5308d240136ee8e7f4fe531c, en
  C:/Users/Pc/AppData/Local/Temp/opencode/optigest-stable-backend.

Se verifico ausencia de rama/ruta antes de git worktree add. No se cambiaron
los archivos, ramas ni cambios pendientes del directorio original. No se creo
ningun commit ni se realizo push. No se modificaron logica, contratos,
manifiestos, lockfiles ni configuraciones. Este archivo documenta preparacion,
no implementacion. Los worktrees en Temp deben conservarse durante el trabajo.

## Build comprobado

Node 22.16.0 y npm 10.9.2. Desde frontend/:

- npm ci: exitoso, dependencias existentes desde lockfile.
- npm run build: exitoso, vue-tsc -b y Vite 8.1.0.
- npm reporto 6 vulnerabilidades altas; no se ejecuto audit fix.

No se inicio Vite ni se hicieron peticiones API. No hay verificacion funcional
de reglas nuevas: todavia no se implementaron.

## Version productiva pendiente

No hay workflows de despliegue en el snapshot ni tags/metadatos que vinculen
inequivocamente este hash con produccion. package.json tiene version 0.0.0 y el
README es el del template. .env.production usa /api, que no identifica version.
No se accedio a produccion ni a datos comerciales. Solicitar al responsable
commit/manifiesto/hash del artefacto realmente instalado antes de desplegar.

## Testing existente

Solo scripts dev/build/preview. No hay scripts de test/lint ni configuracion
versionada de Vitest/Jest/Cypress/Playwright. Las herramientas Playwright del
harness no constituyen tests reproducibles del repositorio.

## Preparacion propuesta, pendiente de autorizacion

Agregar dependencias exclusivamente de desarrollo, compatibles con Vite 8,
Vue 3, TypeScript 6 y Node instalado, sin actualizar paquetes funcionales por
costumbre:

- Vitest para funciones, composables, stores y componentes.
- Vue Test Utils y entorno DOM, por ejemplo jsdom, para interaccion Vue.
- Playwright Test y browser de prueba para E2E reproducible.

No se instalaron esas herramientas ni se modificaron configuraciones/scripts.
Los comandos de tests futuros se definiran al configurar el runner; no existen
aun. No usar mocks de API como evidencia de integridad SQL.

### Componentes y estado

1. Elegibilidad compartida: tabla de ventas, detalle y editor. Pagada, saldo
   cero, articulos y financiacion previa deben bloquear la accion; un vehiculo
   elegible debe permitir continuar.
2. Planes contra saldo: minimo y maximo inclusivos; mismo saldo que API; plan
   seleccionado invalidado si deja de aplicar; carga incompleta bloquea envio.
3. Venta: conservar selector unico de vehiculo; no mezclar con articulos ni
   permitir multiples vehiculos. Cambio de tipo confirmado/cancelado.
4. Consolidacion: producto X cantidad 2 mas X cantidad 3 deja una fila de 5;
   rechazo por stock acumulado conserva la seleccion anterior. Cantidades
   enteras positivas y recalculo de subtotales/total/pago inicial.
5. Eliminar ultima linea deja estado vacio no guardable.
6. POST financiacion demorado no redirige prematuramente; exito usa ID de
   financiacion devuelto, no ID de venta; error no muestra exito.
7. Error del GET posterior no vuelve a ejecutar POST ni afirma que no se creo.
8. Listado previamente cacheado se invalida y muestra nuevos registros sin F5.
9. Orden descendente estable y filtros que conservan orden; doble confirmacion
   bloqueada mientras la operacion esta en curso.

Usar Pinia y router aislados por prueba; crear spies/dobles de services HTTP en
unitarias y restaurar timers/mocks para evitar interferencia entre casos.

### E2E y regresion

Con API y SQL de pruebas independientes y datos sinteticos:

- Venta de un vehiculo sin pago, entrega parcial y pago total.
- Articulos consolidados; mezcla prohibida; multiples vehiculos rechazados por
  API aunque la interfaz no permita seleccionarlos.
- Financiacion exclusiva de vehiculo, saldo real y rango del plan.
- Registro exitoso -> cuotas por ID -> listado actualizado y descendente.
- Pagos directos, pagos de cuotas, ultima cuota y cuenta corriente coherentes.
- Historicos sinteticos mixtos siguen siendo consultables/cobrables sin ser
  reescritos. Su elegibilidad para nueva financiacion no se asume.
- Fallos comerciales y conflictos muestran feedback; 401/403 conservan reglas.
- Viewports 1366x768, 768x1024, 390x844 y 375x812; comprobar formularios, acciones,
  tablas, sidebar, modales, toasts y ausencia de overflow accidental.

Los casos API de rollback/concurrencia se ejecutaran en backend con dos scopes
y conexiones distintas y se verificaran por consultas con contexto nuevo.

## Aislamiento de ejecucion requerido

.env.development apunta a https://localhost:7049/api. Ese puerto puede pertenecer
a multitenancy u otra API. NO usar npm run dev sin definir previamente la API
de pruebas y un puerto/origen frontend dedicado.

El backend mantiene el mismo UserSecretsId que el original; el worktree no
aisla secretos ni variables externas. Crear configuracion Testing con fuentes
controladas y conexion exclusiva de prueba, sin copiar credenciales originales.
Usar JWT y usuarios sinteticos y contexto de navegador nuevo por escenario.
Verificar que la API realmente apunta a la base de pruebas antes de escrituras.

No se provisiono ni consulto ninguna base. Hay SQLCMD/LocalDB disponibles y
SQLEXPRESS en ejecucion; no se reutilizo. Docker no se encontro en PATH.
Se propone instancia LocalDB exclusiva y bases OptiGest_Test_<runId> o SQL
Server de pruebas equivalente al productivo al conocerlo. Crear instancia,
base, esquema o instalar herramientas requiere autorizacion adicional.

## Proximo paso

La compilacion y el aislamiento de codigo estan listos. Para ejecutar pruebas
financieras faltan autorizacion para runners y SQL aislado, configuracion
Testing, datos sinteticos y politica de limpieza. No se inicio Fase 1.

El detalle de AppDbContext, SaveChanges, reintentos, atomicidad, protocolo por
venta/cliente y pruebas de fallos esta en docs/fase-0-entorno-y-pruebas.md del
worktree backend. La procedencia productiva sigue siendo un bloqueo de despliegue.

Referencias consultadas mediante Context7:
- https://vitest.dev/guide/
- https://learn.microsoft.com/ef/core/testing/testing-with-the-database
