# Fase 5C - Actualizacion de dependencias frontend

Fecha: 2026-10-21. Worktree `frontend-estable`, rama
`fix/stable-sales-financing-ui`, HEAD base
`b048d4282484c8255660d491dd0d6399a44c246a`.

## Alcance

Actualizacion minima del manifiesto y lockfile del frontend para resolver las
vulnerabilidades informadas por npm. No se modificaron componentes, stores,
servicios, contratos HTTP, configuracion de entornos, backend, SQL, Somee,
multitenancy ni el Release local existente.

## Dependencias actualizadas

- `axios`: `^1.18.1` a `^1.20.0`.
- `vue`: `^3.5.38` a `^3.5.44`.
- Paquetes Vue internos alineados en `3.5.44`: `@vue/compiler-dom`,
  `@vue/compiler-sfc`, `@vue/server-renderer` y `@vue/shared`.
- `vite`: `^8.1.0` a `8.1.6` exacto. Se fijo la ultima version compatible
  validada para no resolver automaticamente una version posterior de Vite 8.
- `vitest`: `4.1.6` a `4.1.12`.
- Overrides transitivos: `follow-redirects@1.16.1`, `nanoid@3.3.18`,
  `postcss@8.5.23` y `source-map-js@1.2.2`.

`@vitejs/plugin-vue@6.0.7` admite Vue 3 y Vite 8, y Vitest `4.1.12` admite
Vite 8. No se introdujeron dependencias funcionales nuevas.

El npm local `10.9.2` fallo dos veces al regenerar solamente el lockfile con
`Cannot read properties of null (reading 'edgesOut')`. Se uso
`npx --yes npm@11.8.0 install --package-lock-only --ignore-scripts` como npm
efimero, sin instalacion global ni ejecucion de scripts. `npm ci` posterior con
el npm local instalo el arbol bloqueado correctamente.

## Validacion

| Comando (desde `frontend/`) | Resultado |
| --- | --- |
| `npm ci` | Correcto, 254 paquetes instalados, 0 vulnerabilidades |
| `npm test` | 56 aprobadas, 0 fallidas |
| `npm run test:typecheck` | Correcto |
| `npm run build` | Correcto: `vue-tsc -b` y Vite 8.1.6, 267 modulos |
| `npm audit --json` | 0 vulnerabilidades |
| `npm audit --omit=dev --json` | 0 vulnerabilidades |

`npm ci` conserva avisos de deprecacion de `whatwg-encoding@3.1.1` y
`glob@10.5.0`. No son vulnerabilidades segun las dos auditorias finales y no
se ampliaron actualizaciones fuera del alcance.

## Integracion aislada

Se ejecuto el harness existente contra una base LocalDB nueva y de propiedad
verificada, `OptiGest_Testing_Phase05_3b3ca30622d24632a9654f1eccf987c3`.
Uso exclusivamente `http://127.0.0.1:51850` para API y
`http://127.0.0.1:51851` para Vite. La prueba bloqueo trafico externo y aprobo
las seis comprobaciones de ventas, pagos, filtros, dashboard, compatibilidad
historica de `Parcial` y conciliacion de cuentas. No hubo solicitudes externas.

El entorno se cerro con `Stop-IntegratedTesting.ps1 -StopDedicatedSql`: API y
Vite detenidos, puertos 51850/51851 libres y LocalDB
`OptiGest_Testing_Phase05` detenida. La base sintetica se conserva como
evidencia; no se accedio a bases productivas ni restauradas.

## Cierre

El cambio pendiente de revision se limita a `frontend/package.json`,
`frontend/package-lock.json` y este documento. No se creo commit, push, merge,
Release ni despliegue.
