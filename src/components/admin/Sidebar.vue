<template>
  <nav class="hidden md:block w-64 bg-gray-800 p-4 text-white min-h-screen shadow-lg">
    <div class="space-y-3">
      <RouterLink to="/admin" active-class="bg-gray-700 text-white"
        class="flex w-full text-left px-3 py-2 rounded-md items-center text-base font-medium text-gray-300 hover:bg-gray-700 transition-colors duration-200">
        <i class="fas fa-chart-line mr-3 text-lg"></i> Dashboard
      </RouterLink>
      <RouterLink to="/admin/orders" active-class="bg-gray-700 text-white"
        class="flex w-full text-left px-3 py-2 rounded-md items-center text-base font-medium text-gray-300 hover:bg-gray-700 transition-colors duration-200">
        <i class="fas fa-receipt mr-3 text-lg"></i> Pedidos
      </RouterLink>
      <RouterLink to="/admin/products" active-class="bg-gray-700 text-white"
        class="flex w-full text-left px-3 py-2 rounded-md items-center text-base font-medium text-gray-300 hover:bg-gray-700 transition-colors duration-200">
        <i class="fas fa-box-open mr-3 text-lg"></i> Produtos
      </RouterLink>
      <RouterLink to="/admin/categories" active-class="bg-gray-700 text-white"
        class="flex w-full text-left px-3 py-2 rounded-md items-center text-base font-medium text-gray-300 hover:bg-gray-700 transition-colors duration-200">
        <i class="fas fa-tags mr-3 text-lg"></i> Categorias
      </RouterLink>
      <RouterLink to="/admin/whatsapp-qr" active-class="bg-gray-700 text-white"
        class="flex w-full text-left px-3 py-2 rounded-md items-center text-base font-medium text-gray-300 hover:bg-gray-700 transition-colors duration-200">
        <i class="fab fa-whatsapp mr-3 text-lg"></i> WhatsApp QR
      </RouterLink>
      <RouterLink to="/admin/settings" active-class="bg-gray-700 text-white"
        class="flex w-full text-left px-3 py-2 rounded-md items-center text-base font-medium text-gray-300 hover:bg-gray-700 transition-colors duration-200">
        <i class="fas fa-tools mr-3 text-lg"></i> Configurações
      </RouterLink>
    </div>
  </nav>

  <transition name="fade">
    <aside v-if="mobileMenuOpen" class="fixed inset-0 bg-gray-900 p-6 z-50 md:hidden flex flex-col">
      <div class="flex justify-end mb-6">
        <button @click="closeMobileMenu" class="text-white text-3xl">
          &times;
        </button>
      </div>
      <nav class="space-y-3 flex-grow">
        <RouterLink @click="closeMobileMenu" to="/admin" active-class="bg-gray-700 text-white"
          class="flex w-full text-left px-3 py-2 rounded-md items-center text-base font-medium text-white hover:bg-gray-700 group transition-colors duration-200">
          <i class="fas fa-chart-line mr-3 text-lg"></i> Dashboard
        </RouterLink>
        <RouterLink @click="closeMobileMenu" to="/admin/orders" active-class="bg-gray-700 text-white"
          class="flex w-full text-left px-3 py-2 rounded-md items-center text-base font-medium text-white hover:bg-gray-700 group transition-colors duration-200">
          <i class="fas fa-receipt mr-3 text-lg"></i> Pedidos
        </RouterLink>
        <RouterLink @click="closeMobileMenu" to="/admin/products" active-class="bg-gray-700 text-white"
          class="flex w-full text-left px-3 py-2 rounded-md items-center text-base font-medium text-white hover:bg-gray-700 group transition-colors duration-200">
          <i class="fas fa-box-open mr-3 text-lg"></i> Produtos
        </RouterLink>
        <RouterLink @click="closeMobileMenu" to="/admin/categories" active-class="bg-gray-700 text-white"
          class="flex w-full text-left px-3 py-2 rounded-md items-center text-base font-medium text-white hover:bg-gray-700 group transition-colors duration-200">
          <i class="fas fa-tags mr-3 text-lg"></i> Categorias
        </RouterLink>
        <RouterLink @click="closeMobileMenu" to="/admin/whatsapp-qr" active-class="bg-gray-700 text-white"
          class="flex w-full text-left px-3 py-2 rounded-md items-center text-base font-medium text-white hover:bg-gray-700 group transition-colors duration-200">
          <i class="fab fa-whatsapp mr-3 text-lg"></i> WhatsApp QR
        </RouterLink>
        <RouterLink @click="closeMobileMenu" to="/admin/settings" active-class="bg-gray-700 text-white"
          class="flex w-full text-left px-3 py-2 rounded-md items-center text-base font-medium text-white hover:bg-gray-700 group transition-colors duration-200">
          <i class="fas fa-tools mr-3 text-lg"></i> Configurações
        </RouterLink>
      </nav>
    </aside>
  </transition>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
