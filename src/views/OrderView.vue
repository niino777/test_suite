<template>
  <v-container class="py-6">
    <v-alert v-if="!order || !canSee" type="warning" variant="tonal">
      No encontramos este pedido.
      <router-link :to="{ name: 'catalog' }">Ir al catálogo</router-link>
    </v-alert>

    <template v-else>
      <div class="text-center mb-6">
        <v-icon size="56" color="success">mdi-check-circle-outline</v-icon>
        <h1 class="text-h4 font-weight-bold mt-2" data-test="order-title">Pedido {{ order.id }}</h1>
        <p class="text-body-1">¡Gracias por tu compra, {{ order.customer.name }}!</p>
        <v-chip class="mt-2" color="success" variant="tonal" data-test="order-status">{{ order.status }}</v-chip>
      </div>

      <v-row>
        <v-col cols="12" md="7">
          <v-card variant="outlined" rounded="lg" class="pa-4">
            <h2 class="text-h6 mb-3">Productos</h2>
            <OrderSummary :order="order" />
          </v-card>
        </v-col>
        <v-col cols="12" md="5">
          <v-card variant="outlined" rounded="lg" class="pa-4">
            <h2 class="text-h6 mb-3">Entrega y pago</h2>
            <p class="text-body-2">{{ order.customer.address }}, {{ order.customer.commune }}</p>
            <p class="text-body-2">Teléfono: {{ order.customer.phone }}</p>
            <p class="text-body-2">Pago: {{ order.payment }}</p>
            <p class="text-body-2">Fecha: {{ date }}</p>
          </v-card>
        </v-col>
      </v-row>

      <div class="d-flex justify-center flex-wrap mt-6 actions">
        <v-btn :to="{ name: 'catalog' }" color="primary">Seguir comprando</v-btn>
        <v-btn :to="{ name: 'orders' }" variant="outlined">Ver mis compras</v-btn>
      </div>
    </template>
  </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import OrderSummary from '@/components/OrderSummary.vue'
import { formatDate } from '@/utils/format'

export default {
  name: 'OrderView',
  components: { OrderSummary },
  computed: {
    ...mapState('auth', ['user']),
    ...mapGetters('auth', ['isAdmin']),
    ...mapGetters('orders', ['orderById']),
    order () {
      return this.orderById(this.$route.params.id)
    },
    // Cada cliente solo ve sus pedidos; el admin puede ver todos
    canSee () {
      return this.order && (this.isAdmin || this.order.userEmail === this.user.email)
    },
    date () {
      return formatDate(this.order.createdAt)
    }
  }
}
</script>

<style scoped>
.actions {
  gap: 12px;
}
</style>
