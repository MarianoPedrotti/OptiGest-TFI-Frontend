# Fase 5A — Validación integral de OptiGest

Fecha: 2026-10-20. **Terminada con tres defectos frontend pendientes. No apta aún para publicación.**

Actualización de cierre Fase 5A.1: los tres defectos frontend de este informe fueron
corregidos y revalidados con 42 pruebas frontend, build/typecheck y el recorrido
integrado final. Este informe conserva los hallazgos originales como evidencia; ver
`fase-5a1-correcciones-frontend.md`. Los bloqueos operativos de Fase 5B permanecen.

## Versiones y entorno

- Backend `f8ba7d4fe7f43f1e6ed09d852e5f324b9ceebaeb` y frontend
  `13f5cffca55b41ecaf5eba5d34bc204902a5e0d6`, ramas estables autorizadas y limpias al inicio.
- API real `http://127.0.0.1:51850`; frontend real `http://127.0.0.1:51851`.
- SQL LocalDB exclusiva `OptiGest_Testing_Phase05`, base nueva
  `OptiGest_Testing_Phase05_64938c187c654bfe91b614cc97cf6142`.
- JWT, usuarios Admin/Vendedor y todos los datos generados exclusivamente para testing.
- Sin mocks de respuestas en estos flujos. Navegador Chromium con service workers
  bloqueados y allowlist de los dos orígenes locales, incluido WebSocket de Vite.
- No se modificaron reglas, fórmulas, estilos, rutas o contratos de la aplicación.

## Resultado funcional

55 comprobaciones registradas: **51 conformes y 4 no conformes**, correspondientes
a tres defectos distintos (la pérdida de filtros se reprodujo dos veces).
Son comprobaciones de la sesión integrada, no 55 nuevos tests de Vitest.

| Escenario | Resultado |
| --- | --- |
| Login Admin/Vendedor mediante UI, password hasher y JWT reales | Conforme |
| Contraseña incorrecta y API sin token | 401, conforme |
| Venta de artículos, producto repetido y total | 5 cascos + 2 guantes = $600; dos detalles persistidos |
| Stock acumulado insuficiente | Bloqueado en UI; API 409 sin nueva venta |
| Venta mixta | UI conserva un único modo; API 400 `venta_mixta` |
| Cancelar cambio de tipo de venta | Datos conservados, selector visual incorrecto: F5A-03 |
| Vehículo con entrega inicial | Venta 2: total $1.000, entrega $200, saldo $800 |
| Vehículo sin pago | Venta 5: saldo $1.000, sin pagos |
| Venta pagada completamente | Venta 4: pago $1.000, estado Pagada, saldo cero |
| Venta completada desde móvil | Venta 6: un guante, $50, Pagada, saldo cero |
| Planes por saldo | Saldo $800 muestra planes 1/2; excluye plan 3 para montos desde $1.000 y plan inactivo |
| Redirección real | POST devuelve financiación 1 para venta 2; navegador abre `/financiaciones/1/cuotas` |
| Cuotas cargadas desde API | Tres de financiación 1, total $880 |
| Regreso tras crear con caché ya cargada | Segunda financiación visible sin F5; orden `[2,1]`, tabla y estadísticas actualizadas |
| Filtros al regresar desde cuotas | No conservados: F5A-02 |
| Listado de ventas | Orden `[5,4,3,2,1]` antes del caso móvil; filtros conservan el orden de API |
| Acción Ver financiación | Venta 2 usa financiación 1; no sustituye por ID de venta |
| Venta pagada o financiada | Acciones no permitidas ocultas; acceso directo al editor bloqueado |
| Doble financiación / pago directo de financiada | API 409 sin duplicados |
| Pago de tres cuotas por UI | $293,33, $293,33 y $293,34; cada cuota persistida Pagada |
| Última cuota | Financiación Cancelada, venta Pagada, cuenta del cliente en cero |
| Pago duplicado de cuota | 409 `cuota_pagada`; sigue habiendo tres pagos |
| Estadísticas después de cuotas | Desactualizadas aunque tabla y API correctas: F5A-01 |
| Cuenta corriente visual y SQL | Seis movimientos del cliente 1; saldo $0; saldo global sintético $2.600 |

Verificación SQL independiente, con contexto nuevo y solo lectura: **18 aserciones aprobadas**.
La consulta constató seis ventas por $4.650, stock final 5/17, cuatro vehículos vendidos,
dos financiaciones, cinco cuotas y tres pagos de cuota por $880.

## Hallazgos confirmados — correcciones propuestas, no implementadas

### [MEDIUM] F5A-01 — Estadísticas obsoletas tras pagar cuotas

Ubicación: `frontend/src/stores/financiacionStore.ts:107-145` y
`frontend/src/views/PagoCuotaEditorView.vue:332-342`.

Reproducción: cargar el listado con dos financiaciones activas, pagar las tres cuotas
de la financiación 1 y volver al listado sin recargar el navegador.

- Tabla: financiación 1 Cancelada, correcto.
- API: activas 1, canceladas 1, saldo pendiente $1.000.
- Tarjetas UI: activas 2, canceladas 0, saldo pendiente $1.880.

Causa: el pago fuerza la recarga de la lista, pero no invalida el resumen.
`cargarResumen()` retorna la caché existente cuando `force=false`.
Impacto: información financiera visible incoherente; la persistencia de los cobros es correcta.
Propuesta mínima: invalidar y refrescar lista/resumen conjuntamente después del pago
confirmado, manteniendo diferenciados los errores posteriores de lectura y el éxito del POST.
Agregar una prueba de navegación real después de pagar la última cuota.

Evidencia: [tarjetas obsoletas con fila cancelada](../frontend/test-results/phase5a/08-estadisticas-post-pago.png).

### [MEDIUM] F5A-02 — Filtros perdidos al regresar al listado

Ubicación: `frontend/src/views/FinanciacionView.vue:128-135`.

Reproducción: búsqueda `QA`, estado `Activa`, cantidad 2 o 3; abrir cuotas y pulsar
Volver a financiaciones. Se restablecen búsqueda vacía, Todos y Todas.
Causa: los criterios son refs locales reinicializados en cada montaje normal de ruta.
La prueba anterior ejercitaba actualización con la misma instancia montada, no este regreso.
Propuesta mínima: conservar criterios en el store existente y recuperarlos al volver;
probar el ciclo completo con Vue Router real.

Evidencias: [antes](../frontend/test-results/phase5a/13-filtros-antes.png) y
[después](../frontend/test-results/phase5a/14-filtros-despues.png).

### [LOW] F5A-03 — Selector de tipo desincronizado al cancelar

Ubicación: `frontend/src/components/venta/VentaForm.vue:20-22,364-394`.

Reproducción: agregar un artículo, elegir Vehículo y cancelar la confirmación.
Los artículos siguen en el formulario, pero el select nativo conserva `vehiculo`.
Causa: se modifica la selección nativa sin cambiar el tipo confirmado; cancelar
solo limpia el estado pendiente, sin restituir la selección visible.
Propuesta mínima: enlazar explícitamente la selección pendiente/confirmada y restaurar
el valor al cancelar, sin forzar remount ni descartar los artículos.
Agregar aserción del valor DOM del select, además de comprobar los detalles conservados.

Evidencia: [selector móvil tras cancelar](../frontend/test-results/phase5a/10-selector-cancelado-mobile.png).

## Responsividad

18/18 combinaciones de pantalla/tamaño conformes en las comprobaciones geométricas:

| Pantallas | Escritorio 1440×1000 | Tablet 768×1024 | Móvil 390×844 |
| --- | --- | --- | --- |
| Ventas, nueva venta, detalle, editor financiación, financiaciones y cuotas | 6/6 | 6/6 | 6/6 |

Sin overflow horizontal del documento ni controles principales recortados. Tablas
anchas con scroll horizontal contenido; se comprobó acceso a la acción desplazada.
Formularios completables, confirmación/cancelación accesibles y modales dentro del viewport.
Además se realizó un POST de venta desde móvil, verificado después por API y SQL.

Capturas destacadas: [formulario móvil](../frontend/test-results/phase5a/mobile-nueva-venta.png),
[modal móvil](../frontend/test-results/phase5a/mobile-financiar.png),
[tabla tablet](../frontend/test-results/phase5a/tablet-financiaciones.png).
Se revisaron visualmente capturas además de las medidas DOM. No se validaron dispositivos
físicos, WebKit ni Firefox. La prueba utilizó viewport de Chromium, no emulación táctil completa.

## Suites y builds

| Verificación | Resultado |
| --- | --- |
| Backend build completo | 0 errores; 73 advertencias preexistentes |
| Backend suite normal | 137 aprobadas, 0 fallidas; 2 utilidades E2E omitidas por falta de opt-in |
| Backend lectura SQL E2E separada | 1 aprobada, 18 aserciones |
| Frontend `npm run test:typecheck` | Correcto |
| Frontend `npm test` | 39 aprobadas, 0 fallidas |
| Frontend `npm run build` | Correcto |

Las 137 pruebas incluyen integridad, concurrencia y HTTP. Los tres defectos descubiertos
permanecen fuera de la cobertura efectiva de los 39 casos unitarios existentes.
No se debilitaron ni ocultaron aserciones de esas suites.

## Evidencia y reproducibilidad

32 capturas y `integrated-summary.json` en `frontend/test-results/phase5a/`, ignorados
por Git y conservados localmente. El resumen se transcribió de los resultados de la
sesión Playwright, sin tokens ni contraseñas.

Scripts nuevos:

- `frontend/vite.integrated.config.ts`: configuración exclusiva para testing.
- `frontend/tests/e2e/phase5a-responsive.playwright.js`: recorrido de seis pantallas
  en tres tamaños, usando la sesión autenticada aislada.
- `frontend/tests/e2e/phase5a-regressions.playwright.js`: reproducciones sin POST de
  filtros y selector; resultado observado `passed=false` con los dos códigos de defecto.

Se ejecutaron sus funciones mediante `browser_run_code_unsafe(code=...)`. El lector
`filename` del servidor MCP está limitado al workspace original; no se copiaron scripts
a ese directorio para eludirlo. Los scripts requieren `page.__qa` con la página/contexto
aislado, helpers de selección y carpeta de evidencia establecidos durante la sesión.
Son herramientas de sesión, no un runner autónomo de CI. No se instaló Playwright Test.

Dos expectativas iniciales del harness se corrigieron conforme al contrato: el orden
de opciones de plan no era un requisito (se validó el conjunto de IDs), y venta mixta
devuelve 400, no 409. También se ajustaron esperas del harness: la venta de artículos
reinicia el formulario y el editor de pago necesita esperar sus datos antes de confirmar.
Estos incidentes están diferenciados de los cuatro incumplimientos funcionales registrados.
Nunca se reintentó un POST financiero con resultado desconocido.

## Producción, cierre y recomendación

La investigación local no identifica commits/artefactos realmente instalados,
configuración efectiva de SQL Server, historial de migraciones productivo ni procedimientos
verificables de backup, rollback y monitoreo. Ver
`../../backend-estable/docs/fase-5a-investigacion-despliegue.md`.

API/frontend y sus procesos hijos detenidos, puertos 51850/51851 libres, contexto de
navegador cerrado y LocalDB exclusiva detenida. Bases y evidencias conservadas.

Los HEAD originales se mantienen y las adiciones de testing/documentación quedan
versionadas en commits locales de cierre. Código funcional y dependencias intactos.

**Recomendación:** las tres correcciones frontend ya fueron revalidadas en Fase 5A.1.
Resolver la procedencia productiva y los requisitos operativos antes de avanzar a
preparación/publicación de Fase 5B. No se ejecutó publicación, push, merge ni despliegue.
