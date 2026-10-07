<template>
  <section aria-live="polite">
    <v-row v-if="loading">
      <v-col v-for="n in 8" :key="n" cols="12" sm="6" md="4" lg="3">
        <v-skeleton-loader type="image, article" />
      </v-col>
    </v-row>

    <v-alert
      v-else-if="error"
      type="error"
      variant="tonal"
      data-test="error-message"
    >
      {{ error }}
      <template #append>
        <v-btn variant="outlined" size="small" @click="fetchProducts(true)">Reintentar</v-btn>
      </template>
    </v-alert>

    <v-alert
      v-else-if="visibleProducts.length === 0"
      type="info"
      variant="tonal"
      data-test="empty-message"
    >
      No encontramos productos con esos filtros.
    </v-alert>

    <v-row v-else>
      <v-col v-for="product in visibleProducts" :key="product.id" cols="12" sm="6" md="4" lg="3">
        <ProductCard
          :product="product"
          :favorite="isFavorite(product.id)"
          @toggle-favorite="toggle"
          @add-to-cart="addToCart"
        />
      </v-col>
    </v-row>
  </section>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import ProductCard from '@/components/ProductCard.vue'

export default {
  name: 'ProductList',
  components: { ProductCard },
  props: {
    limit: { type: Number, default: 0 },
    onlyNew: { type: Boolean, default: false }
  },
  computed: {
    ...mapState('products', ['loading', 'error']),
    ...mapGetters('products', ['filteredProducts']),
    ...mapGetters('favorites', ['isFavorite']),
    visibleProducts () {
      const list = this.onlyNew ? this.filteredProducts.filter((product) => product.isNew) : this.filteredProducts
      return this.limit > 0 ? list.slice(0, this.limit) : list
    }
  },
  created () {
    this.fetchProducts()
  },
  methods: {
    ...mapActions('products', ['fetchProducts']),
    ...mapActions('favorites', ['toggle']),
    ...mapActions('cart', ['addItem']),
    addToCart (product) {
      this.addItem({ product })
    }
  }
}
</script>
