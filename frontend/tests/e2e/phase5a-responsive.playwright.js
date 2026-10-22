// Run with Playwright MCP browser_run_code_unsafe(code=<this file's function>).
// The MCP filename reader is restricted to the original workspace; do not copy files there.
// Requires the authenticated, origin-restricted context stored by the session as page.__qa.
// IDs are the synthetic dataset of this recorded run; no production URLs are accepted.
async (page) => {
    const qa = page.__qa;
    if (!qa || qa.front !== 'http://127.0.0.1:51851') throw new Error('Isolated QA session required');
    const p = qa.page;
    qa.responsive = [];
    const screens = [
        ['ventas', '/ventas'], ['nueva-venta', '/ventas/nuevo'], ['detalle-venta', '/ventas/4'],
        ['financiar', '/financiaciones/nueva/5'], ['financiaciones', '/financiaciones'], ['cuotas', '/financiaciones/2/cuotas']
    ];
    for (const [device, width, height] of [['desktop', 1440, 1000], ['tablet', 768, 1024], ['mobile', 390, 844]]) {
        await p.setViewportSize({ width, height });
        for (const [screen, route] of screens) {
            await p.goto(qa.front + route, { waitUntil: 'networkidle' });
            if (screen === 'nueva-venta') {
                await qa.select('Cliente', 3);
                await qa.select('Producto', 2);
                await qa.fill('Cantidad', 1);
                await p.getByRole('button', { name: 'Agregar Producto', exact: true }).click();
                await qa.select('Pago inicial', 'Total');
                await qa.select('Forma de pago', 'Efectivo');
                await p.getByRole('button', { name: 'Guardar Venta', exact: true }).click({ trial: true });
            }
            if (screen === 'financiar') {
                await qa.select('Plan de financiación', 3);
                await p.getByRole('button', { name: 'Confirmar financiación', exact: true }).click();
                await p.locator('.confirm-modal').waitFor();
                await p.getByRole('button', { name: 'Confirmar', exact: true }).click({ trial: true });
            }
            const metrics = await p.evaluate(() => {
                const modal = document.querySelector('.confirm-modal')?.getBoundingClientRect();
                const clippedControls = [...document.querySelectorAll('main button, main input, main select')]
                    .filter(element => {
                        const r = element.getBoundingClientRect();
                        return r.width > 0 && r.height > 0 && !element.closest('.table-responsive') &&
                            (r.left < -1 || r.right > innerWidth + 1);
                    }).map(element => element.textContent?.trim() || element.getAttribute('type'));
                return {
                    viewport: innerWidth, documentWidth: document.documentElement.scrollWidth,
                    bodyWidth: document.body.scrollWidth, clippedControls,
                    modalFits: !modal || (modal.left >= 0 && modal.top >= 0 && modal.right <= innerWidth && modal.bottom <= innerHeight),
                    tables: [...document.querySelectorAll('.table-responsive')].map(e => ({ width: e.clientWidth, contentWidth: e.scrollWidth, overflowX: getComputedStyle(e).overflowX }))
                };
            });
            const screenshot = qa.evidence + device + '-' + screen + '.png';
            await p.screenshot({ path: screenshot, fullPage: true });
            qa.responsive.push({ device, screen, route, screenshot, ...metrics,
                passed: metrics.documentWidth <= width + 1 && metrics.bodyWidth <= width + 1 && metrics.clippedControls.length === 0 && metrics.modalFits });
            if (screen === 'financiar') await p.getByRole('button', { name: 'Cancelar', exact: true }).click();
        }
    }
    return qa.responsive;
}
