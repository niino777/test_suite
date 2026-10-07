import store from '@/store'

const polera = { id: 1, title: 'Camiseta básica negra', price: 9990, image: 'img/a.svg' }
const botas = { id: 2, title: 'Botas de cuero café', price: 59990, image: 'img/b.svg' }

describe('carrito', () => {
  beforeEach(async () => {
    await store.dispatch('cart/clear')
  })

  it('suma las unidades de un mismo producto', async () => {
    await store.dispatch('cart/addItem', { product: polera })
    await store.dispatch('cart/addItem', { product: polera, quantity: 2 })

    expect(store.state.cart.items).toHaveLength(1)
    expect(store.getters['cart/count']).toBe(3)
  })

  it('calcula subtotal, envío y total', async () => {
    await store.dispatch('cart/addItem', { product: polera })
    expect(store.getters['cart/subtotal']).toBe(9990)
    expect(store.getters['cart/shipping']).toBe(3990)
    expect(store.getters['cart/total']).toBe(13980)

    // Sobre $50.000 el envío es gratis
    await store.dispatch('cart/addItem', { product: botas })
    expect(store.getters['cart/shipping']).toBe(0)
  })

  it('cambia cantidades y elimina el producto al llegar a cero', async () => {
    await store.dispatch('cart/addItem', { product: polera })
    await store.dispatch('cart/changeQuantity', { id: 1, quantity: 4 })
    expect(store.getters['cart/count']).toBe(4)

    await store.dispatch('cart/changeQuantity', { id: 1, quantity: 0 })
    expect(store.state.cart.items).toHaveLength(0)
  })
})
