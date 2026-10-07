<template>
  <div>
    <!-- Box "Nueva moda" con perchero animado -->
    <section class="hero" aria-labelledby="hero-title">
      <v-container>
        <v-row align="center">
          <v-col cols="12" md="7">
            <v-chip variant="outlined" size="small" class="mb-4">Nueva moda</v-chip>
            <h1 id="hero-title" class="text-h3 text-md-h2 font-weight-bold mb-4">Ropa para todos</h1>
            <p class="text-body-1 mb-6">
              Prendas y calzado para hombres, mujeres y niños/as. Envío gratis desde $50.000.
            </p>
            <v-btn :to="{ name: 'catalog' }" color="primary" size="large">Ver catálogo</v-btn>
          </v-col>

          <v-col cols="12" md="5" class="d-flex justify-center" aria-hidden="true">
            <div class="hanger">
              <svg viewBox="0 0 56 64" xmlns="http://www.w3.org/2000/svg">
                <g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="28" cy="6" r="3.5" />
                  <path d="M28 9.5V20 M28 20 L5 40 H51 Z M28 40V46" />
                </g>
                <rect x="8" y="46" width="40" height="12" rx="2" fill="currentColor" />
                <text x="28" y="53.6" font-size="4" font-weight="700" text-anchor="middle" letter-spacing="0.3" class="hanger__text">
                  NUEVA MODA
                </text>
              </svg>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <div class="marquee" aria-hidden="true">
      <div class="marquee__track">
        <span v-for="n in 16" :key="n">NUEVA MODA · ROPA PARA TODOS ·</span>
      </div>
    </div>

    <v-container class="py-8">
      <h2 class="text-h5 font-weight-bold mb-4">Compra por categoría</h2>
      <v-row>
        <v-col v-for="section in sections" :key="section.slug" cols="6" md="3">
          <v-card
            :to="{ name: 'catalog', params: { category: section.slug } }"
            class="text-center pa-4 h-100"
            rounded="lg"
            variant="outlined"
          >
            <v-icon size="40">{{ section.icon }}</v-icon>
            <p class="text-subtitle-1 font-weight-bold mt-2">{{ section.label }}</p>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-container class="pb-10">
      <h2 class="text-h5 font-weight-bold mb-4">Lo más nuevo</h2>
      <ProductList only-new />
    </v-container>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import ProductList from '@/components/ProductList.vue'
import { SECTIONS } from '@/utils/categories'

export default {
  name: 'HomeView',
  components: { ProductList },
  data () {
    return { sections: SECTIONS }
  },
  created () {
    // En el inicio mostramos lo más nuevo sin filtros previos
    this.RESET()
  },
  methods: {
    ...mapMutations('filters', ['RESET'])
  }
}
</script>

<style scoped>
.hero {
  padding: 48px 0;
  background: linear-gradient(135deg, rgba(128, 128, 128, 0.16), rgba(128, 128, 128, 0.03));
}

.hanger {
  width: 240px;
  transform-origin: 50% 0; /* gira desde el gancho */
  animation: swing 2.8s ease-in-out infinite alternate;
}

.hanger__text {
  fill: rgb(var(--v-theme-background));
}

@keyframes swing {
  from { transform: rotate(-7deg); }
  to { transform: rotate(7deg); }
}

.marquee {
  overflow: hidden;
  white-space: nowrap;
  padding: 10px 0;
  background: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-on-primary));
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.15em;
}

.marquee__track {
  display: inline-flex;
  gap: 24px;
  width: max-content;
  animation: scroll 40s linear infinite;
}

@keyframes scroll {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

@media (prefers-reduced-motion: reduce) {
  .hanger,
  .marquee__track {
    animation: none;
  }
}
</style>
