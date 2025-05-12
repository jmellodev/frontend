<template>
  <div
    class="md:translate-20 transition-all -translate-y-2 fixed bottom-0 left-2 right-2 rounded-full bg-gray-200/30 border-t border-gray-200/50 dark:bg-gray-900/30 dark:border-gray-700 shadow-md z-50 backdrop-blur-md"
  >
    <nav class="flex justify-around p-3 text-gray-700 dark:text-gray-300 relative">
      <RouterLink
        to="/"
        class="flex flex-col items-center"
        :class="{ 'text-indigo-500 dark:text-emerald-400': isActive('/') }"
      >
        <i class="fas fa-home text-sm"></i>
        <span class="text-xs mt-1">Início</span>
      </RouterLink>

      <RouterLink
        to="/carrinho"
        class="flex flex-col items-center relative"
        :class="{ 'text-indigo-500 dark:text-emerald-400': isActive('/carrinho') }"
      >
        <i class="fas fa-shopping-cart text-sm"></i>
        <span class="text-xs mt-1">Carrinho</span>
        <span
          v-if="cartCount > 0"
          :class="[
            'absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full px-1.5 py-0.5 font-semibold',
            bounce ? 'animate-bounce' : '',
          ]"
        >
          {{ cartCount }}
        </span>
      </RouterLink>

      <RouterLink
        to="/favoritos"
        class="flex flex-col items-center"
        :class="{ 'text-indigo-500 dark:text-emerald-400': isActive('/favoritos') }"
      >
        <i class="fas fa-heart text-sm"></i>
        <span class="text-xs mt-1">Favoritos</span>
      </RouterLink>

      <RouterLink
        to="/perfil"
        class="flex flex-col items-center"
        :class="{ 'text-indigo-500 dark:text-emerald-400': isActive('/perfil') }"
      >
        <i class="fas fa-user text-sm"></i>
        <span class="text-xs mt-1">Perfil</span>
      </RouterLink>
    </nav>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { useCartStore } from "@/stores/cartStore";
import { computed, ref, watch } from "vue";

const route = useRoute();
const bounce = ref(false);
const isActive = (path) => route.path === path;

const cartStore = useCartStore();
const cartCount = computed(() => cartStore.items.length);

watch(cartCount, (newValue, oldValue) => {
  if (newValue > oldValue) {
    bounce.value = true;
    setTimeout(() => {
      bounce.value = false;
    }, 500);
  }
});
</script>
