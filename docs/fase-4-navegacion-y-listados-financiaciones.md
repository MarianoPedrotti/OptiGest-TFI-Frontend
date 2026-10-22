# Fase 4 - Navegacion y actualizacion de financiaciones

## Navegacion posterior a la creacion

- `FinanciacionEditorView` usa exclusivamente el `id` de la financiacion
  retornada por el POST para navegar a `/financiaciones/{id}/cuotas`.
- Una respuesta exitosa sin identificador valido no habilita otro POST. La UI
  informa que la financiacion fue creada y conserva el formulario bloqueado.
- Si la navegacion falla, la financiacion ya confirmada permanece recuperable
  mediante `Abrir plan de cuotas`; ese reintento navega, no crea otra
  financiacion.
- `CuotaTable` carga las cuotas de la financiacion indicada por la ruta,
  reacciona a cambios de `:id` y muestra una carga recuperable si la API falla.

## Cache y orden

- La respuesta de creacion se usa solo para navegar. Lista y resumen se
  invalidan para no mezclar en la tabla un DTO de POST que no contiene todos
  sus campos de presentacion.
- Al volver a `FinanciacionView`, la lista y sus estadisticas se recargan en
  conjunto solo si la cache fue invalidada. Los filtros de la vista se
  conservan porque no se fuerzan remounts ni se reinician sus refs.
- Los stores ignoran respuestas de listado, resumen y cuotas que lleguen fuera
  de orden. El orden cronologico definitivo sigue siendo el enviado por la
  API; el store no vuelve a ordenar el listado.

## Pruebas

- La prueba pendiente de Fase 4 se integro en `tests/sales.spec.ts`: cubre el
  ID retornado y la ruta de cuotas.
- La caracterizacion anterior que esperaba volver a `/financiaciones` fue
  reemplazada por la nueva asercion equivalente de navegacion.
- Se agregaron casos para recuperacion de navegacion, identificador invalido,
  carga de cuotas, cache invalidada, resumen, filtros y respuestas fuera de
  orden.
