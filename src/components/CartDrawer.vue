<template>
  <v-navigation-drawer v-model="isOpen" location="right" temporary width="380">
    <div class="d-flex align-center pa-4">
      <h2 class="text-h6 font-weight-bold">Tu carrito ({{ count }})</h2>
      <v-spacer />
      <v-btn icon="mdi-close" variant="text" aria-label="Cerrar carrito" @click="CLOSE_DRAWER" />
    </div>
    <v-divider />

    <div v-if="items.length === 0" class="pa-6 text-center">
      <v-icon size="48" class="mb-2">mdi-cart-outline</v-icon>
      <p class="mb-4">Tu carrito está vacío.</p>
      <v-btn :to="{ name: 'catalog' }" color="primary" @click="CLOSE_DRAWER">Ver catálogo</v-btn>
    </div>

    <ul v-else class="cart-list">
      <li v-for="item in items" :key="item.id" class="cart-item" data-test="cart-item">
        <img :src="item.image" :alt="item.title" width="64" height="64">
        <div class="cart-item__info">
          <p class="text-body-2 font-weight-medium">{{ item.title }}</p>
          <p class="text-caption text-medium-emphasis">{{ money(item.price) }}</p>
          <div class="d-flex align-center mt-1">
            <v-btn
              icon="mdi-minus"
              size="x-small"
              variant="outlined"
              aria-label="Quitar una unidad"
              @click="changeQuantity({ id: item.id, quantity: item.quantity - 1 })"
            />
            <span class="mx-3" data-test="cart-qty">{{ item.quantity }}</span>
            <v-btn
              icon="mdi-plus"
              size="x-small"
              variant="outlined"
              aria-label="Agregar una unidad"
              @click="changeQuantity({ id: item.id, quantity: item.quantity + 1 })"
            />
          </div>
        </div>
        <div class="text-right">
          <p class="text-body-2 font-weight-bold">{{ money(item.price * item.quantity) }}</p>
          <v-btn
            icon="mdi-delete-outline"
            size="small"
            variant="text"
            aria-label="Eliminar producto"
            @click="removeItem(item.id)"
          />
        </div>
      </li>
    </ul>

    <template v-if="items.length > 0" #append>
      <v-divider />
      <div class="pa-4">
        <div class="d-flex justify-space-between text-body-2 mb-1">
          <span>Subtotal</span><span>{{ money(subtotal) }}</span>
        </div>
        <div class="d-flex justify-space-between text-body-2 mb-1">
          <span>Envío</span><span>{{ shipping === 0 ? 'Gratis' : money(shipping) }}</span>
        </div>
        <p v-if="shipping > 0" class="text-caption text-medium-emphasis mb-1">
          Envío gratis desde {{ money(freeFrom) }}
        </p>
        <div class="d-flex justify-space-between text-h6 font-weight-bold my-2">
          <span>Total</span><span data-test="cart-total">{{ money(total) }}</span>
        </div>
        <v-btn color="primary" size="large" block data-test="checkout-btn" @click="goCheckout">
          Ir a pagar
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import { formatPrice } from '@/utils/format'
import { FREE_SHIPPING_FROM } from '@/store/modules/cart'

export default {
  name: 'CartDrawer',
  data () {
    return { freeFrom: FREE_SHIPPING_FROM }
  },
  computed: {
    ...mapState('cart', ['items', 'drawer']),
    ...mapGetters('cart', ['count', 'subtotal', 'shipping', 'total']),
    ...mapGetters('auth', ['isLoggedIn']),
    isOpen: {
      get () {
        return this.drawer
      },
      set (value) {
        if (!value) this.CLOSE_DRAWER()
      }
    }
  },
  methods: {
    ...mapMutations('cart', ['CLOSE_DRAWER']),
    ...mapMutations('auth', ['OPEN_DIALOG']),
    ...mapActions('cart', ['changeQuantity', 'removeItem']),
    money: formatPrice,
    // Para pagar hay que tener sesión: si no la hay, abrimos el modal de ingreso
    goCheckout () {
      this.CLOSE_DRAWER()
      if (!this.isLoggedIn) {
        this.OPEN_DIALOG('login')
        return
      }
      this.$router.push({ name: 'checkout' })
    }
  }
}
</script>

<style scoped>
.cart-list {
  list-style: none;
  padding: 0;
}

.cart-item {
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(128, 128, 128, 0.25);
}

.cart-item img {
  object-fit: cover;
  border-radius: 8px;
}

.cart-item__info {
  flex: 1;
}
</style>
