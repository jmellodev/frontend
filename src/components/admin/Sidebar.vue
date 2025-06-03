<template>
  <nav class="hidden md:block w-64 bg-gray-800 dark:bg-gray-800 p-4 min-h-screen shadow-lg fixed top-14">
    <div class="space-y-3">
      <RouterLink to="/admin" active-class="bg-gray-700 text-white"
        class="flex w-full text-left px-3 py-2 rounded-md items-center text-base font-medium text-gray-400 hover:bg-gray-700 dark:hover:bg-gray-700 transition-colors duration-200">
        <i class="fa-duotone fa-chart-line mr-3 text-lg"></i> Dashboard
      </RouterLink>
      <RouterLink to="/admin/orders" active-class="bg-gray-700 text-white"
        class="flex w-full text-left px-3 py-2 rounded-md items-center text-base font-medium text-gray-400 hover:bg-gray-700 dark:hover:bg-gray-700 transition-colors duration-200">
        <i class="fa-duotone fa-receipt mr-3 text-lg"></i> Pedidos
      </RouterLink>
      <RouterLink to="/admin/products" active-class="bg-gray-700 text-white"
        class="flex w-full text-left px-3 py-2 rounded-md items-center text-base font-medium text-gray-400 hover:bg-gray-700 dark:hover:bg-gray-700 transition-colors duration-200">
        <i class="fa-duotone fa-box-open mr-3 text-lg"></i> Produtos
      </RouterLink>
      <RouterLink to="/admin/categories" active-class="bg-gray-700 text-white"
        class="flex w-full text-left px-3 py-2 rounded-md items-center text-base font-medium text-gray-400 hover:bg-gray-700 dark:hover:bg-gray-700 transition-colors duration-200">
        <i class="fa-duotone fa-tags mr-3 text-lg"></i> Categorias
      </RouterLink>
      <RouterLink to="/admin/whatsapp-qr" active-class="bg-gray-700 text-white"
        class="flex w-full text-left px-3 py-2 rounded-md items-center text-base font-medium text-gray-400 hover:bg-gray-700 dark:hover:bg-gray-700 transition-colors duration-200">
        <i class="fab fa-whatsapp mr-3 text-lg"></i> Conectar WhatsApp
      </RouterLink>
      <RouterLink to="/admin/settings" active-class="bg-gray-700 text-white"
        class="flex w-full text-left px-3 py-2 rounded-md items-center text-base font-medium text-gray-400 hover:bg-gray-700 dark:hover:bg-gray-700 transition-colors duration-200">
        <i class="fa-duotone fa-tools mr-3 text-lg"></i> Configurações
      </RouterLink>
      <RouterLink to="/admin/manage-users" active-class="bg-gray-700 text-white"
        class="flex w-full text-left px-3 py-2 rounded-md items-center text-base font-medium text-gray-400 hover:bg-gray-700 dark:hover:bg-gray-700 transition-colors duration-200">
        <i class="fa-duotone fa-users-gear mr-3 text-lg"></i> Gerenciar Usuários
      </RouterLink>
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
      </nav>
    </aside>
  </transition>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";
import Divider from "../Divider.vue";

// Define as props que este componente pode receber
const props = defineProps({
  mobileMenuOpen: {
    type: Boolean,
    default: false,
  },
});

// Define os eventos que este componente pode emitir
const emit = defineEmits(["toggle-mobile-menu"]);

const closeMobileMenu = () => {
  emit("toggle-mobile-menu"); // Emite o evento para o pai fechar o menu
};
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  /* transition: opacity 0.3s ease; */
  translate: 0 0;
}

.slide-enter-from,
.slide-leave-to {
  /* opacity: 0; */
  translate: -100% 0;
}
</style>
