<template>
  <header>
    <v-app-bar flat border="b" height="68">
      <v-app-bar-nav-icon class="d-lg-none" aria-label="Abrir menú" @click="drawer = !drawer" />

      <router-link :to="{ name: 'home' }" class="logo-link" aria-label="ModaUno, ir al inicio">
        <AppLogo class="logo" />
      </router-link>

      <nav class="d-none d-lg-flex ml-6" aria-label="Menú principal">
        <v-btn :to="{ name: 'home' }" exact variant="text">Inicio</v-btn>
        <v-btn :to="{ name: 'catalog' }" exact variant="text">Catálogo</v-btn>
        <v-btn
          v-for="section in sections"
          :key="section.slug"
          :to="{ name: 'catalog', params: { category: section.slug } }"
          variant="text"
        >
          {{ section.label }}
        </v-btn>
      </nav>

      <v-spacer />

      <v-btn
        :icon="isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'"
        :aria-label="isDark ? 'Activar tema claro' : 'Activar tema oscuro'"
        @click="toggleTheme"
      />

      <v-btn icon aria-label="Abrir carrito" data-test="cart-btn" @click="OPEN_DRAWER">
        <v-badge :content="cartCount" :model-value="cartCount > 0" color="primary">
          <v-icon>mdi-cart-outline</v-icon>
        </v-badge>
      </v-btn>

      <template v-if="isLoggedIn">
        <v-btn :to="{ name: 'favorites' }" icon aria-label="Ver mis favoritos">
          <v-badge :content="count" :model-value="count > 0" color="primary">
            <v-icon>mdi-heart-outline</v-icon>
          </v-badge>
        </v-btn>

        <v-menu>
          <template #activator="{ props }">
            <v-btn v-bind="props" icon aria-label="Mi cuenta" data-test="user-menu">
              <v-avatar color="primary" size="34">{{ initial }}</v-avatar>
            </v-btn>
          </template>
          <v-list min-width="220">
            <v-list-item :title="user.name" :subtitle="user.email" />
            <v-divider />
            <v-list-item :to="{ name: 'favorites' }" prepend-icon="mdi-heart-outline" title="Mis favoritos" />
            <v-list-item :to="{ name: 'orders' }" prepend-icon="mdi-package-variant-closed" title="Mis compras" />
            <v-list-item v-if="isAdmin" :to="{ name: 'admin-sales' }" prepend-icon="mdi-chart-line" title="Panel de ventas" />
            <v-list-item prepend-icon="mdi-logout" title="Cerrar sesión" data-test="logout-btn" @click="onLogout" />
          </v-list>
        </v-menu>
      </template>

      <template v-else>
        <v-btn
          class="d-sm-none"
          icon="mdi-account-outline"
          data-test="login-btn-mobile"
          aria-label="Ingresar o crear cuenta"
          @click="OPEN_DIALOG('register')"
        />
        <v-btn
          class="d-none d-sm-flex ml-2"
          variant="outlined"
          prepend-icon="mdi-account-outline"
          data-test="login-btn"
          @click="OPEN_DIALOG('register')"
        >
          Ingresar
        </v-btn>
      </template>
    </v-app-bar>

    <!-- Menú hamburguesa para pantallas pequeñas -->
    <v-navigation-drawer v-model="drawer" temporary>
      <v-list nav>
        <v-list-item :to="{ name: 'home' }" exact prepend-icon="mdi-home-outline" title="Inicio" />
        <v-list-item :to="{ name: 'catalog' }" exact prepend-icon="mdi-view-grid-outline" title="Catálogo" />
        <v-list-item
          v-for="section in sections"
          :key="section.slug"
          :to="{ name: 'catalog', params: { category: section.slug } }"
          :prepend-icon="section.icon"
          :title="section.label"
        />
        <v-divider class="my-2" />
        <template v-if="isLoggedIn">
          <v-list-item :to="{ name: 'favorites' }" prepend-icon="mdi-heart-outline" title="Mis favoritos" />
            <v-list-item :to="{ name: 'orders' }" prepend-icon="mdi-package-variant-closed" title="Mis compras" />
            <v-list-item v-if="isAdmin" :to="{ name: 'admin-sales' }" prepend-icon="mdi-chart-line" title="Panel de ventas" />
          <v-list-item prepend-icon="mdi-logout" title="Cerrar sesión" @click="onLogout" />
        </template>
        <v-list-item v-else prepend-icon="mdi-account-outline" title="Ingresar o crear cuenta" @click="openFromDrawer" />
      </v-list>
    </v-navigation-drawer>
  </header>
</template>

<script>
import { computed } from 'vue'
import { useTheme } from 'vuetify'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import AppLogo from '@/components/AppLogo.vue'
import { SECTIONS } from '@/utils/categories'
import { saveTheme } from '@/plugins/vuetify'

export default {
  name: 'AppHeader',
  components: { AppLogo },
  setup () {
    const theme = useTheme()
    const isDark = computed(() => theme.global.name.value === 'dark')

    const toggleTheme = () => {
      const next = isDark.value ? 'light' : 'dark'
      theme.global.name.value = next
      saveTheme(next)
    }

    return { isDark, toggleTheme }
  },
  data () {
    return {
      drawer: false,
      sections: SECTIONS
    }
  },
  computed: {
    ...mapState('auth', ['user']),
    ...mapGetters('auth', ['isLoggedIn', 'isAdmin', 'initial']),
    ...mapGetters('cart', { cartCount: 'count' }),
    ...mapGetters('favorites', ['count'])
  },
  methods: {
    ...mapMutations('auth', ['OPEN_DIALOG']),
    ...mapMutations('cart', ['OPEN_DRAWER']),
    ...mapActions('auth', ['logout']),
    openFromDrawer () {
      this.drawer = false
      this.OPEN_DIALOG('register')
    },
    async onLogout () {
      this.drawer = false
      await this.logout()
      // Si estaba en una página privada, lo llevamos al inicio
      if (this.$route.meta.requiresAuth) this.$router.push({ name: 'home' })
    }
  }
}
</script>

<style scoped>
.logo-link {
  display: flex;
  align-items: center;
  margin-left: 8px;
  color: inherit;
}

.logo {
  width: 136px;
  height: 40px;
}
</style>
