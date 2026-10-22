// Run with Playwright MCP browser_run_code_unsafe(code=<this file's function>).
// Requires the authenticated, origin-restricted testing session in page.__qa.
async (page) => {
    const qa = page.__qa;
    if (!qa || qa.front !== 'http://127.0.0.1:51851')
        throw new Error('Isolated QA session required');

    const p = qa.page;
    const results = [];

    async function createFinancing({ clientId, vehicleId, planId, initialPayment }) {
        await p.goto(`${qa.front}/ventas/nuevo`, { waitUntil: 'networkidle' });
        await qa.select('Cliente', clientId);
        await qa.select('Tipo de venta', 'vehiculo');
        await qa.select('Vehículo', vehicleId);
        if (initialPayment) {
            await qa.select('Pago inicial', 'Parcial');
            await qa.select('Forma de pago', 'Efectivo');
            await qa.fill('Monto del pago parcial', initialPayment);
        }
        await p.getByRole('button', { name: 'Guardar Venta', exact: true }).click();
        await p.locator('.confirm-modal').waitFor();
        await p.getByRole('button', { name: 'Confirmar', exact: true }).click();
        await p.waitForURL(/\/financiaciones\/nueva\/\d+$/);
        await qa.select('Plan de financiación', planId);
        await p.getByRole('button', { name: 'Confirmar financiación', exact: true }).click();
        await p.locator('.confirm-modal').waitFor();
        await p.getByRole('button', { name: 'Confirmar', exact: true }).click();
        await p.waitForURL(/\/financiaciones\/\d+\/cuotas$/);
        return Number(new URL(p.url()).pathname.split('/')[2]);
    }

    async function payAllInstallments(financingId, expectedCount) {
        for (let index = 0; index < expectedCount; index += 1) {
            await p.getByRole('link', { name: 'Pagar', exact: true }).first().click();
            await p.waitForURL(/\/pagos-cuota\/nuevo\/\d+$/);
            await qa.select('Forma de pago', 'Efectivo');
            await p.waitForTimeout(100);
            await p.getByRole('button', { name: 'Confirmar Pago', exact: true }).click();
            await p.locator('.confirm-modal').waitFor();
            await p.getByRole('button', { name: 'Confirmar', exact: true }).click();
            await p.waitForURL(new RegExp(`/financiaciones/${financingId}/cuotas$`));
        }
    }

    const financingOne = await createFinancing({ clientId: 1, vehicleId: 1, planId: 1, initialPayment: 200 });
    const financingTwo = await createFinancing({ clientId: 4, vehicleId: 2, planId: 3 });

    await p.getByRole('button', { name: /Volver a financiaciones/ }).click();
    await p.waitForURL(`${qa.front}/financiaciones`);
    await p.locator(`a[href="/financiaciones/${financingOne}/cuotas"]`).click();
    await p.waitForURL(new RegExp(`/financiaciones/${financingOne}/cuotas$`));
    await payAllInstallments(financingOne, 3);
    await p.getByRole('button', { name: /Volver a financiaciones/ }).click();
    await p.waitForURL(`${qa.front}/financiaciones`);

    const stats = await p.locator('h6').evaluateAll(headings => Object.fromEntries(
        headings.map(heading => [heading.textContent?.trim(), heading.parentElement?.querySelector('h2')?.textContent?.trim()])
    ));
    if (stats['Financiaciones activas'] !== '1' || stats.Canceladas !== '1' || stats['Saldo pendiente'] !== '$1.100')
        throw new Error(`Stale financing statistics: ${JSON.stringify(stats)}`);
    results.push({ check: 'installment-payment-refreshes-list-and-summary', passed: true, stats });

    await qa.fill('Buscar', 'QA Sin pago');
    await qa.select('Estado', 'Activa');
    await qa.select('Cantidad de cuotas', 4);
    await p.waitForTimeout(100);
    await p.locator(`a[href="/financiaciones/${financingTwo}/cuotas"]`).click();
    await p.waitForURL(new RegExp(`/financiaciones/${financingTwo}/cuotas$`));
    await p.getByRole('button', { name: /Volver a financiaciones/ }).click();
    await p.waitForURL(`${qa.front}/financiaciones`);
    const filters = {
        search: await p.getByPlaceholder('Cliente o vehículo...').inputValue(),
        values: await p.locator('select').evaluateAll(elements => elements.map(element => element.value))
    };
    if (filters.search !== 'QA Sin pago' || JSON.stringify(filters.values) !== '["Activa","4"]')
        throw new Error(`Filters were not preserved: ${JSON.stringify(filters)}`);
    results.push({ check: 'filters-survive-quotas-navigation', passed: true, filters });

    await p.goto(`${qa.front}/ventas/nuevo`, { waitUntil: 'networkidle' });
    await qa.select('Producto', 1);
    await qa.fill('Cantidad', 1);
    await p.getByRole('button', { name: 'Agregar Producto', exact: true }).click();
    const saleType = p.locator('select').nth(1);
    await saleType.selectOption('vehiculo');
    await p.waitForTimeout(100);
    await p.locator('.confirm-modal').waitFor();
    await p.getByRole('button', { name: 'Cancelar', exact: true }).click();
    if (await saleType.inputValue() !== 'articulos' || await p.locator('tbody tr').count() !== 1)
        throw new Error('Cancelling the sale type change did not restore articles mode.');
    await saleType.selectOption('vehiculo');
    await p.waitForTimeout(100);
    await p.getByRole('button', { name: 'Confirmar', exact: true }).click();
    if (await saleType.inputValue() !== 'vehiculo' || await p.locator('tbody tr').count() !== 0)
        throw new Error('Confirming the sale type change did not activate vehicle mode.');
    results.push({ check: 'sale-type-cancel-and-confirm', passed: true });

    for (const [screen, route] of [['financiaciones', '/financiaciones'], ['nueva-venta', '/ventas/nuevo']]) {
        for (const [device, width, height] of [['tablet', 768, 1024], ['mobile', 390, 844]]) {
            await p.setViewportSize({ width, height });
            await p.goto(qa.front + route, { waitUntil: 'networkidle' });
            const metrics = await p.evaluate(() => ({
                documentWidth: document.documentElement.scrollWidth,
                bodyWidth: document.body.scrollWidth,
                viewport: innerWidth
            }));
            const screenshot = `${qa.evidence}phase5a1-${device}-${screen}.png`;
            await p.screenshot({ path: screenshot, fullPage: true });
            if (metrics.documentWidth > width + 1 || metrics.bodyWidth > width + 1)
                throw new Error(`Responsive overflow on ${device} ${screen}: ${JSON.stringify(metrics)}`);
            results.push({ check: `responsive-${device}-${screen}`, passed: true, screenshot, ...metrics });
        }
    }

    return results;
}
