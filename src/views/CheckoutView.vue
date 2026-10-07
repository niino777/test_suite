<template>
  <v-container class="py-6">
    <h1 class="text-h4 font-weight-bold mb-4">Finalizar compra</h1>

    <v-alert v-if="items.length === 0" type="info" variant="tonal">
      Tu carrito está vacío.
      <router-link :to="{ name: 'catalog' }">Ir al catálogo</router-link>
    </v-alert>

    <v-row v-else>
      <v-col cols="12" md="7">
        <v-form ref="form" @submit.prevent="pay">
          <h2 class="text-h6 mb-3">Datos de entrega</h2>
          <v-text-field v-model="name" label="Nombre completo" :rules="required" variant="outlined" data-test="checkout-name" />
          <v-text-field v-model="phone" label="Teléfono" :rules="required" variant="outlined" data-test="checkout-phone" />
          <v-text-field v-model="address" label="Dirección" :rules="required" variant="outlined" data-test="checkout-address" />
          <v-text-field v-model="commune" label="Comuna" :rules="required" variant="outlined" data-test="checkout-commune" />

          <h2 class="text-h6 mb-2">Método de pago</h2>
          <v-radio-group v-model="payment">
            <v-radio v-for="option in paymentOptions" :key="option" :label="option" :value="option" />
          </v-radio-group>

          <v-checkbox v-model="simulateFailure" label="Simular pago rechazado (solo pruebas)" hide-details />

          <v-alert v-if="error" type="error" variant="tonal" class="my-4" data-test="payment-error">{{ error }}</v-alert>

          <v-btn type="submit" color="primary" size="large" block class="mt-4" :loading="loading" data-test="pay-btn">
            Pagar {{ money(total) }}
          </v-btn>
          <p class="text-caption text-medium-emphasis mt-2">
            Pago simulado: no se piden datos de tarjeta ni se realiza ningún cobro.
          </p>
        </v-form>
      </v-col>

      <v-col cols="12" md="5">
        <v-card variant="outlined" rounded="lg" class="pa-4">
          <h2 class="text-h6 mb-3">Resumen</h2>
          <OrderSummary :order="summary" />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import OrderSummary from '@/components/OrderSummary.vue'
import { formatPrice } from '@/utils/format'

export default {
  name: 'CheckoutView',
  components: { OrderSummary },
  data () {
    return {
      name: this.$store.state.auth.user ? this.$store.state.auth.user.name : '',
      phone: '',
      address: '',
      commune: '',
      payment: 'Tarjeta (simulada)',
      paymentOptions: ['Tarjeta (simulada)', 'Transferencia (simulada)', 'Pago contra entrega (simulado)'],
      simulateFailure: false,
      loading: false,
      error: '',
      required: [(value) => Boolean(value && value.trim()) || 'Campo obligatorio']
    }
  },
  computed: {
    ...mapState('cart', ['items']),
    ...mapGetters('cart', ['subtotal', 'shipping', 'total']),
    // Mismo formato que un pedido, para reutilizar OrderSummary
    summary () {
      return { items: this.items, subtotal: this.subtotal, shipping: this.shipping, total: this.total }
    }
  },
  methods: {
    ...mapActions('orders', ['placeOrder']),
    money: formatPrice,
    async pay () {
      const { valid } = await this.$refs.form.validate()
      if (!valid) return

      this.loading = true
      this.error = ''
      try {
        const order = await this.placeOrder({
          customer: { name: this.name, phone: this.phone, address: this.address, commune: this.commune },
          payment: this.payment,
          simulateFailure: this.simulateFailure
        })
        this.$router.push({ name: 'order', params: { id: order.id } })
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
