<template>
  <v-container class="py-6">
    <v-breadcrumbs :items="breadcrumbs" class="px-0" />
    <h1 class="text-h4 font-weight-bold mb-4">{{ title }}</h1>

    <nav aria-label="Filtrar por categoría" class="chips mb-3">
      <v-chip
        :color="category === 'all' ? 'primary' : undefined"
        :variant="category === 'all' ? 'flat' : 'outlined'"
        @click="goTo()"
      >
        Todo
      </v-chip>
      <v-chip
        v-for="section in sections"
        :key="section.slug"
        :color="category === section.slug ? 'primary' : undefined"
        :variant="category === section.slug ? 'flat' : 'outlined'"
        :prepend-icon="section.icon"
        @click="goTo(section.slug)"
      >
        {{ section.label }}
      </v-chip>
    </nav>

    <!-- Subrutas: tipos de prenda de la categoría elegida -->
    <nav v-if="category !== 'all'" aria-label="Filtrar por tipo de prenda" class="chips mb-4">
      <v-chip
        size="small"
        :color="type === 'all' ? 'primary' : undefined"
        :variant="type === 'all' ? 'flat' : 'tonal'"
        @click="goTo(category)"
      >
        Todos
      </v-chip>
      <v-chip
        v-for="item in availableTypes"
        :key="item.slug"
        size="small"
        :color="type === item.slug ? 'primary' : undefined"
        :variant="type === item.slug ? 'flat' : 'tonal'"
        @click="goTo(category, item.slug)"
      >
        {{ item.label }}
      </v-chip>
    </nav>

    <v-row class="mb-2">
      <v-col cols="12" sm="8">
        <v-text-field
          :model-value="search"
          data-test="search-input"
          label="Buscar producto"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="comfortable"
          clearable
          hide-details
          @update:model-value="SET_SEARCH"
        />
      </v-col>
      <v-col cols="12" sm="4">
        <v-select
          :model-value="sort"
          :items="sortOptions"
          label="Ordenar por"
          variant="outlined"
          density="comfortable"
          hide-details
          @update:model-value="SET_SORT"
        />
      </v-col>
    </v-row>

    <ProductList />
  </v-container>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
import ProductList from '@/components/ProductList.vue'
import { SECTIONS, isValidSlug, getSectionLabel } from '@/utils/categories'

export default {
  name: 'CatalogView',
  components: { ProductList },
  data () {
    return {
      sections: SECTIONS,
      sortOptions: [
        { title: 'Relevancia', value: 'default' },
        { title: 'Menor precio', value: 'price-asc' },
        { title: 'Mayor precio', value: 'price-desc' }
      ]
    }
  },
  computed: {
    ...mapState('filters', ['category', 'type', 'search', 'sort']),
    ...mapGetters('products', ['availableTypes']),
    typeLabel () {
      const found = this.availableTypes.find((item) => item.slug === this.type)
      return found ? found.label : this.type
    },
    title () {
      if (this.type !== 'all') return this.typeLabel
      return this.category === 'all' ? 'Catálogo' : getSectionLabel(this.category)
    },
    // Ruta visible: Inicio / Catálogo / Categoría / Tipo
    breadcrumbs () {
      const items = [
        { title: 'Inicio', to: { name: 'home' } },
        { title: 'Catálogo', to: { name: 'catalog' }, disabled: this.category === 'all' }
      ]
      if (this.category !== 'all') {
        items.push({
          title: getSectionLabel(this.category),
          to: { name: 'catalog', params: { category: this.category } },
          disabled: this.type === 'all'
        })
      }
      if (this.type !== 'all') items.push({ title: this.typeLabel, disabled: true })
      return items
    }
  },
  watch: {
    '$route.params' () {
      if (this.$route.name === 'catalog') this.syncFilters()
    }
  },
  created () {
    this.syncFilters()
  },
  methods: {
    ...mapMutations('filters', ['SET_CATEGORY', 'SET_TYPE', 'SET_SEARCH', 'SET_SORT']),
    // La URL manda: /catalogo/calzado/zapatillas -> categoría "calzado", tipo "zapatillas"
    syncFilters () {
      const { category, type } = this.$route.params
      const validCategory = isValidSlug(category)
      this.SET_CATEGORY(validCategory ? category : 'all')
      this.SET_TYPE(validCategory && type ? type : 'all')
    },
    goTo (category, type) {
      this.$router.push({ name: 'catalog', params: { category, type } })
    }
  }
}
</script>

<style scoped>
.chips {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
}
</style>
