<template>
  <nav :class="shortMenu ? 'w-18' : 'w-44'"
    class="hidden md:block bg-sky-950 dark:bg-gray-800 shadow-lg fixed left-0 top-0 h-[calc(100vh)] transition-all duration-200 z-50">
    <div class="space-y-3 h-full flex flex-col justify-between">
      <div class="flex items-center justify-center bg-sky-900 text-gray-200 p-2 rounded-t-md">PN</div>

      <!-- Menu items container with scroll if needed -->
      <div class="flex-1 space-y-2">
        <RouterLink to="/admin" class="item__menu group">
          <i class="fa-duotone fa-chart-line fa-fw"></i>
          <span class="grow text-sm text-ellipsis line-clamp-1 pr-1" :class="shortMenu ? 'hidden' : ''">Dashboard</span>
          <!-- Tooltip personalizado -->
          <div v-if="shortMenu" class="tooltip">
            <i class="arrow__tooltip"></i>Dashboard
          </div>
        </RouterLink>

        <RouterLink to="/admin/orders" class="item__menu group">
          <i class="fa-duotone fa-book fa-fw" aria-hidden="true"></i>
          <span class="grow text-sm text-ellipsis line-clamp-1 pr-1" :class="shortMenu ? 'hidden' : ''">Pedidos</span>

          <div v-if="shortMenu" class="tooltip">
            <i class="arrow__tooltip"></i>Pedidos
          </div>
        </RouterLink>

        <RouterLink to="/admin/products" class="item__menu group">
          <i class="fa-duotone fa-box-open  fa-fw" aria-hidden="true"></i>
          <span class="grow text-sm text-ellipsis line-clamp-1 pr-1" :class="shortMenu ? 'hidden' : ''">Produtos</span>
          <div v-if="shortMenu" class="tooltip">
            <i class="arrow__tooltip"></i>Produtos
          </div>
        </RouterLink>

        <RouterLink to="/admin/categories" class="item__menu group">
          <i class="fa-duotone fa-tags  fa-fw" aria-hidden="true"></i>
          <span class="grow text-sm text-ellipsis line-clamp-1 pr-1"
            :class="shortMenu ? 'hidden' : ''">Categorias</span>
          <div v-if="shortMenu" class="tooltip">
            <i class="arrow__tooltip"></i>Categorias
          </div>
        </RouterLink>

        <RouterLink to="/admin/whatsapp-qr" class="item__menu group">
          <i class="fab fa-whatsapp  fa-fw" aria-hidden="true"></i>
          <span class="grow text-sm text-ellipsis line-clamp-1 pr-1" :class="shortMenu ? 'hidden' : ''">Whatsapp</span>
          <div v-if="shortMenu" class="tooltip">
            <i class="arrow__tooltip"></i>WhatsApp
          </div>
        </RouterLink>

        <RouterLink to="/admin/settings" class="item__menu group">
          <i class="fa-duotone fa-tools  fa-fw" aria-hidden="true"></i>
          <span class="grow text-sm text-ellipsis line-clamp-1 pr-1"
            :class="shortMenu ? 'hidden' : ''">Configurações</span>
          <div v-if="shortMenu" class="tooltip">
            <i class="arrow__tooltip"></i>Configurações
          </div>
        </RouterLink>

        <RouterLink to="/admin/manage-users" class="item__menu group">
          <i class="fa-duotone fa-users-gear  fa-fw" aria-hidden="true"></i>
          <span class="grow text-sm text-ellipsis line-clamp-1 pr-1" :class="shortMenu ? 'hidden' : ''">Usuários</span>
          <div v-if="shortMenu" class="tooltip">
            <i class="arrow__tooltip"></i>Usuários
          </div>
        </RouterLink>

        <RouterLink to="/admin/reports" class="item__menu group">
          <i class="fa-duotone fa-chart-pie fa-fw" aria-hidden="true"></i>
          <span class="grow text-sm text-ellipsis line-clamp-1 pr-1"
            :class="shortMenu ? 'hidden' : ''">Relatórios</span>
          <div v-if="shortMenu" class="tooltip">
            <i class="arrow__tooltip"></i>Relatórios
          </div>
        </RouterLink>
      </div>
      <!-- Botão para expandir/contrair menu -->
      <div
        class="p-2 flex text-gray-300 relative cursor-pointer hover:text-white transition-colors group bg-sky-600 hover:bg-sky-700 h-10 space-x-2 justify-center items-center"
        @click="toggleShortMenu">
        <i :class="shortMenu ? 'fa-circle-arrow-right' : 'fa-circle-arrow-left'" class="fa-light fa-fw"
          aria-hidden="true"></i>
        <span class="grow text-sm text-ellipsis line-clamp-1 pr-1" :class="shortMenu ? 'hidden' : ''">Recolher
          menu</span>
        <!-- Tooltip personalizado -->
        <div v-if="shortMenu"
          class="absolute top-1 left-full ml-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-[9999] transform translate-x-2 group-hover:-translate-x-2">
          {{ shortMenu ? 'Expandir menu' : 'Contrair menu' }}
          <!-- Seta do tooltip -->
          <div
            class="absolute top-1/2 left-[2px] transform -translate-x-2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-b-[6px] border-r-[6px] border-transparent border-r-gray-900">
          </div>
        </div>
      </div>

    </div>
  </nav>

  <transition name="slide">
    <aside v-if="mobileMenuOpen"
      class="fixed inset-0 bg-gray-800 p-6 z-50 md:hidden flex flex-col w-64 shadow-lg translate-x-0 transition-transform duration-300 ease-in-out">
      <div class="flex justify-end mb-6">
        <button @click="closeMobileMenu" class="text-gray-500 dark:text-white text-3xl">
          &times;
        </button>
      </div>
      <nav class="space-y-3 flex-grow">
        <RouterLink @click="closeMobileMenu" to="/admin" active-class="bg-gray-700 text-white"
          class="flex w-full text-left px-3 py-2 rounded-md items-center text-base font-medium text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200">
          <i class="fa-duotone fa-chart-line mr-3 text-lg"></i> Dashboard
        </RouterLink>
        <RouterLink @click="closeMobileMenu" to="/admin/orders" active-class="bg-gray-700 text-white"
          class="flex w-full text-left px-3 py-2 rounded-md items-center text-base font-medium text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200">
          <i class="fa-duotone fa-receipt mr-3 text-lg"></i> Pedidos
        </RouterLink>
        <RouterLink @click="closeMobileMenu" to="/admin/products" active-class="bg-gray-700 text-white"
          class="flex w-full text-left px-3 py-2 rounded-md items-center text-base font-medium text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200">
          <i class="fa-duotone fa-box-open mr-3 text-lg"></i> Produtos
        </RouterLink>
        <RouterLink @click="closeMobileMenu" to="/admin/categories" active-class="bg-gray-700 text-white"
          class="flex w-full text-left px-3 py-2 rounded-md items-center text-base font-medium text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200">
          <i class="fa-duotone fa-tags mr-3 text-lg"></i> Categorias
        </RouterLink>
        <RouterLink @click="closeMobileMenu" to="/admin/whatsapp-qr" active-class="bg-gray-700 text-white"
          class="flex w-full text-left px-3 py-2 rounded-md items-center text-base font-medium text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200">
          <i class="fab fa-whatsapp mr-3 text-lg"></i> WhatsApp QR
        </RouterLink>
        <RouterLink @click="closeMobileMenu" to="/admin/settings" active-class="bg-gray-700 text-white"
          class="flex w-full text-left px-3 py-2 rounded-md items-center text-base font-medium text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200">
          <i class="fa-duotone fa-tools mr-3 text-lg"></i> Configurações
        </RouterLink>
        <Divider class="border-b-gray-900/30" />
        <RouterLink @click="closeMobileMenu" to="/admin/manage-users" active-class="bg-gray-700 text-white"
          class="flex w-full text-left px-3 py-2 rounded-md items-center text-base font-medium text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200">
          <i class="fa-duotone fa-users-gear mr-3 text-lg"></i> Gerenciar Usuários
        </RouterLink>
        <RouterLink @click="closeMobileMenu" to="/admin/reports" active-class="bg-gray-700 text-white"
          class="flex w-full text-left px-3 py-2 rounded-md items-center text-base font-medium text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200">
          <i class="fa-duotone fa-chart-pie mr-3 text-lg"></i> Relatórios
        </RouterLink>
      </nav>
    </aside>
  </transition>
</template>

<script setup>
import Divider from "../Divider.vue";

// Define as props que este componente pode receber
const props = defineProps({
  mobileMenuOpen: {
    type: Boolean,
    default: false,
  },
  shortMenu: {
    type: Boolean,
    default: false,
  }
});

// Define os eventos que este componente pode emitir
const emit = defineEmits(["toggle-mobile-menu", "toggle-short-menu"]);

const closeMobileMenu = () => {
  emit("toggle-mobile-menu");
};

const toggleShortMenu = () => {
  emit("toggle-short-menu");
};
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  translate: 0 0;
}

.slide-enter-from,
.slide-leave-to {
  translate: -100% 0;
}

/* Customização do scrollbar para o menu */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgb(75 85 99 / 0.5);
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgb(75 85 99 / 0.8);
}
</style>