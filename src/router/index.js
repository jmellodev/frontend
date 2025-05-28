import { createRouter, createWebHistory } from 'vue-router'
import ProductListPage from '@/pages/ProdutListPage.vue'
import Cart from '@/pages/Cart.vue'
import ProductDetail from '@/pages/ProductDetail.vue'
import Favorites from '@/pages/Favorites.vue'
import Profile from '@/pages/Profile.vue'
import Checkout from '@/pages/Checkout.vue'
import BuildPizza from '@/pages/BuildPizza.vue'
import WhatsappQrCodeDisplay from '@/pages/admin/views/WhatsappQrCodeDisplay.vue'
import NotificationOptIn from '@/pages/NotificationOptIn.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: ProductListPage,
      meta: {
        enterActiveClass: 'animate__animated animate__fadeIn animate__faster',
        leaveActiveClass: 'animate__animated animate__fadeOut animate__faster',
      },
    },
    {
      path: '/carrinho',
      name: 'cart',
      component: Cart,
      meta: {
        enterActiveClass: 'animate__animated animate__fadeIn animate__faster',
        leaveActiveClass: 'animate__animated animate__fadeOut animate__faster',
      },
    },
    {
      path: '/produto/:slug',
      name: 'productDetail',
      component: ProductDetail,
      meta: {
        enterActiveClass: 'animate__animated animate__fadeIn animate__faster',
        leaveActiveClass: 'animate__animated animate__fadeOut animate__faster',
      },
    },
    {
      path: '/favoritos',
      name: 'favritos',
      component: Favorites,
      meta: {
        enterActiveClass: 'animate__animated animate__fadeIn animate__faster',
        leaveActiveClass: 'animate__animated animate__fadeOut animate__faster',
      },
    },
    {
      path: '/perfil',
      name: 'perfil',
      component: Profile,
      meta: {
        enterActiveClass: 'animate__animated animate__fadeIn animate__faster',
        leaveActiveClass: 'animate__animated animate__fadeOut animate__faster',
      },
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: Checkout,
      meta: {
        enterActiveClass: 'animate__animated animate__fadeIn animate__faster',
        leaveActiveClass: 'animate__animated animate__fadeOut animate__faster',
      },
    },
    {
      path: '/monte-sua-pizza',
      name: 'buildPiza',
      component: BuildPizza,
      meta: {
        enterActiveClass: 'animate__animated animate__fadeIn animate__faster',
        leaveActiveClass: 'animate__animated animate__fadeOut animate__faster',
      },
    },
    {
      path: '/admin/whatsapp-qr', // Exemplo de rota para a página do QR Code
      name: 'whatsapp-qr',
      component: WhatsappQrCodeDisplay,
      meta: {
        enterActiveClass: 'animate__animated animate__fadeIn animate__faster',
        leaveActiveClass: 'animate__animated animate__fadeOut animate__faster',
      },
    },
    {
      path: '/configuracoes',
      name: 'settings',
      component: NotificationOptIn,
      meta: {
        enterActiveClass: 'animate__animated animate__fadeIn animate__faster',
        leaveActiveClass: 'animate__animated animate__fadeOut animate__faster',
      },
    }
  ],
})

export default router
