import { createRouter, createWebHistory } from 'vue-router'
import ProductListPage from '@/pages/ProdutListPage.vue'
import Cart from '@/pages/Cart.vue'
import ProductDetail from '@/pages/ProductDetail.vue'
import Favorites from '@/pages/Favorites.vue'
import Profile from '@/pages/Profile.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: ProductListPage,
    },
    {
      path: '/carrinho',
      name: 'cart',
      component: Cart,
    },
    {
      path: '/produto/:slug',
      name: 'productDetail',
      component: ProductDetail,
    },
    {
      path: '/favoritos',
      name: 'favritos',
      component: Favorites,
    },
    {
      path: '/perfil',
      name: 'perfil',
      component: Profile,
    },
  ],
})

export default router
