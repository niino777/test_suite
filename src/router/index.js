import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import store from '@/store'
import HomeView from '@/views/HomeView.vue'
import CatalogView from '@/views/CatalogView.vue'
import ProductDetailView from '@/views/ProductDetailView.vue'
import FavoritesView from '@/views/FavoritesView.vue'
import CheckoutView from '@/views/CheckoutView.vue'
import OrderView from '@/views/OrderView.vue'
import OrdersView from '@/views/OrdersView.vue'
import AdminSalesView from '@/views/AdminSalesView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  // /catalogo, /catalogo/calzado, /catalogo/ropa-femenina/vestidos
  { path: '/catalogo/:category?/:type?', name: 'catalog', component: CatalogView },
  { path: '/producto/:id', name: 'product', component: ProductDetailView },
  { path: '/favoritos', name: 'favorites', component: FavoritesView, meta: { requiresAuth: true } },
  { path: '/checkout', name: 'checkout', component: CheckoutView, meta: { requiresAuth: true } },
  { path: '/pedido/:id', name: 'order', component: OrderView, meta: { requiresAuth: true } },
  { path: '/mis-compras', name: 'orders', component: OrdersView, meta: { requiresAuth: true } },
  { path: '/admin/ventas', name: 'admin-sales', component: AdminSalesView, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  // En producción se usa '#' en la URL para que funcione en GitHub Pages sin configuración extra
  history: process.env.NODE_ENV === 'production' ? createWebHashHistory() : createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})

// Las rutas privadas piden iniciar sesión; el panel de ventas, además, rol de administrador
router.beforeEach((to) => {
  if (to.meta.requiresAuth && !store.getters['auth/isLoggedIn']) {
    store.commit('auth/OPEN_DIALOG', 'login')
    return { name: 'home' }
  }
  if (to.meta.requiresAdmin && !store.getters['auth/isAdmin']) {
    return { name: 'home' }
  }
})

export default router
