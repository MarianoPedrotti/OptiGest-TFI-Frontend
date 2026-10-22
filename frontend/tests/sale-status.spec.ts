import { beforeEach, describe, expect, it } from "vitest";
import { flushPromises } from "@vue/test-utils";
import { choose, mocks, render, resetHarness, sale } from "./support";
import DashboardUltimasVentas from "../src/components/dashboard/DashboardUltimasVentas.vue";
import VentaTable from "../src/components/venta/VentaTable.vue";
import VentasView from "../src/views/VentasView.vue";
import { useDashboardStore } from "../src/stores/dashboardStore";
import { useVentaStore } from "../src/stores/ventaStore";

beforeEach(resetHarness);

describe("Fase 5B: presentación compatible de estados de venta", () => {
    it.each([
        ["Parcial", "Pago parcial", "bg-warning"],
        ["PagoParcial", "Pago parcial", "bg-warning"],
        ["Pendiente", "Pendiente", "bg-secondary"],
        ["Pagada", "Pagada", "bg-success"]
    ])("dashboard: %s conserva su tratamiento visual sin mutar el store", (estado, label, color) => {
        const store = useDashboardStore();
        store.dashboard = {
            ventasDelDia: 1000, vehiculosDisponibles: 0, clientesConDeuda: 0,
            financiacionesActivas: 0, cuotasVencidas: 0, proximasCuotas: [], ventasUltimos7Dias: [],
            ultimasVentas: [{ ventaId: 1, cliente: "Synthetic", total: 1000, fecha: "2026-01-01", estado: estado! }]
        };
        const wrapper = render(DashboardUltimasVentas);
        expect(wrapper.get(".badge").text()).toBe(label);
        expect(wrapper.get(".badge").classes()).toContain(color);
        expect(store.dashboard.ultimasVentas[0]!.estado).toBe(estado);
    });

    it.each([
        ["Parcial", false, false, "Pago parcial"],
        ["PagoParcial", false, false, "Pago parcial"],
        ["Pendiente", false, false, "Pendiente"],
        ["Pagada", true, false, "Pagada"],
        ["Parcial", false, true, "Financiada"]
    ] as const)("tabla: %s, pagada=%s, financiada=%s", (estado, estaPagada, tieneFinanciacion, label) => {
        const item = sale({ estado, estaPagada, tieneFinanciacion });
        const wrapper = render(VentaTable, { ventas: [item] });
        expect(wrapper.get(".badge").text()).toBe(label);
        expect(item.estado).toBe(estado);
    });

    it.each([
        ["PagoParcial", [1, 2]],
        ["Pendiente", [3]],
        ["Pagada", [4]],
        ["", [1, 2, 3, 4]]
    ] as const)("filtro %s selecciona los estados esperados y conserva la respuesta", async (filter, ids) => {
        const states = ["Parcial", "PagoParcial", "Pendiente", "Pagada"];
        const items = states.map((estado, index) => sale({ id: index + 1, estado, tieneVehiculo: false }));
        mocks.saleList.mockResolvedValue(items);
        const wrapper = render(VentasView);
        await flushPromises();
        await choose(wrapper, "Estado", filter);
        expect(wrapper.getComponent(VentaTable).props("ventas").map(item => item.id)).toEqual(ids);
        expect(useVentaStore().ventas.map(item => item.estado)).toEqual(states);
        expect(items.map(item => item.estado)).toEqual(states);
    });

    it("combina el alias parcial con búsqueda y período sin ampliar los otros filtros", async () => {
        const today = new Date().toISOString();
        mocks.saleList.mockResolvedValue([
            sale({ id: 1, estado: "Parcial", tieneVehiculo: false, nombreCliente: "Buscado", fecha: today }),
            sale({ id: 2, estado: "PagoParcial", tieneVehiculo: false, nombreCliente: "Otro", fecha: today }),
            sale({ id: 3, estado: "Parcial", tieneVehiculo: false, nombreCliente: "Buscado", fecha: "2000-01-01T12:00:00" }),
            sale({ id: 4, estado: "Pagada", tieneVehiculo: false, nombreCliente: "Buscado", fecha: today })
        ]);
        const wrapper = render(VentasView);
        await flushPromises();
        await choose(wrapper, "Estado", "PagoParcial");
        await choose(wrapper, "Período", "hoy");
        await wrapper.get('input[placeholder="Cliente, vendedor o número de venta..."]').setValue("Buscado");
        expect(wrapper.getComponent(VentaTable).props("ventas").map(item => item.id)).toEqual([1]);
    });
});
