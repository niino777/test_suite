const STORAGE_KEY = 'modauno-cart'
const MAX_PER_PRODUCT = 10
export const FREE_SHIPPING_FROM = 50000
export const SHIPPING_COST = 3990

const readItems = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
  } catch (error) {
    return []
  }
}

const saveItems = (items) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch (error) {
    // Sin almacenamiento: el carrito funciona mientras la pestaña esté abierta
  }
}

export default {
  namespaced: true,
  state: () => ({
    items: readItems(), // [{ id, title, price, image, quantity }]
    drawer: false,
    notice: ''
  }),
  mutations: {
    SET_ITEMS (state, items) { state.items = items },
    OPEN_DRAWER (state) { state.drawer = true },
    CLOSE_DRAWER (state) { state.drawer = false },
    SET_NOTICE (state, message) { state.notice = message }
  },
  actions: {
    addItem ({ commit, state }, { product, quantity = 1 }) {
      const existing = state.items.find((item) => item.id === product.id)
      const items = existing
        ? state.items.map((item) =>
          item.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, MAX_PER_PRODUCT) }
            : item)
        : [...state.items, {
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          quantity: Math.min(quantity, MAX_PER_PRODUCT)
        }]
      commit('SET_ITEMS', items)
      saveItems(items)
      commit('SET_NOTICE', `"${product.title}" se agregó al carrito`)
    },
    changeQuantity ({ commit, state }, { id, quantity }) {
      const items = state.items
        .map((item) => (item.id === id ? { ...item, quantity: Math.min(quantity, MAX_PER_PRODUCT) } : item))
        .filter((item) => item.quantity > 0)
      commit('SET_ITEMS', items)
      saveItems(items)
    },
    removeItem ({ commit, state }, id) {
      const items = state.items.filter((item) => item.id !== id)
      commit('SET_ITEMS', items)
      saveItems(items)
    },
    clear ({ commit }) {
      commit('SET_ITEMS', [])
      saveItems([])
    }
  },
  getters: {
    count: (state) => state.items.reduce((total, item) => total + item.quantity, 0),
    subtotal: (state) => state.items.reduce((total, item) => total + item.price * item.quantity, 0),
    // Envío gratis desde $50.000
    shipping: (state, getters) =>
      getters.subtotal === 0 || getters.subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_COST,
    total: (state, getters) => getters.subtotal + getters.shipping
  }
}
