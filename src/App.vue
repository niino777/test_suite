<template>
  <v-app>
    <AppHeader />
    <v-main>
      <router-view />
    </v-main>
    <AppFooter />
    <CartDrawer />
    <AuthDialog />

    <v-snackbar v-model="showNotice" :timeout="2500" data-test="cart-notice">
      {{ notice }}
      <template #actions>
        <v-btn variant="text" @click="openCart">Ver carrito</v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import AuthDialog from '@/components/AuthDialog.vue'
import CartDrawer from '@/components/CartDrawer.vue'

export default {
  name: 'App',
  components: { AppHeader, AppFooter, AuthDialog, CartDrawer },
  computed: {
    ...mapState('cart', ['notice']),
    showNotice: {
      get () {
        return this.notice !== ''
      },
      set (value) {
        if (!value) this.SET_NOTICE('')
      }
    }
  },
  methods: {
    ...mapMutations('cart', ['SET_NOTICE', 'OPEN_DRAWER']),
    openCart () {
      this.SET_NOTICE('')
      this.OPEN_DRAWER()
    }
  }
}
</script>
