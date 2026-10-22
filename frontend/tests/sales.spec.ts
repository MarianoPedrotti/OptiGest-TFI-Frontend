import { beforeEach, describe, expect, it, vi } from "vitest";
import { flushPromises, RouterLinkStub } from "@vue/test-utils";
import {
    click,
    confirmFinancing,
    duplicateProducts,
    financing,
    mocks,
    quota,
    readySale,
    render,
    resetHarness,
    route,
    sale,
    choose
} from "./support";
import CuotaTable from "../src/components/cuotas/CuotaTable.vue";
import VentaTable from "../src/components/venta/VentaTable.vue";
import FinanciacionEditor from "../src/views/FinanciacionEditorView.vue";
import FinanciacionView from "../src/views/FinanciacionView.vue";
import CuotasView from "../src/views/CuotasView.vue";
import PagoCuotaEditor from "../src/views/PagoCuotaEditorView.vue";
import SelectInput from "../src/components/forms/SelectInput.vue";
import PagoVentaEditor from "../src/views/PagoVentaEditorView.vue";
import VentaDetalleView from "../src/views/VentaDetalleView.vue";
import VentasView from "../src/views/VentasView.vue";
import { useFinanciacionStore } from "../src/stores/financiacionStore";
import { useCuotaStore } from "../src/stores/cuotaStore";
import { useVentaStore } from "../src/stores/ventaStore";

beforeEach(resetHarness);

function financingLinkIsVisible(wrapper: ReturnType<typeof render>): boolean {
    return wrapper.findAllComponents(RouterLinkStub)
        .some(link => link.text() === "Financiar");
}

function paymentLinkIsVisible(wrapper: ReturnType<typeof render>): boolean {
    return wrapper.findAllComponents(RouterLinkStub)
        .some(link => link.text() === "Pagar");
}

describe("Fase 3: ventas, financiación y pagos", () => {
    it("does not offer financing for articles or a previously financed sale", () => {
        for (const item of [
            sale({ tieneVehiculo: false }),
            sale({ tieneFinanciacion: true, financiacionId: 50 })
        ]) {
            const wrapper = render(VentaTable, { ventas: [item] });
            expect(financingLinkIsVisible(wrapper)).toBe(false);
        }
    });

    it("does not offer financing for a paid sale or one without outstanding balance", () => {
        for (const item of [
            sale({ estado: "Pagada", estaPagada: true, saldoPendiente: 0 }),
            sale({ saldoPendiente: 0 }),
            sale({ estado: "Cancelada" })
        ]) {
            const wrapper = render(VentaTable, { ventas: [item] });
            expect(financingLinkIsVisible(wrapper)).toBe(false);
            expect(paymentLinkIsVisible(wrapper)).toBe(false);
        }
    });

    it("offers financing only for one unpaid vehicle detail", () => {
        const valid = render(VentaTable, { ventas: [sale()] });
        expect(financingLinkIsVisible(valid)).toBe(true);

        const mixed = render(VentaTable, {
            ventas: [sale({
                detalles: [
                    ...sale().detalles,
                    { id: 2, productoId: 10, nombreProducto: "Synthetic helmet", vehiculoId: null, nombreVehiculo: null, cantidad: 1, precioUnitario: 100, subtotal: 100 }
                ]
            })]
        });
        expect(financingLinkIsVisible(mixed)).toBe(false);
    });

    it("applies the same financing eligibility in the sale detail", async () => {
        mocks.saleGet.mockResolvedValue(sale({ estado: "Pagada", estaPagada: true, saldoPendiente: 0 }));
        const wrapper = render(VentaDetalleView);
        await flushPromises();

        expect(wrapper.findAllComponents(RouterLinkStub)
            .some(link => link.text() === "Financiar venta")).toBe(false);
    });

    it("blocks direct access to financing when the loaded sale is no longer eligible", async () => {
        mocks.saleGet.mockResolvedValue(sale({ tieneFinanciacion: true, financiacionId: 50 }));
        const wrapper = render(FinanciacionEditor);
        await flushPromises();

        expect(wrapper.text()).toContain("ya no reúne las condiciones");
        expect(wrapper.text()).not.toContain("Plan de financiación");
    });

    it("filters plans using the outstanding balance instead of the original total", async () => {
        mocks.saleGet.mockResolvedValue(sale({ total: 5000000, saldoPendiente: 3000000 }));
        mocks.plans.mockResolvedValue([
            { id: 30, activa: true, cantidadCuotas: 3, tasaInteres: 10, montoMinimo: 3000000, montoMaximo: 3000000 }
        ]);
        const wrapper = render(FinanciacionEditor);
        await flushPromises();

        expect(wrapper.findAll("select option")
            .some(option => option.attributes("value") === "30")).toBe(true);
        expect(wrapper.text()).toContain("Saldo a financiar");
    });

    it("invalidates an incompatible plan selection and distinguishes no plans from load errors", async () => {
        mocks.plans.mockResolvedValue([]);
        const wrapper = render(FinanciacionEditor);
        await flushPromises();

        expect(wrapper.text()).toContain("No hay planes activos compatibles");
        expect(wrapper.text()).not.toContain("No se pudo cargar la venta");
    });

    it("keeps the user in the editor while financing creation is pending", async () => {
        mocks.financingCreate.mockImplementation(() => new Promise<ReturnType<typeof financing>>(() => {}));
        const wrapper = render(FinanciacionEditor);
        await flushPromises();
        await confirmFinancing(wrapper);

        expect(mocks.push).not.toHaveBeenCalled();
        expect(mocks.financingCreate).toHaveBeenCalledOnce();
    });

    it("shows a controlled backend conflict and reloads the financing data", async () => {
        vi.spyOn(console, "error").mockImplementation(() => {});
        mocks.financingCreate.mockRejectedValue({
            response: { status: 409, data: { code: "venta_no_financiable", message: "La venta cambió." } }
        });
        const wrapper = render(FinanciacionEditor);
        await flushPromises();
        await confirmFinancing(wrapper);

        expect(wrapper.text()).toContain("La venta cambió");
        expect(mocks.saleGet).toHaveBeenCalledTimes(2);
        expect(mocks.push).not.toHaveBeenCalled();
    });

    it("keeps financing blocked after an unknown commit result while it reloads state", async () => {
        vi.spyOn(console, "error").mockImplementation(() => {});
        mocks.financingCreate.mockRejectedValue({
            response: { status: 503, data: { code: "resultado_no_confirmado", message: "No se pudo confirmar." } }
        });
        const wrapper = render(FinanciacionEditor);
        await flushPromises();
        await confirmFinancing(wrapper);

        expect(wrapper.text()).toContain("Resultado pendiente de confirmar");
        expect(wrapper.text()).not.toContain("Plan de financiación");
        expect(mocks.saleGet).toHaveBeenCalledTimes(2);
        expect(mocks.financingCreate).toHaveBeenCalledOnce();
    });

    it("invalidates a cached financing list after creation instead of merging an incomplete response", async () => {
        const store = useFinanciacionStore();
        await store.cargarListado();
        mocks.financingCreate.mockResolvedValue(financing(51));
        const editor = render(FinanciacionEditor);
        await flushPromises();
        await confirmFinancing(editor);

        expect(store.financiaciones.map(item => item.id)).toEqual([50]);
        expect(store.listadoDesactualizado).toBe(true);
        expect(store.resumen).toBeNull();
    });

    it("keeps the existing list cache until a caller explicitly refreshes it", async () => {
        const store = useFinanciacionStore();
        await store.obtenerTodos();
        mocks.financingList.mockResolvedValue([financing(), financing(51)]);
        await store.obtenerTodos();
        expect(store.financiaciones).toHaveLength(1);
        await store.obtenerTodos(true);
        expect(store.financiaciones).toHaveLength(2);
    });

    it("does not refresh a cached financing list merely by mounting its view", async () => {
        await useFinanciacionStore().obtenerTodos();
        mocks.financingList.mockResolvedValue([financing(), financing(51)]);
        render(FinanciacionView);
        await flushPromises();

        expect(useFinanciacionStore().financiaciones).toHaveLength(1);
        expect(mocks.financingList).toHaveBeenCalledTimes(1);
    });

    it("prevents a mixed sale by requiring confirmation before discarding the selected vehicle", async () => {
        const wrapper = await readySale();
        await choose(wrapper, "Tipo de venta", "vehiculo");
        await choose(wrapper, "Vehículo", "20");
        await choose(wrapper, "Tipo de venta", "articulos");
        await click(wrapper, "Cancelar");
        await click(wrapper, "Guardar Venta");

        expect(mocks.saleCreate).toHaveBeenCalledWith(expect.objectContaining({
            detalles: [{ vehiculoId: 20, cantidad: 1 }]
        }));
    });

    it("changes sale mode only after confirmation and preserves items when cancelled", async () => {
        const wrapper = await readySale();
        await choose(wrapper, "Producto", "10");
        await click(wrapper, "Agregar Producto");
        await choose(wrapper, "Tipo de venta", "vehiculo");
        await click(wrapper, "Cancelar");

        const tipoVenta = wrapper.findAllComponents(SelectInput)
            .find(input => input.props("label") === "Tipo de venta");
        expect((tipoVenta!.get("select").element as HTMLSelectElement).value).toBe("articulos");
        expect(wrapper.findAll("tbody tr")).toHaveLength(1);
        expect(wrapper.findAllComponents(RouterLinkStub)).toHaveLength(0);

        await choose(wrapper, "Tipo de venta", "vehiculo");
        await click(wrapper, "Confirmar");

        expect((tipoVenta!.get("select").element as HTMLSelectElement).value).toBe("vehiculo");
        expect(wrapper.text()).toContain("Vehículo");
        expect(wrapper.findAll("tbody tr")).toHaveLength(0);
    });

    it("consolidates duplicate articles into one persisted detail", async () => {
        const wrapper = await readySale();
        await duplicateProducts(wrapper, 2, 3);

        expect(wrapper.findAll("tbody tr")).toHaveLength(1);
        expect(wrapper.text()).toContain("Total venta: $500");
        await click(wrapper, "Guardar Venta");

        expect(mocks.saleCreate).toHaveBeenCalledWith(expect.objectContaining({
            detalles: [{ productoId: 10, cantidad: 5 }]
        }));
    });

    it("rejects accumulated stock above availability before any create request", async () => {
        const wrapper = await readySale();
        await duplicateProducts(wrapper, 6, 6);

        expect(mocks.saleCreate).not.toHaveBeenCalled();
        expect(wrapper.findAll("tbody tr")).toHaveLength(1);
        expect(wrapper.text()).toContain("Stock insuficiente");
    });

    it("updates totals and blocks an initial partial payment that becomes invalid", async () => {
        const wrapper = await readySale();
        await choose(wrapper, "Producto", "10");
        await wrapper.get('input[type="number"]').setValue(3);
        await click(wrapper, "Agregar Producto");
        await choose(wrapper, "Pago inicial", "Parcial");
        await choose(wrapper, "Forma de pago", "Efectivo");
        await wrapper.findAll('input[type="number"]')[2]!.setValue(250);
        await wrapper.findAll('input[type="number"]')[1]!.setValue(2);

        expect(wrapper.text()).toContain("El pago parcial debe ser menor al total actual");
        expect(wrapper.text()).toContain("Total venta: $200");
        await click(wrapper, "Guardar Venta");
        expect(mocks.saleCreate).not.toHaveBeenCalled();
    });

    it("blocks duplicate sale submissions while the first request is pending", async () => {
        const wrapper = await readySale();
        await choose(wrapper, "Producto", "10");
        await click(wrapper, "Agregar Producto");
        mocks.saleCreate.mockImplementation(() => new Promise(() => {}));

        const save = wrapper.findAll("button").find(button => button.text() === "Guardar Venta");
        await save!.trigger("click");
        await save!.trigger("click");

        expect(mocks.saleCreate).toHaveBeenCalledOnce();
    });

    it("does not re-submit a sale when post-create inventory refresh fails", async () => {
        vi.spyOn(console, "error").mockImplementation(() => {});
        const wrapper = await readySale();
        await choose(wrapper, "Producto", "10");
        await click(wrapper, "Agregar Producto");
        mocks.products.mockRejectedValue(new Error("Synthetic refresh failure"));
        await click(wrapper, "Guardar Venta");

        expect(wrapper.text()).toContain("La venta se registró, pero no se pudieron actualizar");
        expect(mocks.saleCreate).toHaveBeenCalledOnce();
        await click(wrapper, "Guardar Venta");
        expect(mocks.saleCreate).toHaveBeenCalledOnce();
    });

    it("rejects a product quantity above stock before sending the sale", async () => {
        const wrapper = await readySale();
        await choose(wrapper, "Producto", "10");
        await wrapper.get('input[type="number"]').setValue(11);
        await click(wrapper, "Agregar Producto");

        expect(mocks.saleCreate).not.toHaveBeenCalled();
        expect(wrapper.text()).toContain("Stock insuficiente");
    });

    it("does not offer direct payments for a sale that already has financing", async () => {
        mocks.saleGet.mockResolvedValue(sale({ tieneFinanciacion: true, financiacionId: 50 }));
        const wrapper = render(PagoVentaEditor);
        await flushPromises();

        expect(wrapper.text()).toContain("No se pueden registrar pagos directos");
        expect(wrapper.text()).not.toContain("Confirmar Pago");
    });

    it("shows a controlled payment conflict and reloads the sale instead of retrying", async () => {
        vi.spyOn(console, "error").mockImplementation(() => {});
        mocks.paymentCreate.mockRejectedValue({
            response: { status: 409, data: { code: "venta_financiada", message: "La venta ya fue financiada." } }
        });
        const wrapper = render(PagoVentaEditor);
        await flushPromises();
        await choose(wrapper, "Forma de pago", "Efectivo");
        await click(wrapper, "Confirmar Pago");
        await click(wrapper, "Confirmar");

        expect(wrapper.text()).toContain("La venta ya fue financiada");
        expect(mocks.saleGet).toHaveBeenCalledTimes(2);
        expect(mocks.paymentCreate).toHaveBeenCalledOnce();
    });

    it("keeps direct payment blocked after an unknown result while it reloads the sale", async () => {
        vi.spyOn(console, "error").mockImplementation(() => {});
        mocks.paymentCreate.mockRejectedValue({
            response: { status: 503, data: { code: "resultado_no_confirmado", message: "No se pudo confirmar." } }
        });
        const wrapper = render(PagoVentaEditor);
        await flushPromises();
        await choose(wrapper, "Forma de pago", "Efectivo");
        await click(wrapper, "Confirmar Pago");
        await click(wrapper, "Confirmar");

        expect(wrapper.text()).toContain("Resultado pendiente de confirmar");
        expect(mocks.saleGet).toHaveBeenCalledTimes(2);
        expect(mocks.paymentCreate).toHaveBeenCalledOnce();
    });

    it("sale creation through Pinia refreshes its list", async () => {
        const store = useVentaStore();
        await store.crear({ clienteId: 1, detalles: [{ productoId: 10, cantidad: 1 }] });

        expect(mocks.saleCreate).toHaveBeenCalledOnce();
        expect(store.ventas[0]?.id).toBe(40);
    });

    it("sale without a client or items never sends a request", async () => {
        const withoutClient = await readySale();
        await choose(withoutClient, "Cliente", "0");
        await click(withoutClient, "Guardar Venta");
        expect(mocks.saleCreate).not.toHaveBeenCalled();
        expect(withoutClient.text()).toContain("Cliente requerido");

        const withoutItems = await readySale();
        await click(withoutItems, "Guardar Venta");
        expect(mocks.saleCreate).not.toHaveBeenCalled();
        expect(withoutItems.text()).toContain("Venta sin artículos");
    });

    it("navigates to the quotas plan using the financing ID returned by the API", async () => {
        const wrapper = render(FinanciacionEditor);
        await flushPromises();
        await confirmFinancing(wrapper);

        expect(mocks.push).toHaveBeenCalledWith("/financiaciones/50/cuotas");
    });

    it("keeps the confirmed financing recoverable when navigation fails", async () => {
        mocks.push.mockResolvedValue({ type: 4 });
        const wrapper = render(FinanciacionEditor);
        await flushPromises();
        await confirmFinancing(wrapper);

        expect(mocks.financingCreate).toHaveBeenCalledOnce();
        expect(wrapper.text()).toContain("La financiación se registró, pero no se pudo abrir");
        await click(wrapper, "Abrir plan de cuotas");
        expect(mocks.financingCreate).toHaveBeenCalledOnce();
        expect(mocks.push).toHaveBeenCalledTimes(2);
    });

    it("does not retry a confirmed financing when its response lacks a valid ID", async () => {
        mocks.financingCreate.mockResolvedValue({ ...financing(), id: 0 });
        const wrapper = render(FinanciacionEditor);
        await flushPromises();
        await confirmFinancing(wrapper);

        expect(mocks.push).not.toHaveBeenCalled();
        expect(wrapper.text()).toContain("no incluyó un identificador válido");
        expect(mocks.financingCreate).toHaveBeenCalledOnce();
    });

    it("keeps the user in the editor and shows backend feedback after a non-conflict error", async () => {
        vi.spyOn(console, "error").mockImplementation(() => {});
        mocks.financingCreate.mockRejectedValue({ response: { data: { message: "Synthetic failure" } } });
        const wrapper = render(FinanciacionEditor);
        await flushPromises();
        await confirmFinancing(wrapper);

        expect(mocks.push).not.toHaveBeenCalled();
        expect(wrapper.text()).toContain("Synthetic failure");
    });

    it("sales view preserves descending order supplied by the API contract", async () => {
        mocks.saleList.mockResolvedValue([
            sale({ id: 41, nombreCliente: "New client", fecha: "2026-01-02T12:00:00" }),
            sale()
        ]);
        const wrapper = render(VentasView);
        await flushPromises();

        expect(wrapper.findAll("tbody tr")[0]!.text()).toContain("New client");
    });

    it("financing view preserves descending order supplied by the API contract", async () => {
        mocks.financingList.mockResolvedValue([financing(51), financing()]);
        const wrapper = render(FinanciacionView);
        await flushPromises();

        expect(wrapper.findAll("tbody tr")[0]!.text()).toContain("Synthetic client 51");
    });

    it("loads the quotas plan for the financing ID in the route", async () => {
        route.id = "50";
        mocks.quotaByFinancing.mockResolvedValue([quota(50)]);
        const wrapper = render(CuotaTable);
        await flushPromises();

        expect(mocks.quotaByFinancing).toHaveBeenCalledWith(50);
        expect(wrapper.text()).toContain("Synthetic client");
    });

    it("shows a recoverable quotas load error without changing the financing result", async () => {
        vi.spyOn(console, "error").mockImplementation(() => {});
        mocks.quotaByFinancing
            .mockRejectedValueOnce(new Error("Synthetic quota load failure"))
            .mockResolvedValueOnce([quota(40)]);
        const wrapper = render(CuotaTable);
        await flushPromises();

        expect(wrapper.text()).toContain("No se pudo cargar el plan de cuotas");
        expect(mocks.quotaByFinancing).toHaveBeenCalledOnce();
        await click(wrapper, "Reintentar carga");
        expect(mocks.quotaByFinancing).toHaveBeenCalledTimes(2);
        expect(wrapper.text()).toContain("Synthetic client");
    });

    it("refreshes the financing table and statistics after returning with stale cache", async () => {
        const store = useFinanciacionStore();
        await store.cargarListado();
        mocks.financingCreate.mockResolvedValue(financing(51));
        await store.crear({ ventaId: 40, configuracionFinanciacionId: 30 });
        mocks.financingList.mockResolvedValue([financing(51), financing()]);
        mocks.financingSummary.mockResolvedValue({ activas: 2, canceladas: 0, totalFinanciado: 2100, saldoPendiente: 2200 });

        const wrapper = render(FinanciacionView);
        await flushPromises();

        expect(mocks.financingList).toHaveBeenCalledTimes(2);
        expect(mocks.financingSummary).toHaveBeenCalledTimes(2);
        expect(store.resumen?.activas).toBe(2);
        expect(wrapper.findAll("tbody tr")[0]!.text()).toContain("Synthetic client 51");
    });

    it("does not render stale financing rows while the invalidated list refreshes", async () => {
        const store = useFinanciacionStore();
        await store.cargarListado();
        mocks.financingCreate.mockResolvedValue(financing(51));
        await store.crear({ ventaId: 40, configuracionFinanciacionId: 30 });
        let resolveList!: (value: ReturnType<typeof financing>[]) => void;
        mocks.financingList.mockReturnValueOnce(
            new Promise<ReturnType<typeof financing>[]>(resolve => { resolveList = resolve; })
        );

        const wrapper = render(FinanciacionView);
        await flushPromises();

        expect(wrapper.text()).toContain("Actualizando financiaciones");
        expect(wrapper.text()).not.toContain("Synthetic client 50");
        resolveList([financing(51), financing()]);
        await flushPromises();
        expect(wrapper.findAll("tbody tr")[0]!.text()).toContain("Synthetic client 51");
    });

    it("keeps active financing filters while a stale list is refreshed", async () => {
        const wrapper = render(FinanciacionView);
        await flushPromises();
        await choose(wrapper, "Estado", "Activa");
        mocks.financingCreate.mockResolvedValue(financing(51));
        await useFinanciacionStore().crear({ ventaId: 40, configuracionFinanciacionId: 30 });
        mocks.financingList.mockResolvedValue([
            { ...financing(), estado: "Cancelada" },
            financing(51)
        ]);
        mocks.financingSummary.mockResolvedValue({ activas: 1, canceladas: 1, totalFinanciado: 2100, saldoPendiente: 1100 });
        await useFinanciacionStore().cargarListado();
        await flushPromises();

        expect(wrapper.findAll("tbody tr")).toHaveLength(1);
        expect(wrapper.find("tbody tr")!.text()).toContain("Synthetic client 51");
    });

    it("keeps financing filters through quotas navigation and respects them after data changes", async () => {
        const initial = render(FinanciacionView);
        await flushPromises();
        await initial.get('input[placeholder="Cliente o vehículo..."]').setValue("Synthetic");
        await choose(initial, "Estado", "Activa");
        await choose(initial, "Cantidad de cuotas", "3");

        initial.unmount();
        const cuotas = render(CuotasView);
        await flushPromises();
        await click(cuotas, "Volver a financiaciones");
        expect(mocks.push).toHaveBeenCalledWith("/financiaciones");

        const regreso = render(FinanciacionView);
        await flushPromises();
        expect((regreso.get('input[placeholder="Cliente o vehículo..."]').element as HTMLInputElement).value).toBe("Synthetic");
        const estado = regreso.findAllComponents(SelectInput)
            .find(input => input.props("label") === "Estado");
        const cuotasFiltro = regreso.findAllComponents(SelectInput)
            .find(input => input.props("label") === "Cantidad de cuotas");
        expect((estado!.get("select").element as HTMLSelectElement).value).toBe("Activa");
        expect((cuotasFiltro!.get("select").element as HTMLSelectElement).value).toBe("3");

        useFinanciacionStore().financiaciones = [{
            ...financing(),
            estado: "Cancelada"
        }];
        await flushPromises();
        expect(regreso.text()).toContain("No se encontraron financiaciones.");
    });

    it("refreshes the latest financing list and summary after a confirmed installment payment", async () => {
        vi.useFakeTimers();

        try {
            const store = useFinanciacionStore();
            await store.cargarListado();

            let resolveOlderSummary!: (value: { activas: number; canceladas: number; totalFinanciado: number; saldoPendiente: number }) => void;
            const olderSummary = new Promise<{ activas: number; canceladas: number; totalFinanciado: number; saldoPendiente: number }>(resolve => {
                resolveOlderSummary = resolve;
            });
            mocks.financingSummary
                .mockReturnValueOnce(olderSummary)
                .mockResolvedValueOnce({ activas: 1, canceladas: 1, totalFinanciado: 2100, saldoPendiente: 1000 });
            mocks.financingList.mockResolvedValueOnce([
                { ...financing(), estado: "Cancelada" },
                financing(51)
            ]);
            const olderRequest = store.cargarResumen(true);

            route.id = "70";
            const wrapper = render(PagoCuotaEditor);
            await flushPromises();
            await choose(wrapper, "Forma de pago", "Efectivo");
            await click(wrapper, "Confirmar Pago");
            await click(wrapper, "Confirmar");
            await flushPromises();

            expect(mocks.cuotaPaymentCreate).toHaveBeenCalledOnce();
            expect(mocks.financingSummary).toHaveBeenCalledTimes(3);
            expect(store.financiaciones.map(item => item.estado)).toEqual(["Cancelada", "Activa"]);
            expect(store.resumen).toEqual({ activas: 1, canceladas: 1, totalFinanciado: 2100, saldoPendiente: 1000 });

            resolveOlderSummary({ activas: 2, canceladas: 0, totalFinanciado: 2100, saldoPendiente: 1880 });
            await olderRequest;
            expect(store.resumen?.saldoPendiente).toBe(1000);
        }
        finally {
            vi.runOnlyPendingTimers();
            vi.useRealTimers();
        }
    });

    it("prevents duplicate installment payment submission while the first request is pending", async () => {
        mocks.cuotaPaymentCreate.mockImplementation(() => new Promise(() => {}));
        route.id = "70";
        const wrapper = render(PagoCuotaEditor);
        await flushPromises();
        await choose(wrapper, "Forma de pago", "Efectivo");
        await click(wrapper, "Confirmar Pago");
        await click(wrapper, "Confirmar");

        const submit = wrapper.findAll("button")
            .find(button => button.text() === "Guardando...");
        expect(submit!.attributes("disabled")).toBeDefined();
        await submit!.trigger("click");
        expect(mocks.cuotaPaymentCreate).toHaveBeenCalledOnce();
    });

    it("ignores out-of-order financing list and summary responses", async () => {
        const store = useFinanciacionStore();
        let resolveFirstList!: (value: ReturnType<typeof financing>[]) => void;
        let resolveFirstSummary!: (value: { activas: number; canceladas: number; totalFinanciado: number; saldoPendiente: number }) => void;
        let resolveLatestList!: (value: ReturnType<typeof financing>[]) => void;
        let resolveLatestSummary!: (value: { activas: number; canceladas: number; totalFinanciado: number; saldoPendiente: number }) => void;
        const firstList = new Promise<ReturnType<typeof financing>[]>(resolve => { resolveFirstList = resolve; });
        const firstSummary = new Promise<{ activas: number; canceladas: number; totalFinanciado: number; saldoPendiente: number }>(resolve => { resolveFirstSummary = resolve; });
        const latestList = new Promise<ReturnType<typeof financing>[]>(resolve => { resolveLatestList = resolve; });
        const latestSummary = new Promise<{ activas: number; canceladas: number; totalFinanciado: number; saldoPendiente: number }>(resolve => { resolveLatestSummary = resolve; });
        mocks.financingList.mockReturnValueOnce(firstList).mockReturnValueOnce(latestList);
        mocks.financingSummary.mockReturnValueOnce(firstSummary).mockReturnValueOnce(latestSummary);

        const first = Promise.all([store.obtenerTodos(true), store.cargarResumen(true)]);
        const latest = Promise.all([store.obtenerTodos(true), store.cargarResumen(true)]);
        resolveLatestList([financing(51)]);
        resolveLatestSummary({ activas: 2, canceladas: 0, totalFinanciado: 2100, saldoPendiente: 2200 });
        await latest;
        resolveFirstList([financing()]);
        resolveFirstSummary({ activas: 1, canceladas: 0, totalFinanciado: 1000, saldoPendiente: 1100 });
        await first;

        expect(store.financiaciones.map(item => item.id)).toEqual([51]);
        expect(store.resumen?.activas).toBe(2);
    });

    it("ignores an outdated quotas response after a newer request", async () => {
        const store = useCuotaStore();
        let resolveFirst!: (value: ReturnType<typeof quota>[]) => void;
        let resolveLatest!: (value: ReturnType<typeof quota>[]) => void;
        const firstResponse = new Promise<ReturnType<typeof quota>[]>(resolve => { resolveFirst = resolve; });
        const latestResponse = new Promise<ReturnType<typeof quota>[]>(resolve => { resolveLatest = resolve; });
        mocks.quotaByFinancing.mockReturnValueOnce(firstResponse).mockReturnValueOnce(latestResponse);

        const first = store.cargarPorFinanciacion(40);
        const latest = store.cargarPorFinanciacion(50);
        resolveLatest([quota(50)]);
        await latest;
        resolveFirst([quota(40)]);
        await first;

        expect(store.cuotas.map(item => item.financiacionId)).toEqual([50]);
    });
});
