<template>
  <div class="flex min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
    <header
      class="fixed top-0 left-0 right-0 z-50 bg-gray-100 dark:bg-gray-800 shadow-md px-6 flex items-center justify-between h-14">
      <div class="flex items-center">
        <button @click="toggleMobileMenu" class="md:hidden text-gray-700 dark:text-white text-2xl mr-4">
          &#9776; </button>
        <h1 class="text-xl font-bold text-gray-900 dark:text-white">Painel Admin</h1>
      </div>

      <div class="flex items-center space-x-4 py-4 bg-amber-300 group relative">
        <div v-if="authStore.user?.email" class="text-gray-700 dark:text-gray-300 sm:block">
          <div class="flex items-center cursor-pointer">
            <span class="text-xs">{{ authStore.user.displayName }}</span>
            <i class="fa-duotone fa-user-circle ml-2 text-2xl"></i>
          </div>

          <ul
            class="w-auto flex-col space-y-4 text-sm dark:text-gray-200 bg-gray-100 dark:bg-gray-800 absolute p-2 rounded-md shadow-lg top-8 -z-50 -right-1 opacity-0 -translate-y-full group-hover:flex group-hover:translate-y-5 group-hover:opacity-100 transition-all duration-200 border border-gray-200 dark:border-gray-800">
            <li class="flex items-center space-x-2 p-0 whitespace-nowrap ">
              <i class="fa-duotone fa-home sr-only"></i>
            </li>
            <li
              class="flex items-center space-x-2 p-2 whitespace-nowrap cursor-pointer hover:bg-gray-200/90 dark:hover:bg-gray-400">
              <i class="fa-duotone fa-user"></i><span class="text-gray-600">Perfil</span>
            </li>
            <li
              class="flex items-center space-x-2 p-2 whitespace-nowrap cursor-pointer hover:bg-gray-200/90 dark:hover:bg-gray-400">
              <i class="fa-duotone fa-cog"></i><span class="text-gray-600">Configurações</span>
            </li>
            <li
              class="flex items-center space-x-2 p-2 whitespace-nowrap cursor-pointer hover:bg-gray-200/90 dark:hover:bg-gray-400">
              <i class="fa-duotone fa-lock"></i><span class="text-gray-600">Segurança</span>
            </li>
            <li @click="authStore.logout()"
              class="flex items-center space-x-2 p-2 whitespace-nowrap cursor-pointer text-red-600 hover:bg-gray-200/90 dark:hover:bg-gray-400">
              <i class="fa-duotone fa-solid fa-right-from-bracket"></i><span>Sair</span>
            </li>
          </ul>
        </div>
      </div>
    </header>

    <nav class="hidden md:block w-64 bg-gray-100 dark:bg-gray-800 p-4 min-h-screen shadow-lg fixed top-14 left-0 z-30">
      <div class="space-y-3 pt-4">
        <RouterLink to="/admin" active-class="bg-blue-100 dark:bg-gray-700 text-blue-700 dark:text-white"
          class="flex w-full text-left px-3 py-2 rounded-md items-center text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200">
          <i class="fa-duotone fa-chart-line mr-3 text-lg"></i> Dashboard
        </RouterLink>
        <RouterLink to="/admin/orders" active-class="bg-blue-100 dark:bg-gray-700 text-blue-700 dark:text-white"
          class="flex w-full text-left px-3 py-2 rounded-md items-center text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200">
          <i class="fa-duotone fa-receipt mr-3 text-lg"></i> Pedidos
        </RouterLink>
        <RouterLink to="/admin/products" active-class="bg-blue-100 dark:bg-gray-700 text-blue-700 dark:text-white"
          class="flex w-full text-left px-3 py-2 rounded-md items-center text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200">
          <i class="fa-duotone fa-box-open mr-3 text-lg"></i> Produtos
        </RouterLink>
        <RouterLink to="/admin/categories" active-class="bg-blue-100 dark:bg-gray-700 text-blue-700 dark:text-white"
          class="flex w-full text-left px-3 py-2 rounded-md items-center text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200">
          <i class="fa-duotone fa-tags mr-3 text-lg"></i> Categorias
        </RouterLink>
        <RouterLink to="/admin/whatsapp-qr" active-class="bg-blue-100 dark:bg-gray-700 text-blue-700 dark:text-white"
          class="flex w-full text-left px-3 py-2 rounded-md items-center text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200">
          <i class="fab fa-whatsapp mr-3 text-lg"></i> WhatsApp QR
        </RouterLink>
        <RouterLink to="/admin/settings" active-class="bg-blue-100 dark:bg-gray-700 text-blue-700 dark:text-white"
          class="flex w-full text-left px-3 py-2 rounded-md items-center text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200">
          <i class="fa-duotone fa-tools mr-3 text-lg"></i> Configurações
        </RouterLink>
      </div>
    </nav>

    <transition name="fade" mode="out-in">
      <aside v-if="mobileMenuOpen" class="fixed inset-0 bg-white dark:bg-gray-900 p-6 z-50 md:hidden flex flex-col">
        <div class="flex justify-end mb-6">
          <button @click="closeMobileMenu" class="text-gray-500 dark:text-white text-3xl">
            &times;
          </button>
        </div>
        <nav class="space-y-3 flex-grow">
          <RouterLink @click="closeMobileMenu" to="/admin"
            active-class="bg-blue-100 dark:bg-gray-700 text-blue-700 dark:text-white"
            class="flex w-full text-left px-3 py-2 rounded-md items-center text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200">
            <i class="fa-duotone fa-chart-line mr-3 text-lg"></i> Dashboard
          </RouterLink>
          <RouterLink @click="closeMobileMenu" to="/admin/orders"
            active-class="bg-blue-100 dark:bg-gray-700 text-blue-700 dark:text-white"
            class="flex w-full text-left px-3 py-2 rounded-md items-center text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200">
            <i class="fa-duotone fa-receipt mr-3 text-lg"></i> Pedidos
          </RouterLink>
          <RouterLink @click="closeMobileMenu" to="/admin/products"
            active-class="bg-blue-100 dark:bg-gray-700 text-blue-700 dark:text-white"
            class="flex w-full text-left px-3 py-2 rounded-md items-center text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200">
            <i class="fa-duotone fa-box-open mr-3 text-lg"></i> Produtos
          </RouterLink>
          <RouterLink @click="closeMobileMenu" to="/admin/categories"
            active-class="bg-blue-100 dark:bg-gray-700 text-blue-700 dark:text-white"
            class="flex w-full text-left px-3 py-2 rounded-md items-center text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200">
            <i class="fa-duotone fa-tags mr-3 text-lg"></i> Categorias
          </RouterLink>
          <RouterLink @click="closeMobileMenu" to="/admin/whatsapp-qr"
            active-class="bg-blue-100 dark:bg-gray-700 text-blue-700 dark:text-white"
            class="flex w-full text-left px-3 py-2 rounded-md items-center text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200">
            <i class="fab fa-whatsapp mr-3 text-lg"></i> WhatsApp QR
          </RouterLink>
          <RouterLink @click="closeMobileMenu" to="/admin/settings"
            active-class="bg-blue-100 dark:bg-gray-700 text-blue-700 dark:text-white"
            class="flex w-full text-left px-3 py-2 rounded-md items-center text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200">
            <i class="fa-duotone fa-tools mr-3 text-lg"></i> Configurações
          </RouterLink>
        </nav>
      </aside>
    </transition>

    <main class="flex-1 p-4 md:ml-64 mt-14">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth'; // Importa o store de autenticação
import ThemeToggle from '@/components/ThemeToggle.vue'; // Importa o ThemeToggle

const authStore = useAuthStore();
const mobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const closeMobileMenu = () => {
  mobileMenuOpen.value = false;
};

// Inicializa o estado de autenticação ao montar o layout
onMounted(() => {
  authStore.initializeAuth();
});
</script>

<style scoped>
/* Estilos para a transição do menu mobile */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
