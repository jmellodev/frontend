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
import AdminDashboard from '@/pages/admin/views/AdminDashboard.vue'
import AdminOrders from '@/pages/admin/views/Orders.vue'
import AdminProducts from '@/pages/admin/views/Products.vue'
import AdminCategories from '@/pages/admin/views/Categories.vue'
import WhatsappQrCodeDisplay from '@/pages/admin/views/WhatsappQrCodeDisplay.vue'
import AdminSettings from '@/pages/admin/views/AdminSettings.vue'
import AdminLogin from '@/pages/admin/views/Login.vue'
import AdminManagerUsers from '@/pages/admin/views/ManagerUsers.vue'

import { useAuthStore } from '@/stores/auth' // Importa o store de autenticação

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // --- Rotas do Frontend ---
    { path: '/', name: 'home', component: ProductListPage, meta: { enterActiveClass: 'animate__animated animate__fadeIn animate__faster', leaveActiveClass: 'animate__animated animate__fadeOut animate__faster' } },
    { path: '/carrinho', name: 'cart', component: Cart, meta: { enterActiveClass: 'animate__animated animate__fadeIn animate__faster', leaveActiveClass: 'animate__animated animate__fadeOut animate__faster' } },
    { path: '/produto/:slug', name: 'productDetail', component: ProductDetail, meta: { enterActiveClass: 'animate__animated animate__fadeIn animate__faster', leaveActiveClass: 'animate__animated animate__fadeOut animate__faster' } },
    { path: '/favoritos', name: 'favritos', component: Favorites, meta: { enterActiveClass: 'animate__animated animate__fadeIn animate__faster', leaveActiveClass: 'animate__animated animate__fadeOut animate__faster' } },
    { path: '/perfil', name: 'perfil', component: Profile, meta: { enterActiveClass: 'animate__animated animate__fadeIn animate__faster', leaveActiveClass: 'animate__animated animate__fadeOut animate__faster' } },
    { path: '/checkout', name: 'checkout', component: Checkout, meta: { enterActiveClass: 'animate__animated animate__fadeIn animate__faster', leaveActiveClass: 'animate__animated animate__fadeOut animate__faster' } },
    { path: '/monte-sua-pizza', name: 'buildPiza', component: BuildPizza, meta: { enterActiveClass: 'animate__animated animate__fadeIn animate__faster', leaveActiveClass: 'animate__animated animate__fadeOut animate__faster' } },
    { path: '/configuracoes', name: 'settings', component: NotificationOptIn, meta: { enterActiveClass: 'animate__animated animate__fadeIn animate__faster', leaveActiveClass: 'animate__animated animate__fadeOut animate__faster' } },

    // --- Rotas da Área Administrativa ---
    {
      path: '/admin/login',
      name: 'admin-login',
      component: AdminLogin,
      meta: { requiresAuth: false, publicRoute: true }
    },
    {
      path: '/admin',
      name: 'admin-dashboard',
      component: AdminDashboard,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/admin/orders',
      name: 'admin-orders',
      component: AdminOrders,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/admin/products',
      name: 'admin-products',
      component: AdminProducts,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/admin/categories',
      name: 'admin-categories',
      component: AdminCategories,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/admin/whatsapp-qr',
      name: 'whatsapp-qr',
      component: WhatsappQrCodeDisplay,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/admin/settings',
      name: 'admin-settings',
      component: AdminSettings,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/admin/manage-users',
      name: 'admin-mange-users',
      component: AdminManagerUsers,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
  ],
})

// --- GUARDA DE NAVEGAÇÃO GLOBAL ---
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  /* console.log(`--- Navegando para: ${to.path} ---`);
  console.log('Auth Store antes da inicialização:', {
    isAuthenticated: authStore.isAuthenticated,
    isAdmin: authStore.isAdmin,
    user: authStore.user ? { uid: authStore.user.uid, isAdmin: authStore.user.isAdmin } : null,
    authToken: authStore.authToken ? 'present' : 'absent',
    loading: authStore.loading
  }); */

  if (!authStore.isAuthenticated && !authStore.loading) {
    // console.log('Iniciando authStore.initializeAuth()...');
    await authStore.initializeAuth();
    /* console.log('Auth Store após initializeAuth():', {
      isAuthenticated: authStore.isAuthenticated,
      isAdmin: authStore.isAdmin,
      user: authStore.user ? { uid: authStore.user.uid, isAdmin: authStore.user.isAdmin } : null,
      authToken: authStore.authToken ? 'present' : 'absent',
      loading: authStore.loading
    }); */
  }

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);
  const isPublicRoute = to.matched.some(record => record.meta.publicRoute);

  const isAuthenticated = authStore.isAuthenticated;
  const isAdmin = authStore.isAdmin;

  /*  console.log('Verificações de Rota:', {
     toPath: to.path,
     requiresAuth: requiresAuth,
     requiresAdmin: requiresAdmin,
     isPublicRoute: isPublicRoute,
     isAuthenticated: isAuthenticated,
     isAdmin: isAdmin
   }); */


  if (requiresAuth && !isAuthenticated) {
    // Rota protegida (requer autenticação) e usuário NÃO está autenticado.
    console.log('Acesso negado: Rota requer autenticação, mas usuário não está autenticado.');
    next({ name: 'admin-login' });
  } else if (requiresAdmin && !isAdmin) {
    // Rota protegida (requer admin) e usuário NÃO é admin.
    // Redireciona para a página inicial ou uma página de acesso negado.
    console.log('Acesso negado: Rota requer privilégios de admin, mas usuário não é admin. Redirecionando para home.');
    next({ name: 'home' }); // Redireciona para a página inicial
  } else if (isPublicRoute && isAuthenticated) {
    // Usuário já está autenticado e tenta acessar uma rota pública (como a página de login).
    console.log('Redirecionando: Usuário autenticado tentando acessar página de login.');
    next({ name: 'admin-dashboard' });
  } else {
    // Todas as verificações passaram ou a rota não é protegida.
    console.log('Acesso permitido.');
    next();
  }
});

export default router
