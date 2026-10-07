<template>
  <v-footer class="d-block pt-8 pb-4" border="t">
    <v-container>
      <v-row>
        <v-col cols="12" md="5">
          <AppLogo class="footer-logo" />
          <p class="text-body-2 text-medium-emphasis mt-3">Ropa para todos. Moda simple, cómoda y para cada día.</p>
        </v-col>

        <v-col cols="6" md="3">
          <h2 class="text-subtitle-1 font-weight-bold mb-2">Categorías</h2>
          <ul class="footer-list">
            <li v-for="section in sections" :key="section.slug">
              <router-link :to="{ name: 'catalog', params: { category: section.slug } }">
                {{ section.label }}
              </router-link>
            </li>
          </ul>
        </v-col>

        <v-col cols="6" md="4">
          <h2 class="text-subtitle-1 font-weight-bold mb-2">Síguenos</h2>
          <div class="d-flex flex-wrap ga-2">
            <v-btn
              v-for="network in socials"
              :key="network.name"
              :href="network.url"
              :icon="network.icon"
              :aria-label="`ModaUno en ${network.name}`"
              target="_blank"
              rel="noopener noreferrer"
              variant="outlined"
              size="small"
            />
          </div>
        </v-col>
      </v-row>

      <v-divider class="my-4" />
      <p class="text-caption text-medium-emphasis text-center">
        © {{ year }} ModaUno. Proyecto de práctica con datos de Platzi Fake Store API.
      </p>
    </v-container>
  </v-footer>
</template>

<script>
import AppLogo from '@/components/AppLogo.vue'
import { SECTIONS } from '@/utils/categories'

export default {
  name: 'AppFooter',
  components: { AppLogo },
  data () {
    return {
      sections: SECTIONS,
      // Reemplaza estos enlaces por las cuentas reales de la tienda
      socials: [
        { name: 'Instagram', icon: 'mdi-instagram', url: 'https://www.instagram.com/modauno' },
        { name: 'Facebook', icon: 'mdi-facebook', url: 'https://www.facebook.com/modauno' },
        { name: 'WhatsApp', icon: 'mdi-whatsapp', url: 'https://wa.me/56900000000' },
        { name: 'YouTube', icon: 'mdi-youtube', url: 'https://www.youtube.com/@modauno' },
        { name: 'X', icon: 'mdi-twitter', url: 'https://x.com/modauno' }
      ]
    }
  },
  computed: {
    year () {
      return new Date().getFullYear()
    }
  }
}
</script>

<style scoped>
.footer-logo {
  width: 150px;
  height: 44px;
}

.footer-list {
  list-style: none;
  padding: 0;
}

.footer-list li {
  margin-bottom: 6px;
}

.footer-list a {
  color: inherit;
  text-decoration: none;
}

.footer-list a:hover {
  text-decoration: underline;
}
</style>
