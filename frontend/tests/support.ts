import { vi } from 'vitest'
import { mount, flushPromises, RouterLinkStub, type VueWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import type { Venta } from '../src/types/venta'
import type { Financiacion } from '../src/types/financiacion'
import type { Producto } from '../src/types/producto'
import type { Vehiculo } from '../src/types/vehiculo'

const mocks = vi.hoisted(() => ({
  saleList: vi.fn(), saleGet: vi.fn(), saleCreate: vi.fn(), saleSummary: vi.fn(),
  financingList: vi.fn(), financingGet: vi.fn(), financingCreate: vi.fn(), financingSummary: vi.fn(),
  quotaByFinancing: vi.fn(), quotaGet: vi.fn(), cuotaPaymentCreate: vi.fn(),
  paymentCreate: vi.fn(), paymentList: vi.fn(), paymentGet: vi.fn(),
  products: vi.fn(), vehicles: vi.fn(), clients: vi.fn(), plans: vi.fn(), push: vi.fn(),
}))

const route = vi.hoisted(() => ({ id: '40' }))

export { mocks, route }

vi.mock('../src/services/api', () => ({ default: new Proxy({}, {
  get: () => () => { throw new Error('Unmocked HTTP service: network forbidden in tests') },
}) }))
vi.mock('../src/services/ventaService', () => ({ default: {
  obtenerTodos: mocks.saleList, obtenerPorId: mocks.saleGet, crear: mocks.saleCreate, obtenerResumen: mocks.saleSummary,
} }))
vi.mock('../src/services/financiacionService', () => ({ default: {
  obtenerTodos: mocks.financingList, obtenerPorId: mocks.financingGet, crear: mocks.financingCreate, obtenerResumen: mocks.financingSummary,
} }))
vi.mock('../src/services/cuotaService', () => ({ default: {
  obtenerPorFinanciacion: mocks.quotaByFinancing, obtenerPorId: mocks.quotaGet,
} }))
vi.mock('../src/services/pagoCuotaService', () => ({ default: {
  crear: mocks.cuotaPaymentCreate,
} }))
vi.mock('../src/services/pagoVentaService', () => ({ default: {
  crear: mocks.paymentCreate, obtenerTodos: mocks.paymentList, obtenerPorId: mocks.paymentGet,
} }))
vi.mock('../src/services/productoService', () => ({ default: { obtenerTodos: mocks.products } }))
vi.mock('../src/services/vehiculoService', () => ({ default: { obtenerTodos: mocks.vehicles } }))
vi.mock('../src/services/clienteService', () => ({ default: { obtenerTodos: mocks.clients } }))
vi.mock('../src/services/configuracionFinanciacionService', () => ({ default: { obtenerActivas: mocks.plans } }))
vi.mock('vue-router', async (original) => ({
  ...await original<typeof import('vue-router')>(),
  useRouter: () => ({ push: mocks.push }),
  useRoute: () => ({ params: route }),
}))

import VentaForm from '../src/components/venta/VentaForm.vue'
import SelectInput from '../src/components/forms/SelectInput.vue'

export function sale(overrides: Partial<Venta> = {}): Venta {
  return {
    id: 40, fecha: '2026-01-01T12:00:00', clienteId: 1, nombreCliente: 'Synthetic client', usuarioId: 1, nombreUsuario: 'Testing',
    subtotal: 1000, total: 1000, estado: 'Pendiente', vehiculoId: 20, nombreVehiculo: 'Synthetic vehicle', precioVehiculo: 1000,
    tieneVehiculo: true, tieneFinanciacion: false, estaPagada: false, saldoPendiente: 1000, financiacionId: null,
    detalles: [{ id: 1, productoId: null, nombreProducto: null, vehiculoId: 20, nombreVehiculo: 'Synthetic vehicle', cantidad: 1, precioUnitario: 1000, subtotal: 1000 }],
    pagos: [], financiacion: null, ...overrides,
  }
}
export function financing(id = 50): Financiacion {
  return { id, ventaId: 40, nombreCliente: `Synthetic client ${id}`, nombreVehiculo: 'Testing', cantidadCuotas: 3,
    montoFinanciado: 1000, coeficienteAplicado: 1.1, montoTotal: 1100, estado: 'Activa', fechaCreacion: `2026-01-${id === 50 ? '01' : '02'}T12:00:00` }
}
export function quota(financiacionId = 50) {
  return { id: 70, financiacionId, ventaId: 40, clienteId: 1, nombreCliente: 'Synthetic client', numero: 1,
    fechaVencimiento: '2026-02-01T12:00:00', monto: 1100, estado: 'Pendiente' }
}
export const product: Producto = { id: 10, nombre: 'Synthetic helmet', descripcion: '', sku: 'TEST-10', precioCompra: 50,
  precioVenta: 100, stock: 10, categoriaId: 1, subCategoriaId: 1, marcaProductoId: 1, nombreMarcaProducto: 'Testing', nombreSubCategoria: 'Testing', modelo: 'Testing' }
const vehicle: Vehiculo = { id: 20, modeloId: 1, modelo: 'Testing', marcaVehiculoId: 1, marca: 'Testing', anio: 2026, vin: 'SYNTHETIC',
  numeroMotor: 'SYNTHETIC', kilometraje: 0, patente: 'TEST', color: 'Testing', precioCompra: 500, precioVenta: 1000, estado: 'Disponible' }

export function resetHarness() {
  Object.values(mocks).forEach(mock => mock.mockReset())
  setActivePinia(createPinia())
  route.id = '40'
  mocks.saleList.mockResolvedValue([sale()])
  mocks.saleGet.mockResolvedValue(sale())
  mocks.saleCreate.mockResolvedValue(sale({ id: 41 }))
  mocks.saleSummary.mockResolvedValue({ ventasDelMes: 1, montoVendidoMes: 1000, pendientes: 1, pagadas: 0 })
  mocks.financingList.mockResolvedValue([financing()])
  mocks.financingCreate.mockResolvedValue(financing())
  mocks.financingSummary.mockResolvedValue({ activas: 1, canceladas: 0, totalFinanciado: 1000, saldoPendiente: 1100 })
  mocks.quotaByFinancing.mockResolvedValue([quota(40)])
  mocks.quotaGet.mockResolvedValue(quota())
  mocks.cuotaPaymentCreate.mockResolvedValue({ id: 80, cuotaId: 70, monto: 1100, formaPago: 'Efectivo', fecha: '2026-01-01T12:00:00' })
  mocks.paymentCreate.mockResolvedValue({ id: 60, ventaId: 40, formaPago: 'Efectivo', monto: 1000, fecha: '2026-01-01T12:00:00' })
  mocks.paymentList.mockResolvedValue([])
  mocks.paymentGet.mockResolvedValue(undefined)
  mocks.products.mockResolvedValue([product])
  mocks.vehicles.mockResolvedValue([vehicle])
  mocks.clients.mockResolvedValue([{ id: 1, nombre: 'Synthetic client' }])
  mocks.plans.mockResolvedValue([{ id: 30, activa: true, cantidadCuotas: 3, tasaInteres: 10, montoMinimo: 0, montoMaximo: 10000000 }])
}

export function render(component: Parameters<typeof mount>[0], props = {}) {
  return mount(component, { props, global: { stubs: { RouterLink: RouterLinkStub } } })
}
export async function choose(wrapper: VueWrapper, label: string, value: string) {
  const field = wrapper.findAllComponents(SelectInput).find(item => item.props('label') === label)
  if (!field) throw new Error(`Missing field ${label}`)
  await field.get('select').setValue(value)
}
export async function click(wrapper: VueWrapper, text: string) {
  const button = wrapper.findAll('button').find(item => item.text() === text)
  if (!button) throw new Error(`Missing button ${text}`)
  await button.trigger('click')
  await flushPromises()
}
export async function readySale() {
  const wrapper = render(VentaForm)
  await flushPromises()
  await choose(wrapper, 'Cliente', '1')
  return wrapper
}
export async function duplicateProducts(wrapper: VueWrapper, first: number, second: number) {
  await choose(wrapper, 'Producto', '10')
  await wrapper.get('input[type="number"]').setValue(first)
  await click(wrapper, 'Agregar Producto')
  await choose(wrapper, 'Producto', '10')
  await wrapper.get('input[type="number"]').setValue(second)
  await click(wrapper, 'Agregar Producto')
}
export async function confirmFinancing(wrapper: VueWrapper) {
  await choose(wrapper, 'Plan de financiación', '30')
  await click(wrapper, 'Confirmar financiación')
  await click(wrapper, 'Confirmar')
}
