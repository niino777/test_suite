import store from '@/store'

const polera = { id: 1, title: 'Camiseta básica negra', price: 9990, image: 'img/a.svg' }
const customer = { name: 'Cliente Demo', phone: '+56 9 1111 1111', address: 'Calle 123', commune: 'Santiago' }

describe('pedidos (ventas simuladas)', () => {
  beforeEach(async () => {
    store.commit('auth/SET_USER', { name: 'Cliente Demo', email: 'cliente@modauno.cl', role: 'customer' })
    await store.dispatch('orders/clearAll')
    await store.dispatch('cart/clear')
    await store.dispatch('cart/addItem', { product: polera, quantity: 2 })
  })

  it('crea un pedido pagado y vacía el carrito', async () => {
    const order = await store.dispatch('orders/placeOrder', { customer, payment: 'Tarjeta (simulada)', delay: 0 })

    expect(order.id).toBe('MU-0001')
    expect(order.status).toBe('Pagado')
    expect(order.total).toBe(2 * 9990 + 3990)
    expect(store.state.cart.items).toHaveLength(0)
    expect(store.getters['orders/myOrders']).toHaveLength(1)
  })

  it('rechaza el pago cuando se simula una falla y conserva el carrito', async () => {
    await expect(
      store.dispatch('orders/placeOrder', { customer, payment: 'Tarjeta (simulada)', simulateFailure: true, delay: 0 })
    ).rejects.toThrow('rechazado')

    expect(store.state.orders.list).toHaveLength(0)
    expect(store.getters['cart/count']).toBe(2)
  })

  it('numera los pedidos en orden y suma las ventas totales', async () => {
    await store.dispatch('orders/placeOrder', { customer, payment: 'Tarjeta (simulada)', delay: 0 })
    await store.dispatch('cart/addItem', { product: polera })
    const second = await store.dispatch('orders/placeOrder', { customer, payment: 'Tarjeta (simulada)', delay: 0 })

    expect(second.id).toBe('MU-0002')
    expect(store.getters['orders/totalSales']).toBe(23970 + 13980)
  })
})
