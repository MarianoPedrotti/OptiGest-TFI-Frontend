# Fase 3 - Correcciones funcionales del frontend estable

## Alcance y base

Worktree: `C:/Users/Pc/Desktop/OptiGest-Worktrees/frontend-estable`.
Rama: `fix/stable-sales-financing-ui`.
Base de infraestructura: `a2ca09d5cb41739ecae4261b27f586550e7fb3ff`.
Backend consultado, sin modificar: `../backend-estable`, Fase 2
`101c1b3c6a10816eba2844c2d99445df76d33fc2`.

Se aplicaron los AGENTS y las skills vue-frontend, fullstack-feature y
code-review. Solo se modifica `frontend/` del worktree estable, con datos
sinteticos en Vitest. No se modificaron backend, multitenancy, entidades,
migraciones, endpoints, rutas, contratos HTTP, dependencias productivas,

## Contratos Fase 2

Se consume el contrato existente:

- `GET /Venta/{id}` devuelve `detalles`, `tieneVehiculo`,
  `tieneFinanciacion`, `estaPagada`, `saldoPendiente`, `financiacionId` y la
  financiacion opcional.
- `GET /Venta` conserva su respuesta resumida. Como no materializa los detalles
  en esa ruta, VentasView consulta `GET /Venta/{id}` solamente para candidatas
  que, por su resumen, podrian financiarse. Sin el detalle completo, Financiar
  permanece oculto. No se agrega campo ni se cambia el contrato.
- `POST /Venta`, `POST /Financiacion` y `POST /PagoVenta` conservan payloads y
  respuestas actuales. El frontend no transmite precios ni confia en ellos para
  la validacion definitiva.
- Errores financieros `{ message, code }` con 409 y 503 se interpretan por
  status/code estructurado, nunca por comparar texto.

## Elegibilidad y pagos

`src/utils/ventaElegibilidad.ts` centraliza la presentacion. Financiar exige:

1. Estado operable `Pendiente`, `PagoParcial` o el estado historico `Parcial`.
2. Saldo pendiente positivo.
3. Sin financiacion por flag, id ni objeto, incluso si la financiacion esta
   cancelada.
4. Exactamente un detalle de vehiculo, cantidad uno y sin producto.

La misma funcion se usa en VentaTable, VentaDetalleView, VentasView y
FinanciacionEditorView. Pago directo reutiliza la politica de estado/saldo y
no se ofrece si existe una financiacion. La validacion final sigue siendo del
backend.

Conflicto 409: los editores recargan venta y planes cuando corresponde, muestran
el mensaje del servidor y dejan que el usuario vuelva a decidir. Resultado 503
`resultado_no_confirmado` o una falla sin respuesta: se recarga el estado
autoritatvo cuando hay id, se bloquea otro envio y se pide consultar antes de
reintentar. No hay reintentos automaticos. Una venta cuyo POST ya fue aceptado
no se presenta como fallida si luego falla el refresco de inventario; se limpia
el formulario y se evita duplicarla.

## VentaForm

Se conserva el lenguaje visual responsive (Bootstrap `row`, `col-12`,
`table-responsive`, `responsive-actions`, ToastAlert y ConfirmModal) sin
modificar estilos globales ni identidad OptiGest.

- Selector simple `Articulos | Vehiculo`.
- Vehiculo permite un unico selector y siempre envia cantidad uno.
- Articulos no expone selector de vehiculo. El producto se agrega una vez por
  `ProductoId`; una segunda adicion suma cantidad en la misma fila.
- Cambiar de modo pide confirmacion solo cuando descarta productos o vehiculo.
  Cancelar conserva el modo y los datos; confirmar descarta el tipo opuesto.
- La fila permite modificar cantidad y eliminar producto. Solo se aceptan
  enteros positivos, se controla stock acumulado y los subtotales/total se
  recalculan reactivamente.
- Pago parcial que pasa a ser invalido al cambiar total no se altera en silencio:
  queda visible el aviso y el envio se bloquea hasta corregirlo.
- Envio repetido se bloquea mientras el POST esta pendiente. Despues de crear
  se usa el detalle real de la venta para mostrar la pregunta de financiacion,
  sin asumir elegibilidad desde la UI previa.

## Financiacion y cache

FinanciacionEditorView filtra planes activos con
`MontoMinimo <= SaldoPendiente <= MontoMaximo`, muestra el saldo a financiar y
descarta una seleccion que se vuelve incompatible. Separan visualmente carga,
error de carga y ausencia real de planes. La confirmacion no se habilita sin
venta elegible, plan valido y datos cargados.

La creacion utiliza `financiacionStore.crear`, que conserva la financiacion
devuelta en cache con la insercion existente del store. No se fuerza una recarga
Fase 3.

## Pruebas y verificacion

Comandos ejecutados desde `frontend/`:

```powershell
npm ci --include=optional
npm run build
npm run test:typecheck
npm test
npm run test:pending
```

- Instalacion limpia: correcta, sin cambio de `package.json` ni
  `package-lock.json`.
- Build: correcto, `vue-tsc -b` y Vite 8.1.0.
- Typecheck de tests: correcto.
- Suite normal: **30 pruebas aprobadas, 0 fallidas**.
- Pending: **1 prueba fallida conocida**, exclusivamente la redireccion Fase 4
  al plan devuelto (`/financiaciones/50/cuotas`); la ruta actual a la lista se
  conserva sin cambios funcionales.

Se activaron las siete reglas pendientes de esta fase: ventas pagadas/sin saldo,
planes por saldo, composicion exclusiva, consolidacion, stock acumulado y cache
de financiacion. Se retiro solo la caracterizacion que exigia mostrar Financiar
en una venta pagada. Permanecen caracterizaciones de cache y orden API porque
la Fase 4 decide su cambio. Se agregaron cobertura de detalle, acceso directo,
directo bloqueado.

Vitest usa jsdom con services HTTP mockeados, sin API, browser real, credenciales
ni datos comerciales. La revision responsive fue estatica: los nuevos controles
usan los contenedores responsivos existentes; no se alteraron CSS globales ni
los breakpoints de ToastAlert/ConfirmModal. No se ejecuto E2E visual porque no
se inicio backend/JWT local; esa verificacion requeriria un entorno Testing
separado y no forma parte de esta fase.

`npm ci` informa las 8 vulnerabilidades conocidas de testing/transitivas (2
moderadas, 6 altas) y deprecaciones transitivas. No se aplico `npm audit fix`
fuera de alcance.

## Revision y Fase 4

La revision de diff no encontro cambios en backend, endpoints, router,
contratos, paquetes o configuracion de produccion. `git diff --check` no reporta

Fase 4 mantiene pendientes: navegar al detalle de cuotas usando el ID de la
financiacion creada, definir refresco de listados y resolver el ordenamiento
desde su fuente. No se implementan automaticamente como parte de esta fase.
