import { DEMO_CUSTOMERS } from '@/utils/demoData'
import { SHIPPING_COST, FREE_SHIPPING_FROM } from './cart'

const STORAGE_KEY = 'modauno-orders'
const STATUSES = ['Pagado', 'Enviado', 'Entregado']

const readOrders = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
  } catch (error) {
    return []
  }
}

const saveOrders = (orders) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
  } catch (error) {
    // Sin almacenamiento: las ventas duran mientras la pestaña esté abierta
  }
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const randomItem = (list) => list[Math.floor(Math.random() * list.length)]

const nextOrderId = (orders) => {
  const last = orders.reduce((max, order) => Math.max(max, Number(order.id.replace('MU-', ''))), 0)
  return `MU-${String(last + 1).padStart(4, '0')}`
}

// Simulación de ventas: no hay servidor, los pedidos viven en localStorage
export default {
  namespaced: true,
  state: () => ({ list: readOrders() }),
  mutations: {
    SET_LIST (state, list) { state.list = list }
  },
  actions: {
    // Convierte el carrito en un pedido. "simulateFailure" sirve para probar un pago rechazado.
    async placeOrder ({ commit, state, rootState, rootGetters, dispatch }, { customer, payment, simulateFailure = false, delay = 800 }) {
      await wait(delay)
      if (simulateFailure) throw new Error('El pago fue rechazado (simulación). Intenta con otro método.')

      const order = {
        id: nextOrderId(state.list),
        userEmail: rootState.auth.user.email,
        customer,
        payment,
        items: rootState.cart.items.map((item) => ({ ...item })),
        subtotal: rootGetters['cart/subtotal'],
        shipping: rootGetters['cart/shipping'],
        total: rootGetters['cart/total'],
        status: 'Pagado',
        createdAt: new Date().toISOString()
      }
      const list = [order, ...state.list]
      commit('SET_LIST', list)
      saveOrders(list)
      await dispatch('cart/clear', null, { root: true })
      return order
    },
    // Genera ventas ficticias con los productos del catálogo (solo para pruebas del panel)
    async seedDemoOrders ({ commit, state, rootState, dispatch }, amount = 10) {
      await dispatch('products/fetchProducts', false, { root: true })
      const products = rootState.products.items
      if (products.length === 0) return

      const generated = []
      for (let index = 0; index < amount; index += 1) {
        const customer = randomItem(DEMO_CUSTOMERS)
        const items = Array.from({ length: 1 + Math.floor(Math.random() * 3) }, () => {
          const product = randomItem(products)
          return { id: product.id, title: product.title, price: product.price, image: product.image, quantity: 1 + Math.floor(Math.random() * 2) }
        })
        const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)
        const shipping = subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_COST
        const date = new Date()
        date.setDate(date.getDate() - Math.floor(Math.random() * 30))
        generated.push({
          id: '',
          userEmail: 'demo@modauno.cl',
          customer: { name: customer.name, phone: '+56 9 0000 0000', address: 'Dirección de prueba 123', commune: customer.commune },
          payment: 'Tarjeta (simulada)',
          items,
          subtotal,
          shipping,
          total: subtotal + shipping,
          status: randomItem(STATUSES),
          createdAt: date.toISOString()
        })
      }
      // Asignamos los números de pedido en orden
      let list = [...state.list]
      generated.forEach((order) => {
        list = [{ ...order, id: nextOrderId(list) }, ...list]
      })
      commit('SET_LIST', list)
      saveOrders(list)
    },
    clearAll ({ commit }) {
      commit('SET_LIST', [])
      saveOrders([])
    }
  },
  getters: {
    myOrders: (state, getters, rootState) =>
      rootState.auth.user ? state.list.filter((order) => order.userEmail === rootState.auth.user.email) : [],
    orderById: (state) => (id) => state.list.find((order) => order.id === id),
    totalSales: (state) => state.list.reduce((total, order) => total + order.total, 0),
    averageTicket: (state, getters) => (state.list.length ? Math.round(getters.totalSales / state.list.length) : 0)
  }
}
