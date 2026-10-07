import { getProducts } from '@/services/productService'

export default {
  namespaced: true,
  state: () => ({
    items: [],
    loading: false,
    error: null
  }),
  mutations: {
    SET_LOADING (state, value) { state.loading = value },
    SET_ERROR (state, message) { state.error = message },
    SET_ITEMS (state, items) { state.items = items }
  },
  actions: {
    // Si ya hay productos no vuelve a pedirlos, salvo que se use "force" (botón Reintentar)
    async fetchProducts ({ commit, state }, force = false) {
      if (state.items.length > 0 && !force) return
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      try {
        commit('SET_ITEMS', await getProducts())
      } catch (error) {
        commit('SET_ERROR', 'No pudimos cargar los productos. Revisa tu conexión e inténtalo nuevamente.')
      } finally {
        commit('SET_LOADING', false)
      }
    }
  },
  getters: {
    productById: (state) => (id) => state.items.find((product) => product.id === Number(id)),
    // Aplica categoría, búsqueda y orden definidos en el módulo "filters"
    filteredProducts (state, getters, rootState) {
      const { category, type, search, sort } = rootState.filters
      const text = search.trim().toLowerCase()
      const result = state.items.filter((product) => {
        const matchesCategory = category === 'all' || product.section === category
        const matchesType = type === 'all' || product.type === type
        return matchesCategory && matchesType && product.title.toLowerCase().includes(text)
      })
      if (sort === 'price-asc') return [...result].sort((a, b) => a.price - b.price)
      if (sort === 'price-desc') return [...result].sort((a, b) => b.price - a.price)
      return result
    },
    // Tipos de prenda disponibles en la categoría elegida (para las subrutas)
    availableTypes (state, getters, rootState) {
      const types = new Map()
      state.items
        .filter((product) => product.section === rootState.filters.category)
        .forEach((product) => types.set(product.type, product.typeLabel))
      return [...types].map(([slug, label]) => ({ slug, label }))
    }
  }
}
