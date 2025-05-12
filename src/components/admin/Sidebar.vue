<template>
  <nav class="space-y-3">
    <RouterLink
      to="/admin"
      active-class="bg-gray-700"
      class="flex w-full text-left px-3 py-2 rounded items-center p-2 text-base font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
    >
      <i class="fas fa-chart-line mr-3"></i> Dashboard
    </RouterLink>
    <RouterLink
      to="/admin/orders"
      active-class="bg-gray-700"
      class="flex w-full text-left px-3 py-2 rounded items-center p-2 text-base font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
    >
      <i class="fas fa-receipt mr-3"></i> Pedidos
    </RouterLink>
    <RouterLink
      to="/admin/products"
      active-class="bg-gray-700"
      class="flex w-full text-left px-3 py-2 rounded items-center p-2 text-base font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
    >
      <i class="fas fa-box-open mr-3"></i> Produtos
    </RouterLink>
    <RouterLink
      to="/admin/categories"
      active-class="bg-gray-700"
      class="flex w-full text-left px-3 py-2 rounded items-center p-2 text-base font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
    >
      <i class="fas fa-tags mr-3"></i> Categorias
    </RouterLink>
    <RouterLink
      to="/admin/settings"
      active-class="bg-gray-700"
      class="flex w-full text-left px-3 py-2 rounded items-center p-2 text-base font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
    >
      <i class="fas fa-tools mr-3"></i> Configurações
    </RouterLink>
  </nav>

  <transition name="fade">
    <aside v-if="mobileMenu" class="fixed inset-0 bg-gray-800 p-6 z-40 md:hidden">
      <button @click="toggleMobileMenu" class="mb-6 text-white">✕</button>
      <nav class="space-y-3">
        <RouterLink
          @click="toggleMobileMenu"
          to="/admin"
          active-class="bg-gray-700"
          class="flex w-full text-left px-3 py-2 rounded items-center p-2 text-base font-medium text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
        >
          <i class="fas fa-chart-line mr-3"></i> Dashboard
        </RouterLink>
        <RouterLink
          @click="toggleMobileMenu"
          to="/admin/orders"
          active-class="bg-gray-700"
          class="flex w-full text-left px-3 py-2 rounded items-center p-2 text-base font-medium text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
        >
          <i class="fas fa-receipt mr-3"></i> Pedidos
        </RouterLink>
        <RouterLink
          @click="toggleMobileMenu"
          to="/admin/products"
          active-class="bg-gray-700"
          class="flex w-full text-left px-3 py-2 rounded items-center p-2 text-base font-medium text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
        >
          <i class="fas fa-box-open mr-3"></i> Produtos
        </RouterLink>
        <RouterLink
          @click="toggleMobileMenu"
          to="/admin/categories"
          active-class="bg-gray-700"
          class="flex w-full text-left px-3 py-2 rounded items-center p-2 text-base font-medium text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
        >
          <i class="fas fa-tags mr-3"></i> Categorias
        </RouterLink>
        <RouterLink
          @click="toggleMobileMenu"
          to="/admin/settings"
          active-class="bg-gray-700"
          class="flex w-full text-left px-3 py-2 rounded items-center p-2 text-base font-medium text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
        >
          <i class="fas fa-tools mr-3"></i> Configurações
        </RouterLink>
      </nav>
    </aside>
  </transition>
</template>
<script setup>
import { ref } from "vue";

const mobileMenu = ref(false);
const toggleMobileMenu = () => {
  mobileMenu.value = !mobileMenu.value;
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
