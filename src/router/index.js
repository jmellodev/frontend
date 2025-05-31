import { createRouter, createWebHistory } from 'vue-router'
import ProductListPage from '@/pages/ProdutListPage.vue'
import Cart from '@/pages/Cart.vue'
import ProductDetail from '@/pages/ProductDetail.vue'
import Favorites from '@/pages/Favorites.vue'
import Profile from '@/pages/Profile.vue'
import Checkout from '@/pages/Checkout.vue'
import BuildPizza from '@/pages/BuildPizza.vue'
import NotificationOptIn from '@/pages/NotificationOptIn.vue'

// Importações para as páginas da área de administração
// import AdminDashboard from '@/pages/admin/views/Dashboard.vue' // Removido, pois você não tem este componente
import AdminOrders from '@/pages/admin/views/Orders.vue'
import AdminProducts from '@/pages/admin/views/Products.vue'
import AdminCategories from '@/pages/admin/views/Categories.vue'
import WhatsappQrCodeDisplay from '@/pages/admin/views/WhatsappQrCodeDisplay.vue'
import AdminSettingsComponent from '@/pages/admin/views/AdminSettings.vue'
import AdminDashboard from '@/pages/admin/views/AdminDashboard.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // --- Rotas do Frontend (com meta para animações) ---
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
      path: '/configuracoes',
      name: 'settings',
      component: NotificationOptIn,
      meta: {
        enterActiveClass: 'animate__animated animate__fadeIn animate__faster',
        leaveActiveClass: 'animate__animated animate__fadeOut animate__faster',
      },
    },

    // --- Rotas da Área Administrativa (sem meta para animações) ---
    {
      path: '/admin',
      name: 'admin-dashboard',
      component: AdminDashboard,
    },
    {
      path: '/admin/orders',
      name: 'admin-orders',
      component: AdminOrders,
      // Sem meta para animações
    },
    {
      path: '/admin/products',
      name: 'admin-products',
      component: AdminProducts,
      // Sem meta para animações
    },
    {
      path: '/admin/categories',
      name: 'admin-categories',
      component: AdminCategories,
      // Sem meta para animações
    },
    {
      path: '/admin/whatsapp-qr', // Já existente, mantido aqui
      name: 'whatsapp-qr',
      component: WhatsappQrCodeDisplay,
      // Sem meta para animações (removido do original para consistência com as novas rotas admin)
    },
    // Você pode adicionar uma rota para as configurações do admin aqui, se for diferente das configurações gerais
    {
      path: '/admin/settings',
      name: 'admin-settings',
      component: AdminSettingsComponent, // Crie um componente para as configurações do admin
    },
  ],
})

export default router
