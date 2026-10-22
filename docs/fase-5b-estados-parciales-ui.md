# Fase 5B — Presentación compatible de estados parciales

Fecha: 2026-10-21. Worktree frontend-estable, rama
`fix/stable-sales-financing-ui`, HEAD base `b1487ac0b6c44734e9136fdba0edad6145c4da1f`.
Sin paquete de despliegue.

## Revisión previa del backend (solo lectura)

Se revisaron los cambios locales sobre fd7f787: PagoVentaService,
VentaRepository, CuentaCorrienteService, CuentaCorrienteRepository, regresiones
SQL/unitarias y documentación. No se encontraron hallazgos significativos ni
cambios fuera del alcance aprobado. El backend conserva sus cinco archivos
modificados y tres nuevos de la fase anterior; no se editó en esta fase.

- PagoParcial es canónico en nuevas escrituras; Parcial es aceptado en resumen.
- El saldo individual suma sobre la colección completa ya cargada, sin un
  segundo viaje a SQL. Resumen y contador agregan en SQL. No se agregó N+1.
- El orden Fecha/Id solo afecta presentación. Se preservan Saldo histórico,
  transacciones y sp_getapplock.
- Las sumas necesitan recorrer movimientos por cliente; no se midieron planes
  de ejecución ni rendimiento con un volumen productivo grande. No se encontró
  evidencia de un problema importante que impidiera continuar.
- Una suma correcta no repara movimientos faltantes ni saldos iniciales implícitos.
  Este límite ya estaba documentado en backend.

La evidencia previa sigue siendo 159 pruebas backend aprobadas, 0 fallidas.
No se repitió esa suite: la validación adicional ejecutó ambos worktrees reales.

## Implementación frontend

- Nueva función pura `normalizarEstadoVentaPresentacion` en
  `frontend/src/utils/ventaEstadoPresentacion.ts`: Parcial -> PagoParcial;
  cualquier otro valor permanece intacto. Uso limitado a presentación y filtro.
- DashboardUltimasVentas muestra ambos parciales como `Pago parcial`, con
  `bg-warning text-dark`. Pagada conserva verde y Pendiente el tratamiento
  secundario existente; otros estados mantienen su comportamiento previo.
- VentasView incluye ambos alias al seleccionar PagoParcial, conservando los
  demás filtros y su combinación con búsqueda y período.
- VentaTable reconoce el alias histórico y conserva la precedencia de venta
  pagada y financiada.

Se revisó ventaElegibilidad: ya acepta ambos alias y no requiere modificación.
El valor Parcial de tipoPago en VentaForm es una modalidad del formulario, no
una escritura de estado. No se cambiaron stores, respuestas API, DTO, payloads,
reglas financieras, dependencias ni configuración.

## Pruebas de componentes y build

Archivo nuevo: `frontend/tests/sale-status.spec.ts`, 14 casos:

- 4 estados en dashboard: etiquetas, colores y conservación del store.
- 5 variantes en tabla, incluyendo prioridad de financiación.
- 4 filtros de ventas y conservación de los estados originales.
- 1 combinación de alias histórico, búsqueda y período.

Antes de corregir componentes: 9 aprobadas, 5 fallidas por diferencias esperadas
de presentación y filtrado. Después:

| Comando (desde frontend/) | Resultado |
| --- | --- |
| npm test | 56 aprobadas, 0 fallidas (42 existentes + 14 nuevas) |
| npm run test:typecheck | Correcto |
| npm run build | Correcto: vue-tsc -b y Vite, 264 módulos |

El dist generado es exclusivamente la salida local de validación, ignorada por
Git; no se ensambló paquete de backend+SPA ni se publicó.

## Integración entre worktrees

Se verificaron antes del arranque la configuración Testing, TestingDatabase,
TestingStartup y los launchers existentes. La instancia exclusiva
OptiGest_Testing_Phase05 estaba detenida. El harness verifica proceso LocalDB,
inventario permitido, nombre nuevo, marcador de propiedad y destino antes de
migrar/sembrar; la API comprueba destino y propiedad al iniciar y antes de guardar.
No se usaron configuraciones ni credenciales productivas. La autenticación usó
únicamente la sesión sintética generada para la ejecución.

SQL del harness: LocalDB 15.0.4382.1 (SQL Server 2019), no prueba del motor 2022.
API http://127.0.0.1:51850 y Vite http://127.0.0.1:51851. Navegador con service
workers bloqueados y lista permitida de HTTP/WebSocket de loopback. Cero
solicitudes HTTP externas en el escenario aprobado.

Script nuevo: `frontend/tests/e2e/phase5b-sale-status.playwright.js`.
Recibe fixtures sintéticos de la ejecución en page.__phase5bIsolation y
page.__phase5bSession; no contiene contraseñas ni conexiones. Se ejecutó mediante
Playwright MCP como código, pues el cargador de archivos MCP no admite la ruta
del worktree externo. No usa require/import de Node en el sandbox MCP.

Primera ejecución: el test esperaba redirección al detalle tras el pago, pero
la aplicación redirige correctamente al listado. Se corrigió esa expectativa
solo en el test; se detuvo el entorno y se creó otra base nueva, sin reintentar
pagos sobre la primera.

- Primera base: OptiGest_Testing_Phase05_594cc89163034ace8fecc0975c6a93dc.
- Base de ejecución aprobada: OptiGest_Testing_Phase05_6c24facbce3a42eab1bdd8a12688e896.
- Evidencia de aislamiento y cierre final:
  `backend-estable/.testing-data/phase5a-ad652126c9d34dfc939f57d34b5b44a1/`.

El transporte de terminal informó errores ChildProcess.kill al lanzar procesos
persistentes. Los manifiestos y listeners confirmaron el arranque correcto;
no se lanzó otro entorno sobre puertos ocupados.

### Resultado final: 6 comprobaciones aprobadas, 0 fallidas

1. API real: cuatro ventas de artículos, parcial inicial, pendientes y pagada.
2. UI -> API: pago posterior de 20 sobre 100, estado PagoParcial y resumen 3/1.
3. Tabla y filtros reales: dos parciales, una pendiente y una pagada.
4. Dashboard real: dos badges parciales, uno pagado y uno pendiente.
5. Compatibilidad histórica: adaptación EXPLÍCITA de respuestas GET Venta y
   Dashboard, sustituyendo un estado por Parcial solo en el navegador; tabla,
   filtros y dashboard funcionan igual. Tras retirar la adaptación se confirmó
   mediante API que la venta seguía almacenada como PagoParcial. Este escenario
   no demuestra persistencia histórica E2E; el backend la cubrió en su suite SQL.
6. UI -> API: pago final de 80, venta Pagada, saldo individual y de resumen cero,
   tres movimientos para ese cliente, dos clientes deudores y resumen final 2/2.

No se ejecutó la utilidad Verify_current_run_persistence_read_only de Fase 5A,
porque sus cantidades corresponden a otro escenario fijo. Aquí se contrastaron
las respuestas posteriores de la API real, sin modificar ese verificador.

Ambas ejecuciones se cerraron con Stop-IntegratedTesting.ps1 -StopDedicatedSql.
API y Vite detenidos, puertos 51850/51851 libres, LocalDB detenida. Bases sintéticas
retenidas. Ningún acceso a Somee, bebikersdb, copia restaurada o multitenancy.

## Cierre

La autorización posterior permite únicamente commits locales separados. Siguen
prohibidos push, merge, rebase y preparación del Release hasta nueva autorización.
