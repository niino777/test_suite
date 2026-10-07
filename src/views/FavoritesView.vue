<template>
  <v-container class="py-6">
    <h1 class="text-h4 font-weight-bold mb-4">Mis favoritos</h1>

    <v-skeleton-loader v-if="loading" type="image, article" />

    <v-alert v-else-if="error" type="error" variant="tonal">{{ error }}</v-alert>

    <v-alert v-else-if="favoriteProducts.length === 0" type="info" variant="tonal">
      Aún no tienes favoritos. Toca el corazón de un producto para guardarlo.
    </v-alert>

    <v-row v-else>
      <v-col v-for="product in favoriteProducts" :key="product.id" cols="12" sm="6" md="4" lg="3">
        <ProductCard :product="product" favorite @toggle-favorite="toggle" @add-to-cart="addToCart" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import ProductCard from '@/components/ProductCard.vue'

export default {
  name: 'FavoritesView',
  components: { ProductCard },
  computed: {
    ...mapState('products', ['loading', 'error']),
    ...mapGetters('favorites', ['favoriteProducts'])
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
