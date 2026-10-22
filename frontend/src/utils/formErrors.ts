import axios from "axios";

export type FieldErrors = Record<string, string>;

const fieldAliases: Record<string, string> = {
    nombre: "nombre",
    dni: "dni",
    telefono: "telefono",
    email: "email",
    direccion: "direccion",

    sku: "sku",
    modelo: "modelo",
    descripcion: "descripcion",

    preciocompra: "precioCompra",
    precioventa: "precioVenta",
    stock: "stock",

    categoriaid: "categoriaId",
    subcategoriaid: "subCategoriaId",
    marcaproductoid: "marcaProductoId"
};

function normalizeFieldName(name: string): string {
    const normalized = name
        .replace(/[\[\].]/g, "")
        .toLowerCase();

    return fieldAliases[normalized] ?? name;
}

function obtenerRespuesta(error: unknown): {
    data: unknown;
    status: number | undefined;
} | null {
    if (axios.isAxiosError(error)) {
        return {
            data: error.response?.data,
            status: error.response?.status
        };
    }

    if (!error || typeof error !== "object")
        return null;

    const response = (error as { response?: unknown }).response;

    if (!response || typeof response !== "object")
        return null;

    const value = response as { data?: unknown; status?: unknown };

    return {
        data: value.data,
        status: typeof value.status === "number" ? value.status : undefined
    };
}

export function getApiStatus(error: unknown): number | undefined {
    return obtenerRespuesta(error)?.status;
}

export function getApiErrorCode(error: unknown): string | undefined {
    const data = obtenerRespuesta(error)?.data;

    if (!data || typeof data !== "object")
        return undefined;

    const code = (data as Record<string, unknown>).code;

    return typeof code === "string" ? code : undefined;
}

export function getApiErrors(error: unknown): {
    fields: FieldErrors;
    general: string;
} {
    const response = obtenerRespuesta(error);

    if (!response) {
        return {
            fields: {},
            general:
                "No se pudo guardar la información. Intentá nuevamente."
        };
    }

    const data = response.data;

    // Ejemplo:
    // BadRequest("Ya existe...")
    if (typeof data === "string") {
        return {
            fields: {},
            general: data
        };
    }

    if (!data || typeof data !== "object") {
        return {
            fields: {},
            general:
                "No se pudo guardar la información. Intentá nuevamente."
        };
    }

    const body = data as Record<string, unknown>;

    const fields: FieldErrors = {};

    const validationErrors = body.errors;

    if (
        validationErrors &&
        typeof validationErrors === "object"
    ) {
        for (const [field, messages] of Object.entries(
            validationErrors
        )) {
            const message = Array.isArray(messages)
                ? messages[0]
                : messages;

            if (typeof message === "string") {
                fields[normalizeFieldName(field)] = message;
            }
        }
    }

    const general =
        typeof body.detail === "string"
            ? body.detail
            : typeof body.message === "string"
                ? body.message
                : typeof body.title === "string"
                    ? body.title
                    : "";

    return {
        fields,
        general
    };
}
