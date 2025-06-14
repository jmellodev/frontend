<template>
  <div>
    <div class="grid min-h-screen bg-gray-200 dark:bg-gray-900 relative">
      <header
        class="fixed top-0 lg:top-0.5 left-0 right-0 lg:right-2 z-50 bg-gray-100/30 backdrop-blur-xs dark:bg-gray-800/50 shadow pr-6 pl-4 md:pl-0 flex items-center justify-between h-14 rounded-2xl transform-all duration-300"
        :class="shortMenu ? 'lg:left-25' : 'lg:left-56'">
        <div class="flex items-center">
          <button @click="toggleMobileMenu" class="md:hidden text-gray-700 dark:text-white text-2xl mr-4">
            <i class="fa-duotone fa-solid fa-bars-sort"></i>
          </button>
          <h1 class="text-md font-bold p-4 hidden md:flex transition-all duration-300 dark:text-gray-200">
            <span>Painel Admin</span>
          </h1>
        </div>
        <div class="flex space-x-6">
          <div class="flex items-center space-x-8">
            <button class="text-gray-700 dark:text-white text-2xl cursor-pointer relative group">
              <span class="absolute top-0 -right-2 bg-orange-600 text-white text-xs rounded-full px-1 z-10">3</span>
              <i class="fa-duotone fa-bell"></i>
              <div
                class="rounded-md text-xs z-20 px-2 py-1 bg-white dark:bg-gray-700 absolute -bottom-5 -left-1/2 shadow-md group-hover:flex hidden group-hover:translate-y-2 animate__animated animate__fadeIn">
                Notificações
              </div>
            </button>
            <button class="text-gray-700 dark:text-white text-2xl cursor-pointer relative group">
              <span class="absolute top-0 -right-2 bg-yellow-600 text-white text-xs rounded-full px-1 z-10">3</span>
              <i class="fa-duotone fa-envelope"></i>
              <div
                class="rounded-md text-xs z-20 px-2 py-1 bg-white dark:bg-gray-700 absolute -bottom-5 -left-1/2 shadow-md group-hover:flex hidden group-hover:translate-y-2 animate__animated animate__fadeIn">
                Mensagens
              </div>
            </button>
            <button class="text-gray-700 dark:text-white text-2xl cursor-pointer relative group">
              <i class="fa-duotone fa-cogs"></i>
              <div
                class="rounded-md text-xs z-20 px-2 py-1 bg-white dark:bg-gray-700 absolute -bottom-5 -left-1/2 shadow-md group-hover:flex hidden group-hover:translate-y-2 animate__animated animate__fadeIn">
                Configurações
              </div>
            </button>
          </div>
          <div class="flex items-center space-x-4 py-4 group relative">
            <div v-if="authStore.user?.email" class="text-gray-700 dark:text-gray-300 sm:block">
              <div @click="toggleUserMenu" class="flex items-center cursor-pointer">
                <i class="fa-duotone fa-user-circle mr-2 text-2xl dark:text-white"></i>
                <span class="text-xs">{{ authStore.user.displayName }}</span>
              </div>

              <ul
                class="w-auto flex-col space-y-4 text-sm dark:text-gray-200 bg-gray-100 dark:bg-gray-800 absolute p-2 rounded-md shadow-lg top-8 -z-50 -right-1 opacity-0 -translate-y-full group-hover:flex group-hover:translate-y-5 group-hover:opacity-100 transition-all duration-200 border border-gray-200 dark:border-gray-800"
                :class="[{ 'opacity-100 translate-y-5': userMenuOpen }]">
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
        </div>
      </header>

      <Sidebar :mobile-menu-open="mobileMenuOpen" :short-menu="shortMenu" @toggle-mobile-menu="toggleMobileMenu"
        @toggle-short-menu="toggleShortMenu" />

      <!-- Main content area ajustado para o sidebar fixo -->
      <main class="flex-1 mt-14 p-4 transition-all duration-300" :class="shortMenu ? 'md:ml-22' : 'md:ml-52'"
        @click="userMenuOpen = false">
        <div class="transition-transform duration-300 ease-in-out" :class="{
          'translate-x-0': !mobileMenuOpen,
          'translate-x-52 original-transform': mobileMenuOpen
        }" @click.stop="closeMobileMenu">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import Sidebar from '@/components/admin/Sidebar.vue';

const authStore = useAuthStore();
const mobileMenuOpen = ref(false);
const userMenuOpen = ref(false);
const shortMenu = ref(false);

// Função para carregar configuração do localStorage
const loadMenuState = () => {
  const savedState = localStorage.getItem('adminSidebarShortMenu');
  if (savedState !== null) {
    shortMenu.value = JSON.parse(savedState);
  }
};

// Função para salvar configuração no localStorage
const saveMenuState = (state) => {
  localStorage.setItem('adminSidebarShortMenu', JSON.stringify(state));
};

const toggleUserMenu = () => {
  userMenuOpen.value = !userMenuOpen.value;
};

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const toggleShortMenu = () => {
  shortMenu.value = !shortMenu.value;
  saveMenuState(shortMenu.value);
};

const closeMobileMenu = () => {
  mobileMenuOpen.value = false;
};

// Watch para salvar automaticamente mudanças no shortMenu
watch(shortMenu, (newValue) => {
  saveMenuState(newValue);
});

// Inicializa o estado de autenticação e configurações ao montar o layout
onMounted(() => {
  authStore.initializeAuth();
  loadMenuState();
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

.wrap-original-transform {
  perspective: 1200px;
  transform-style: preserve-3d;
  perspective-origin: 100% 50%;
}

.original-transform {
  transform: rotateY(-40deg);
}
</style>