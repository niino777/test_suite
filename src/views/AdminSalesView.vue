<template>
  <v-container class="py-6">
    <h1 class="text-h4 font-weight-bold mb-1">Panel de ventas</h1>
    <p class="text-body-2 text-medium-emphasis mb-4">Ventas simuladas guardadas en este navegador.</p>

    <v-row class="mb-2">
      <v-col cols="12" sm="4">
        <v-card variant="outlined" rounded="lg" class="pa-4">
          <p class="text-caption">Ventas totales</p>
          <p class="text-h5 font-weight-bold" data-test="kpi-total">{{ money(totalSales) }}</p>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card variant="outlined" rounded="lg" class="pa-4">
          <p class="text-caption">Pedidos</p>
          <p class="text-h5 font-weight-bold" data-test="kpi-count">{{ list.length }}</p>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card variant="outlined" rounded="lg" class="pa-4">
          <p class="text-caption">Ticket promedio</p>
          <p class="text-h5 font-weight-bold">{{ money(averageTicket) }}</p>
        </v-card>
      </v-col>
    </v-row>

    <div class="d-flex flex-wrap mb-4 actions">
      <v-btn color="primary" prepend-icon="mdi-database-plus-outline" :loading="seeding" data-test="seed-btn" @click="seed">
        Generar 10 ventas de prueba
      </v-btn>
      <v-btn variant="outlined" prepend-icon="mdi-delete-outline" :disabled="list.length === 0" @click="clearAll">
        Borrar ventas
      </v-btn>
    </div>

    <v-alert v-if="list.length === 0" type="info" variant="tonal">
      Aún no hay ventas. Genera datos de prueba o realiza una compra como cliente.
    </v-alert>

    <div v-else class="table-wrap">
      <v-table>
        <thead>
          <tr>
            <th>Pedido</th>
            <th>Fecha</th>
            <th>Cliente</th>
            <th>Comuna</th>
            <th>Unidades</th>
            <th>Estado</th>
            <th class="text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in list" :key="order.id">
            <td><router-link :to="{ name: 'order', params: { id: order.id } }">{{ order.id }}</router-link></td>
            <td>{{ date(order.createdAt) }}</td>
            <td>{{ order.customer.name }}</td>
            <td>{{ order.customer.commune }}</td>
            <td>{{ units(order) }}</td>
            <td>{{ order.status }}</td>
            <td class="text-right">{{ money(order.total) }}</td>
          </tr>
        </tbody>
      </v-table>
    </div>
  </v-container>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import { formatPrice, formatDate } from '@/utils/format'

export default {
  name: 'AdminSalesView',
  data () {
    return { seeding: false }
  },
  computed: {
    ...mapState('orders', ['list']),
    ...mapGetters('orders', ['totalSales', 'averageTicket'])
  },
  methods: {
    ...mapActions('orders', ['seedDemoOrders', 'clearAll']),
    money: formatPrice,
    date: formatDate,
    units (order) {
      return order.items.reduce((total, item) => total + item.quantity, 0)
    },
    async seed () {
      this.seeding = true
      await this.seedDemoOrders(10)
      this.seeding = false
    }
  }
}
</script>

<style scoped>
.actions {
  gap: 12px;
}

.table-wrap {
  overflow-x: auto;
}
</style>
