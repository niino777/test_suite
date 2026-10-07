<template>
  <v-container class="py-6">
    <v-breadcrumbs :items="breadcrumbs" class="px-0" />

    <v-row v-if="loading">
      <v-col cols="12" md="6"><v-skeleton-loader type="image" /></v-col>
      <v-col cols="12" md="6"><v-skeleton-loader type="article" /></v-col>
    </v-row>

    <v-alert v-else-if="error" type="error" variant="tonal">{{ error }}</v-alert>

    <v-alert v-else-if="!product" type="warning" variant="tonal">
      No encontramos este producto.
    </v-alert>

    <v-row v-else>
      <v-col cols="12" md="6">
        <img :src="product.image" :alt="product.title" class="detail-img" @error="onImageError">
      </v-col>
      <v-col cols="12" md="6">
        <v-chip variant="tonal" class="mb-3">{{ sectionLabel }}</v-chip>
        <h1 class="text-h4 font-weight-bold mb-2">{{ product.title }}</h1>
        <p class="text-h5 mb-4">{{ price }}</p>
        <p class="text-body-1 mb-6">{{ product.description }}</p>

        <div class="d-flex align-center mb-6">
          <span class="mr-4">Cantidad</span>
          <v-btn icon="mdi-minus" size="small" variant="outlined" aria-label="Menos" :disabled="quantity <= 1" @click="quantity -= 1" />
          <span class="mx-4 text-h6" data-test="detail-qty">{{ quantity }}</span>
          <v-btn icon="mdi-plus" size="small" variant="outlined" aria-label="Más" :disabled="quantity >= 10" @click="quantity += 1" />
        </div>

        <div class="d-flex flex-wrap actions">
          <v-btn color="primary" size="large" prepend-icon="mdi-cart-plus" data-test="detail-add-btn" @click="add">
            Agregar al carrito
          </v-btn>
          <v-btn size="large" variant="outlined" data-test="buy-now-btn" @click="buyNow">Comprar ahora</v-btn>
          <v-btn
            :color="favorite ? 'primary' : undefined"
            :variant="favorite ? 'flat' : 'outlined'"
            :icon="favorite ? 'mdi-heart' : 'mdi-heart-outline'"
            size="large"
            :aria-label="favorite ? 'Quitar de favoritos' : 'Agregar a favoritos'"
            @click="toggle(product.id)"
          />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import { formatPrice, PLACEHOLDER_IMAGE } from '@/utils/format'
import { getSectionLabel } from '@/utils/categories'

export default {
  name: 'ProductDetailView',
  data () {
    return { quantity: 1 }
  },
  computed: {
    ...mapState('products', ['loading', 'error']),
    ...mapGetters('products', ['productById']),
    ...mapGetters('favorites', ['isFavorite']),
    ...mapGetters('auth', ['isLoggedIn']),
    product () {
      return this.productById(this.$route.params.id)
    },
    favorite () {
      return this.product ? this.isFavorite(this.product.id) : false
    },
    price () {
      return formatPrice(this.product.price)
    },
    sectionLabel () {
      return getSectionLabel(this.product.section)
    },
    // Ruta visible: Inicio / Catálogo / Categoría / Producto
    breadcrumbs () {
      const items = [
        { title: 'Inicio', to: { name: 'home' } },
        { title: 'Catálogo', to: { name: 'catalog' } }
      ]
      if (this.product) {
        items.push(
          { title: this.sectionLabel, to: { name: 'catalog', params: { category: this.product.section } } },
          { title: this.product.title, disabled: true }
        )
      }
      return items
    }
  },
  created () {
    // Si el usuario entra directo a la URL del producto, primero cargamos el catálogo
    this.fetchProducts()
  },
  methods: {
    ...mapActions('products', ['fetchProducts']),
    ...mapActions('favorites', ['toggle']),
    ...mapActions('cart', ['addItem']),
    ...mapMutations('auth', ['OPEN_DIALOG']),
    add () {
      this.addItem({ product: this.product, quantity: this.quantity })
    },
    // Agrega al carrito y va directo a pagar (si no hay sesión, pide ingresar)
    async buyNow () {
      await this.addItem({ product: this.product, quantity: this.quantity })
      if (!this.isLoggedIn) {
        this.OPEN_DIALOG('login')
        return
      }
      this.$router.push({ name: 'checkout' })
    },
    onImageError (event) {
      event.target.src = PLACEHOLDER_IMAGE
    }
  }
}
</script>

<style scoped>
.detail-img {
  width: 100%;
  max-height: 520px;
  object-fit: cover;
  border-radius: 12px;
}

.actions {
  gap: 12px;
}
</style>
