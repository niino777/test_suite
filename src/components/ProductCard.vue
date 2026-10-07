<template>
  <v-card class="product-card h-100 d-flex flex-column" rounded="lg" data-test="product-card">
    <div class="product-card__media">
      <img :src="imageSrc" :alt="product.title" loading="lazy" @error="onImageError">
      <v-btn
        class="product-card__favorite"
        :icon="favorite ? 'mdi-heart' : 'mdi-heart-outline'"
        :color="favorite ? 'primary' : undefined"
        :aria-label="favorite ? 'Quitar de favoritos' : 'Agregar a favoritos'"
        :aria-pressed="favorite"
        size="small"
        data-test="favorite-btn"
        @click="$emit('toggle-favorite', product.id)"
      />
    </div>

    <v-card-item>
      <v-chip size="x-small" color="primary" variant="tonal" class="mb-2">
        {{ sectionLabel }}
      </v-chip>
      <v-card-title class="text-wrap text-body-1 font-weight-bold">
        <router-link
          class="product-card__link"
          :to="{ name: 'product', params: { id: product.id } }"
        >
          {{ product.title }}
        </router-link>
      </v-card-title>
    </v-card-item>

    <v-spacer />
    <v-card-actions class="px-4 pb-4">
      <span class="text-h6">{{ price }}</span>
      <v-spacer />
      <v-btn
        class="product-card__add"
        size="small"
        color="primary"
        prepend-icon="mdi-cart-plus"
        data-test="add-to-cart-btn"
        @click="$emit('add-to-cart', product)"
      >
        Agregar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { formatPrice, PLACEHOLDER_IMAGE } from '@/utils/format'
import { getSectionLabel } from '@/utils/categories'

export default {
  name: 'ProductCard',
  props: {
    product: { type: Object, required: true },
    favorite: { type: Boolean, default: false }
  },
  emits: ['toggle-favorite', 'add-to-cart'],
  data () {
    return { imageSrc: this.product.image }
  },
  computed: {
    price () {
      return formatPrice(this.product.price)
    },
    sectionLabel () {
      return getSectionLabel(this.product.section)
    }
  },
  mounted () {
    // Ciclo de vida: la tarjeta queda lista para mostrarse
    this.imageSrc = this.product.image || PLACEHOLDER_IMAGE
  },
  methods: {
    onImageError () {
      this.imageSrc = PLACEHOLDER_IMAGE
    }
  }
}
</script>

<style scoped>
.product-card {
  position: relative;
  transition: transform 0.2s, box-shadow 0.2s;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.product-card__media {
  position: relative;
  aspect-ratio: 1 / 1;
  background: rgba(128, 128, 128, 0.12);
}

.product-card__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-card__favorite {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 2; /* queda por encima del enlace extendido */
}

.product-card__add {
  position: relative;
  z-index: 2; /* queda por encima del enlace extendido */
}

.product-card__link {
  color: inherit;
  text-decoration: none;
}

/* Hace clicable toda la tarjeta usando solo el enlace del título */
.product-card__link::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 1;
}
</style>
