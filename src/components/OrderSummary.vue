<template>
  <div>
    <ul class="order-items">
      <li v-for="item in order.items" :key="item.id" class="order-item mb-2">
        <img :src="item.image" :alt="item.title" width="48" height="48">
        <span class="flex-grow-1 text-body-2">{{ item.title }} × {{ item.quantity }}</span>
        <span class="text-body-2">{{ money(item.price * item.quantity) }}</span>
      </li>
    </ul>
    <v-divider class="my-3" />
    <div class="d-flex justify-space-between text-body-2 mb-1">
      <span>Subtotal</span><span>{{ money(order.subtotal) }}</span>
    </div>
    <div class="d-flex justify-space-between text-body-2 mb-1">
      <span>Envío</span><span>{{ order.shipping === 0 ? 'Gratis' : money(order.shipping) }}</span>
    </div>
    <div class="d-flex justify-space-between text-subtitle-1 font-weight-bold">
      <span>Total</span><span>{{ money(order.total) }}</span>
    </div>
  </div>
</template>

<script>
import { formatPrice } from '@/utils/format'

export default {
  name: 'OrderSummary',
  props: {
    order: { type: Object, required: true }
  },
  methods: {
    money: formatPrice
  }
}
</script>

<style scoped>
.order-items {
  list-style: none;
  padding: 0;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.order-items img {
  object-fit: cover;
  border-radius: 6px;
}
</style>
