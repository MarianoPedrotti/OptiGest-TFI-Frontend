# Fase 5A.1 - Correcciones frontend de financiación y ventas

Fecha: 2026-10-20.

## Alcance

Corrección exclusiva de los tres hallazgos frontend de Fase 5A. Sin cambios en API,
entidades, migraciones, contratos, reglas comerciales, fórmulas financieras o
dependencias.

Versiones revisadas antes de empezar:

- Frontend: `fix/stable-sales-financing-ui` en `13f5cffca55b41ecaf5eba5d34bc204902a5e0d6`.
- Backend: `fix/stable-sales-financing-rules` en `f8ba7d4fe7f43f1e6ed09d852e5f324b9ceebaeb`.

Los diez archivos no versionados de Fase 5A fueron inspeccionados y se conservan.
No contienen credenciales reales ni conexión productiva. El harness genera credenciales
y JWT aleatorios solamente en `.testing-data/`, ruta ignorada por Git.

## Correcciones

### F5A-01 - Resumen de financiación desactualizado tras un pago de cuota

`src/stores/financiacionStore.ts` concentra ahora `invalidarDatos()`. Invalida lista,
resumen y solicitudes pendientes incrementando las versiones que ya protegían contra
respuestas fuera de orden. La creación de financiación reutiliza la misma acción.

Tras un POST de pago de cuota confirmado, `PagoCuotaEditorView` invalida los datos y
ejecuta una única recarga coordinada de cuotas, lista y resumen. El resumen y la tabla
provienen otra vez del backend antes de volver al módulo. Si falla solamente esa recarga,
el pago no se repite: se informa que fue registrado y la marca de desactualización hace
que el siguiente ingreso al listado vuelva a consultar el servidor.

El botón de pago se bloquea desde que se confirma la operación. Si el POST queda en
curso, no abre otra confirmación; si el POST ya fue confirmado y falla la recarga, queda
bloqueado para evitar un segundo cobro de la misma cuota.

Los pagos directos de ventas no cambian financiaciones: ya están bloqueados para ventas
financiadas, por lo que no requieren esta invalidación.

### F5A-02 - Filtros perdidos al volver desde cuotas

`FinanciacionView` usa el objeto de filtros transitorio del store Pinia existente:
`busqueda`, `estado` y `cuotas`. Los controles y el `computed` de la tabla comparten
esa única fuente reactiva. Por ello un remount normal al volver de
`/financiaciones/:id/cuotas` conserva los valores y la lista nueva sigue respetándolos.

No se añadieron query params, persistencia permanente ni dependencias. El usuario puede
seguir limpiar cada filtro desde los mismos controles Todos/Todas y el campo de búsqueda.

### F5A-03 - Selector de tipo de venta desincronizado al cancelar

`VentaForm` muestra `tipoVentaPendiente ?? tipoVenta` en el selector. `tipoVenta` sigue
siendo el único modo confirmado y `tipoVentaPendiente` ya representaba la solicitud que
espera confirmación. Al cancelar, limpiar ese estado pendiente vuelve a renderizar el
modo confirmado Artículos; al confirmar, se ejecuta la lógica existente que recién ahí
elimina los datos incompatibles y activa Vehículo.

No se añadieron estados de dominio duplicados, remounts forzados ni cambios de payload.

## Cobertura añadida

`frontend/tests/sales.spec.ts` pasó de 39 a 42 pruebas:

1. Confirma que cancelar Artículos -> Vehículo conserva la fila y devuelve el valor DOM
   del selector a `articulos`; confirmar deja `vehiculo` y descarta la fila.
2. Recorre Financiaciones -> Cuotas -> Volver, conserva los tres filtros y valida que
   una nueva lista no coincidente muestra el estado vacío.
3. Simula una respuesta de resumen anterior en vuelo mientras se confirma un pago de
   cuota; verifica lista/resumen nuevos y que la respuesta vieja no puede sobrescribirlos.
4. Intenta confirmar dos veces un pago de cuota mientras el primer POST sigue pendiente;
   verifica que el botón queda deshabilitado y que existe una única solicitud.

`frontend/tests/support.ts` ahora mockea únicamente los dos servicios necesarios para
montar el editor de cuotas en esa prueba. No habilita red en Vitest.

`frontend/tests/e2e/phase5a1-fixes.playwright.js` agrega un recorrido Playwright para
sesión aislada: crea dos financiaciones sintéticas, paga las tres cuotas de la primera,
confirma resumen/listado, conserva filtros al volver, valida cancelación/confirmación de
tipo de venta y revisa financiacones/nueva venta en tablet y móvil.

## Verificación ejecutada

| Comprobación | Resultado |
| --- | --- |
| Reproducción inicial focalizada | 38 aprobadas, 3 fallas confirmadas: selector, filtros y resumen |
| Vitest focalizado posterior | 42 aprobadas, 0 fallas |
| Vitest completo | 42 aprobadas, 0 fallas |
| Typecheck de tests | Correcto |
| Build frontend (`vue-tsc -b` + Vite) | Correcto |
| Regresión backend con SQL habilitado | 137 aprobadas, 0 fallas; 2 utilidades E2E omitidas por opt-in |
| Playwright aislado | 7 comprobaciones aprobadas |

El flujo Playwright usó una base sintética nueva y marcada de LocalDB exclusiva. Produjo
dos ventas de vehículo, dos financiaciones, tres pagos de cuota y comprobó en UI una
financiación Activa, una Cancelada y saldo pendiente `$1.100`. El segundo plan del
fixture aplica 10% de interés, por eso el saldo de su financiación activa es `$1.100`.

Las cuatro comprobaciones responsive fueron:

- Financiaciones en tablet 768x1024 y móvil 390x844.
- Nueva venta en tablet 768x1024 y móvil 390x844.

No hubo overflow horizontal del documento. Capturas ignoradas por Git:
`frontend/test-results/phase5a1/`.

El navegador permitió únicamente API/Vite en loopback. Se cerró al terminar; API, Vite
y LocalDB exclusiva también están detenidos. Se preservaron las bases sintéticas y las
evidencias locales ignoradas por Git.

## Archivos funcionales modificados

- `frontend/src/stores/financiacionStore.ts`
- `frontend/src/views/FinanciacionView.vue`
- `frontend/src/views/PagoCuotaEditorView.vue`
- `frontend/src/components/venta/VentaForm.vue`

No se modificaron archivos funcionales del backend, el worktree original ni la rama de
multitenancy. El cierre técnico queda registrado en commits locales; no hubo push, merge
ni despliegue.
