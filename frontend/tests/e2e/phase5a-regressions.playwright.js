// Read-only UI reproductions on the authenticated synthetic session page.__qa.
// Execute this function through browser_run_code_unsafe(code=...). No POST is sent.
async (page) => {
    const qa = page.__qa;
    if (!qa || qa.front !== 'http://127.0.0.1:51851') throw new Error('Isolated session required');
    const p = qa.page;
    const failures = [];
    await p.setViewportSize({ width: 1440, height: 1000 });
    await p.goto(qa.front + '/financiaciones', { waitUntil: 'networkidle' });
    await qa.fill('Buscar', 'QA');
    await qa.select('Estado', 'Activa');
    await qa.select('Cantidad de cuotas', 2);
    await p.locator('a[href="/financiaciones/2/cuotas"]').click();
    await p.locator('tbody tr').nth(1).waitFor();
    await p.getByRole('button', { name: /Volver a financiaciones/ }).click();
    await p.locator('tbody tr').first().waitFor();
    const filters = {
        search: await p.getByPlaceholder('Cliente o vehículo...').inputValue(),
        values: await p.locator('select').evaluateAll(elements => elements.map(e => e.value))
    };
    if (filters.search !== 'QA' || JSON.stringify(filters.values) !== '["Activa","2"]')
        failures.push({ code: 'FILTERS_LOST', actual: filters });
    await p.goto(qa.front + '/ventas/nuevo', { waitUntil: 'networkidle' });
    await qa.select('Producto', 2);
    await qa.fill('Cantidad', 1);
    await p.getByRole('button', { name: 'Agregar Producto', exact: true }).click();
    await qa.select('Tipo de venta', 'vehiculo');
    await p.locator('.confirm-modal').waitFor();
    await p.getByRole('button', { name: 'Cancelar', exact: true }).click();
    const typeValue = await p.locator('label').filter({ hasText: /^Tipo de venta$/ })
        .locator('..').locator('select').inputValue();
    if (typeValue !== 'articulos') failures.push({ code: 'SALE_TYPE_SELECTOR_DESYNC', actual: typeValue });
    return { passed: failures.length === 0, failures };
}
