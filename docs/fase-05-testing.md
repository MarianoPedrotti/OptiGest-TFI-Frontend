# Fase 0.5 - Infraestructura de testing frontend

## Worktree permanente

`C:/Users/Pc/Desktop/OptiGest-Worktrees/frontend-estable`, rama
fix/stable-sales-financing-ui, HEAD/base
513ce535c3b056e6f70cf8cea3cf5655b0a62950.

Se traslado mediante git worktree move, conservando el documento de Fase 0
byte a byte. Sus referencias a Temp son historicas. La app sigue en frontend/.
No se modifico codigo bajo frontend/src, contratos, configuracion productiva,
Vite funcional ni tsconfig.app.json. No hay commits ni push.

## Dependencias y configuracion

Solo dependencias de desarrollo nuevas:

- vitest 4.1.6 (peer Vite 6/7/8, Node 20/22/24+ compatible con Node 22.16.0).
- @vue/test-utils 2.4.11 y jsdom 26.1.0.
- @vue/server-renderer, @vue/compiler-dom, @vue/compiler-sfc y @vue/shared
  fijados a 3.5.38 para alinear los peers de testing con Vue del snapshot y
  evitar subir Vue/TypeScript por agregar el runner.

Se conservaron los rangos productivos del manifiesto y las versiones directas
originales Vue 3.5.38 y TypeScript 6.0.2. package-lock.json incorpora tests y sus
transitivas. No se hicieron audit fix ni actualizaciones funcionales intencionales.

Vitest usa jsdom, archivos tests/**/*.spec.ts y setup que bloquea fetch/XHR.
Los services HTTP se mockean expresamente; requests no mockeados lanzan error.
No se inicia Vite/API ni se usa la sesion del navegador real, datos comerciales,
credenciales originales o produccion. La navegacion se observa con un doble de
router; no es una prueba E2E ni del backend.

Se separa tsconfig.tests.json de la compilacion de producto. No se requiere
cambiar tipos productivos ni incluir tests en src.

## Comandos ejecutados desde frontend/

```powershell
npm ci
npm run build
npm run test:typecheck
npm test
npm run test:pending
```

- npm ci: instalacion limpia reproducida con npm 10.9.2.
- Build: exitoso, vue-tsc -b y Vite 8.1.0.
- Typecheck especifico de tests: exitoso.
- npm test: 13 exitosas, 0 fallidas.
- npm run test:pending: 8 fallidas conocidas, retorno 1 esperado.
- Se guardo tambien un reporte JSON local de pendientes en
  `frontend/test-results/pending.json`, ignorado por Git.

Los pendientes son aserciones REALES, no test.skip ni fallos convertidos en
exito. La configuracion normal los excluye explicitamente; la configuracion
pending los ejecuta por separado. La suma de suites no esta verde: no se han
implementado las reglas.

## Cobertura inicial

Caracterizacion:
- Visibilidad actual de financiar (incluye prueba que documenta el defecto pagada).
- Pinia: cache, force refresh y refresco de ventas por su action existente.
- Formulario: cliente obligatorio, items obligatorios y stock individual.
- No navegar antes de respuesta; ruta actual despues de exito y feedback de error.
- Listado previamente cacheado permanece antiguo al montar la vista.
- Vistas conservan el orden descendente recibido de API; el sort se exigira en
  backend y no se impone una segunda implementacion innecesaria en frontend.

Requisitos pendientes:
1. Ocultar financiar en pagadas.
2. Ocultar financiar con saldo cero y estado desactualizado.
3. Elegibilidad de plan sobre saldo 3M frente a total 5M.
4. Exito -> /financiaciones/50/cuotas usando ID devuelto.
5. Bloquear venta mixta antes del HTTP.
6. Consolidar producto 2+3 en una fila/cantidad 5.
7. Validar stock acumulado antes del HTTP.
8. Refrescar financiaciones despues de crear aunque la lista estuviera cacheada.

Los helpers de interaccion se adaptaran si cambia el formulario autorizado;
no debe debilitarse la asercion de negocio para conseguir verde.

## Incidencias de herramientas

npm 10.9.2 fallo inicialmente resolviendo peers (edgesOut). Se ejecuto npm
11.6.2 de manera LOCAL mediante npm exec para instalar los runners, sin cambiar
npm global. Luego se normalizo el lockfile con npm 10 y se comprobo npm ci
normal desde cero. Se corrigieron exclusivamente problemas del harness de
mocks/reexports de Vitest durante su preparacion.

npm audit informa 8 vulnerabilidades (2 moderadas y 6 altas); tambien advierte
deprecaciones transitivas de whatwg-encoding y glob. No se aplicaron fixes
automaticos fuera del alcance.

## Coordinacion y pendientes

Backend hermano: ../backend-estable, proyecto tests/OptiGest.Tests; instancia
exclusiva OptiGest_Testing_Phase05. Ver su docs/fase-05-testing.md para barreras,
bases por ejecucion, migraciones SOLO sobre bases nuevas y resultados SQL.

No se instalaron Playwright Test ni browsers en este repositorio, ni se
ejecutaron E2E. La bateria actual verifica componentes/stores y llamadas de
navegacion simuladas. Antes de E2E real, preparar API Testing, JWT sintetico,
puertos propios y VITE_API_URL especifico: no usar localhost:7049 por defecto.

La version desplegada sigue sin identificarse; no hay autorizacion para
desplegar. Estamos preparados para comenzar Fase 1 bajo nueva autorizacion,
ampliando regresion de pagos, cuotas y cuenta corriente a medida que se corrijan.
