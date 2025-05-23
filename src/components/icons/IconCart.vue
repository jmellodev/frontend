<template>
  <router-link to="/carrinho" class="relative text-md p-2">
    <i class="fa-solid fa-cart-shopping text-gray-600 dark:text-gray-300 hover:cursor-pointer"></i>
    <span v-if="cartCount"
      class="absolute top-0 border-red-400 border-2 -right-0 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
      {{ cartCount }}
    </span>
  </router-link>
</template>

<script setup>
defineProps({
  cartCount: {
    type: Number,
    default: 0,
  },
});
</script>
