import { createStore } from 'vuex'
import products from './modules/products'
import filters from './modules/filters'
import favorites from './modules/favorites'
import auth from './modules/auth'
import cart from './modules/cart'
import orders from './modules/orders'

const store = createStore({
  modules: { products, filters, favorites, auth, cart, orders }
})

// Si ya había una sesión guardada, recuperamos sus favoritos
if (store.state.auth.user) {
  store.dispatch('favorites/load', store.state.auth.user.email)
}

export default store
