// Playwright MCP function. Supply only this NEW run's generated testing fixtures
// as page.__phase5bIsolation and page.__phase5bSession. Never log the session.
// Pass the function as code if the MCP file loader does not allow the worktree.
async (page) => {
    const isolation = page.__phase5bIsolation;
    const session = page.__phase5bSession;
    if (!isolation || !session) throw new Error('Explicit isolated testing fixtures required');
    const api = 'http://127.0.0.1:51850';
    const front = 'http://127.0.0.1:51851';
    if (isolation.Instance !== 'OptiGest_Testing_Phase05' || !isolation.NewDatabase || !isolation.OwnershipVerified ||
        isolation.Environment !== 'Testing' || isolation.UserSecrets !== false ||
        !/^OptiGest_Testing_Phase05_[a-f0-9]{32}$/.test(isolation.DatabaseName) ||
        session.DatabaseName !== isolation.DatabaseName || session.Ownership !== isolation.Ownership ||
        session.Api !== api || session.Frontend !== front)
        throw new Error('Testing isolation evidence rejected');

    const context = await page.context().browser().newContext({ serviceWorkers: 'block' });
    const external = [];
    await context.route('**/*', async route => {
        const origin = new URL(route.request().url()).origin;
        if (origin === api || origin === front) await route.continue();
        else { external.push(origin); await route.abort(); }
    });
    await context.routeWebSocket('**/*', socket => {
        if (new URL(socket.url()).origin === 'ws://127.0.0.1:51851') socket.connectToServer();
        else socket.close();
    });
    const p = await context.newPage();
    const checks = [];
    const assert = (condition, message) => { if (!condition) throw new Error(message); };
    try {
        await p.goto(front + '/login');
        await p.getByPlaceholder('Correo electrónico').fill(session.Email);
        await p.getByPlaceholder('Contraseña', { exact: true }).fill(session.Password);
        const login = p.waitForResponse(response => response.url() === api + '/api/Auth/login');
        await p.getByRole('button', { name: 'Ingresar', exact: true }).click();
        const loginResponse = await login;
        assert(loginResponse.ok(), 'Synthetic login failed');
        const token = (await loginResponse.json()).token;
        assert(typeof token === 'string', 'Missing synthetic token');
        await p.waitForURL(front + '/');
        async function request(endpoint, data) {
            const result = await p.evaluate(async ({ url, token, data }) => {
                const response = await fetch(url, {
                    method: data === undefined ? 'GET' : 'POST',
                    headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
                    body: data === undefined ? undefined : JSON.stringify(data)
                });
                return { status: response.status, body: await response.json() };
            }, { url: api + '/api/' + endpoint, token, data });
            assert(result.status === 200, 'Unexpected HTTP status for ' + endpoint + ': ' + result.status);
            return result.body;
        }
        assert((await request('Venta')).length === 0, 'Fresh synthetic database required; do not replay this test');
        const product = session.Products[0].Id;
        const create = (client, amount) => request('Venta', {
            clienteId: session.Clients[client].Id, detalles: [{ productoId: product, cantidad: 1 }],
            ...(amount ? { pagoInicial: { monto: amount, formaPago: 'Efectivo' } } : {})
        });
        const initialPartial = await create(0, 25);
        const laterPartial = await create(1, 0);
        await create(2, 100);
        await create(3, 0);
        assert(initialPartial.estado === 'PagoParcial' && laterPartial.estado === 'Pendiente', 'Creation state mismatch');
        checks.push('API: creación con pago inicial parcial, sin pago y pagada');

        async function payThroughUi(id, amount) {
            await p.goto(front + '/pagos/nuevo/' + id);
            await p.locator('select').selectOption('Efectivo');
            await p.locator('input[type="number"]').fill(String(amount));
            await p.getByRole('button', { name: 'Confirmar Pago', exact: true }).click();
            await p.locator('.confirm-modal').waitFor();
            const response = p.waitForResponse(r => r.url() === api + '/api/PagoVenta' && r.request().method() === 'POST');
            await p.getByRole('button', { name: 'Confirmar', exact: true }).click();
            assert((await response).ok(), 'UI payment rejected');
            await p.waitForURL(front + '/ventas');
        }
        await payThroughUi(laterPartial.id, 20);
        assert((await request('Venta/' + laterPartial.id)).estado === 'PagoParcial', 'Subsequent payment is not canonical');
        const summary = await request('Venta/resumen');
        assert(summary.pendientes === 3 && summary.pagadas === 1, 'Sales summary mismatch');
        checks.push('UI → API: pago posterior, estado canónico y resumen');

        async function checkSalesFilters() {
            await p.goto(front + '/ventas');
            await p.locator('tbody tr').filter({ hasText: 'QA Vehiculo' }).waitFor();
            const state = p.locator('select').nth(0);
            for (const [filter, count, label] of [['PagoParcial', 2, 'Pago parcial'], ['Pendiente', 1, 'Pendiente'], ['Pagada', 1, 'Pagada']]) {
                await state.selectOption(filter);
                await p.waitForFunction(({ count, label }) => {
                    const badges = [...document.querySelectorAll('tbody .badge')];
                    return badges.length === count && badges.every(b => b.textContent.trim() === label);
                }, { count, label });
            }
            await state.selectOption('');
            assert(await p.locator('tbody .badge').count() === 4, 'All filter mismatch');
        }
        await checkSalesFilters();
        checks.push('UI: tabla y filtros PagoParcial/Pendiente/Pagada/Todos con API real');

        async function checkDashboard() {
            await p.goto(front + '/');
            const card = p.locator('.card').filter({ has: p.getByRole('heading', { name: 'Últimas ventas' }) });
            await card.locator('tbody .badge').filter({ hasText: 'Pago parcial' }).first().waitFor();
            assert(await card.locator('.badge.bg-warning').count() === 2, 'Dashboard partial colors mismatch');
            assert(await card.locator('.badge.bg-success').count() === 1, 'Dashboard paid color mismatch');
            assert(await card.locator('.badge.bg-secondary').count() === 1, 'Dashboard pending color mismatch');
        }
        await checkDashboard();
        checks.push('UI: dashboard con colores y etiquetas desde API real');

        // Historical compatibility is an explicitly adapted READ response, not
        // a database edit or a claim of end-to-end historical persistence.
        const historical = async route => {
            const response = await route.fetch();
            const body = await response.json();
            if (Array.isArray(body)) {
                const item = body.find(v => v.id === initialPartial.id);
                if (item) item.estado = 'Parcial';
            } else {
                const item = body.ultimasVentas?.find(v => v.ventaId === initialPartial.id);
                if (item) item.estado = 'Parcial';
            }
            await route.fulfill({ response, json: body });
        };
        await context.route(api + '/api/Venta', historical);
        await context.route(api + '/api/Dashboard', historical);
        await checkSalesFilters();
        await checkDashboard();
        await context.unroute(api + '/api/Venta', historical);
        await context.unroute(api + '/api/Dashboard', historical);
        assert((await request('Venta/' + initialPartial.id)).estado === 'PagoParcial', 'Presentation changed persisted state');
        checks.push('Compatibilidad Parcial: respuesta de lectura adaptada, persistencia intacta');

        await payThroughUi(laterPartial.id, 80);
        assert((await request('Venta/' + laterPartial.id)).estado === 'Pagada', 'Final payment did not close sale');
        const account = await request('CuentaCorriente/' + session.Clients[1].Id);
        const accounts = await request('CuentaCorriente');
        const dashboard = await request('Dashboard');
        assert(account.saldoActual === 0 && account.movimientos.length === 3, 'Individual account mismatch');
        assert(accounts.find(c => c.clienteId === session.Clients[1].Id).saldoActual === 0, 'Account summary mismatch');
        assert(dashboard.clientesConDeuda === 2, 'Debt counter mismatch');
        const finalSummary = await request('Venta/resumen');
        assert(finalSummary.pendientes === 2 && finalSummary.pagadas === 2, 'Final sales summary mismatch');
        checks.push('UI → API: transición a Pagada y conciliación de cuenta/resumen/deudores');
        assert(external.length === 0, 'Unexpected external request blocked');
        return { passed: checks.length, failed: 0, checks, externalRequests: external.length, database: isolation.DatabaseName };
    } finally {
        await context.close();
        delete page.__phase5bSession;
    }
}
