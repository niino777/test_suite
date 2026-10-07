// Cada usuario tiene su propia lista de favoritos
const keyFor = (email) => `modauno-favorites-${email}`

const readIds = (email) => {
  try {
    return JSON.parse(localStorage.getItem(keyFor(email))) || []
  } catch (error) {
    return []
  }
}

const writeIds = (email, ids) => {
  try {
    localStorage.setItem(keyFor(email), JSON.stringify(ids))
  } catch (error) {
    // Si no se puede guardar, los favoritos funcionan mientras la pestaña esté abierta
  }
}

export default {
  namespaced: true,
  state: () => ({ ids: [] }),
  mutations: {
    SET_IDS (state, ids) { state.ids = ids }
  },
  actions: {
    load ({ commit }, email) {
      commit('SET_IDS', email ? readIds(email) : [])
    },
    // Sin sesión no se puede guardar: en su lugar abrimos el modal de registro
    toggle ({ commit, state, rootGetters, rootState }, id) {
      if (!rootGetters['auth/isLoggedIn']) {
        commit('auth/OPEN_DIALOG', 'register', { root: true })
        return
      }
      const ids = state.ids.includes(id)
        ? state.ids.filter((savedId) => savedId !== id)
        : [...state.ids, id]
      commit('SET_IDS', ids)
      writeIds(rootState.auth.user.email, ids)
    }
  },
  getters: {
    isFavorite: (state) => (id) => state.ids.includes(id),
    count: (state) => state.ids.length,
    favoriteProducts: (state, getters, rootState) =>
      rootState.products.items.filter((product) => state.ids.includes(product.id))
  }
}
