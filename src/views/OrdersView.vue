<template>
  <v-container class="py-6">
    <h1 class="text-h4 font-weight-bold mb-4">Mis compras</h1>

    <v-alert v-if="myOrders.length === 0" type="info" variant="tonal">
      Aún no tienes compras.
      <router-link :to="{ name: 'catalog' }">Ir al catálogo</router-link>
    </v-alert>

    <v-expansion-panels v-else variant="accordion">
      <v-expansion-panel v-for="order in myOrders" :key="order.id" data-test="order-row">
        <v-expansion-panel-title>
          <span class="font-weight-bold mr-4">{{ order.id }}</span>
          <span class="text-medium-emphasis mr-4">{{ date(order.createdAt) }}</span>
          <v-chip size="small" variant="tonal" class="mr-4">{{ order.status }}</v-chip>
          <span class="ml-auto">{{ money(order.total) }}</span>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <OrderSummary :order="order" />
          <v-btn :to="{ name: 'order', params: { id: order.id } }" variant="text" class="mt-2">Ver detalle</v-btn>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import OrderSummary from '@/components/OrderSummary.vue'
import { formatPrice, formatDate } from '@/utils/format'

export default {
  name: 'OrdersView',
  components: { OrderSummary },
  computed: {
    ...mapGetters('orders', ['myOrders'])
  },
  methods: {
    money: formatPrice,
    date: formatDate
  }
}
</script>
