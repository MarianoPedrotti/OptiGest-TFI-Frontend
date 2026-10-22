// Compatibilidad visual del alias histórico; no modifica entidades ni respuestas API.
export function normalizarEstadoVentaPresentacion(estado: string): string {
    return estado === "Parcial" ? "PagoParcial" : estado;
}
