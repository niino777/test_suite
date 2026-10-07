import { hashText } from '@/utils/hash'
import { DEMO_USERS } from '@/utils/demoData'

const USERS_KEY = 'modauno-users'
const SESSION_KEY = 'modauno-session'

const read = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback
  } catch (error) {
    return fallback
  }
}

const write = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    // Sin almacenamiento: la sesión dura solo mientras la pestaña esté abierta
  }
}

// Simulación de registro: no hay servidor, los usuarios viven en localStorage
export default {
  namespaced: true,
  state: () => ({
    user: read(SESSION_KEY, null),
    dialog: false,
    tab: 'register'
  }),
  getters: {
    isLoggedIn: (state) => state.user !== null,
    isAdmin: (state) => state.user !== null && state.user.role === 'admin',
    initial: (state) => (state.user ? state.user.name.charAt(0).toUpperCase() : '')
  },
  mutations: {
    SET_USER (state, user) { state.user = user },
    OPEN_DIALOG (state, tab = 'register') {
      state.tab = tab
      state.dialog = true
    },
    CLOSE_DIALOG (state) { state.dialog = false },
    SET_TAB (state, tab) { state.tab = tab }
  },
  actions: {
    async startSession ({ commit, dispatch }, user) {
      commit('SET_USER', user)
      write(SESSION_KEY, user)
      await dispatch('favorites/load', user.email, { root: true })
      commit('CLOSE_DIALOG')
    },
    // Crea las cuentas de prueba la primera vez que se necesitan
    async seedDemoUsers () {
      const users = read(USERS_KEY, [])
      const missing = DEMO_USERS.filter((demo) => !users.some((user) => user.email === demo.email))
      for (const demo of missing) {
        users.push({ name: demo.name, email: demo.email, role: demo.role, passwordHash: await hashText(demo.password) })
      }
      if (missing.length > 0) write(USERS_KEY, users)
    },
    async register ({ dispatch }, { name, email, password }) {
      await dispatch('seedDemoUsers')
      const users = read(USERS_KEY, [])
      const cleanEmail = email.trim().toLowerCase()
      if (users.some((user) => user.email === cleanEmail)) {
        throw new Error('Este correo ya está registrado. Prueba ingresando.')
      }
      users.push({ name: name.trim(), email: cleanEmail, role: 'customer', passwordHash: await hashText(password) })
      write(USERS_KEY, users)
      await dispatch('startSession', { name: name.trim(), email: cleanEmail, role: 'customer' })
    },
    async login ({ dispatch }, { email, password }) {
      await dispatch('seedDemoUsers')
      const cleanEmail = email.trim().toLowerCase()
      const found = read(USERS_KEY, []).find((user) => user.email === cleanEmail)
      if (!found || found.passwordHash !== await hashText(password)) {
        throw new Error('Correo o contraseña incorrectos.')
      }
      await dispatch('startSession', { name: found.name, email: found.email, role: found.role || 'customer' })
    },
    async logout ({ commit, dispatch }) {
      commit('SET_USER', null)
      try {
        localStorage.removeItem(SESSION_KEY)
      } catch (error) {
        // Nada que limpiar si el navegador bloquea el almacenamiento
      }
      await dispatch('favorites/load', null, { root: true })
    }
  }
}
