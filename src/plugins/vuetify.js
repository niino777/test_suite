import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const THEME_KEY = 'modauno-theme'

// Recupera el tema guardado (si el navegador bloquea localStorage, usa "light")
function getSavedTheme () {
  try {
    return localStorage.getItem(THEME_KEY) || 'light'
  } catch (error) {
    return 'light'
  }
}

export const saveTheme = (name) => {
  try {
    localStorage.setItem(THEME_KEY, name)
  } catch (error) {
    // Sin persistencia: el tema sigue funcionando durante la sesión
  }
}

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: getSavedTheme(),
    themes: {
      light: {
        colors: { primary: '#111111', secondary: '#6B6B6B', background: '#FAFAFA', surface: '#FFFFFF' }
      },
      dark: {
        dark: true,
        colors: { primary: '#F5F5F5', secondary: '#A0A0A0', background: '#111111', surface: '#1A1A1A' }
      }
    }
  }
})
