<template>
  <div
    class="p-4 bg-gray-50 shadow dark:bg-gray-700 flex justify-between items-center fixed md:hidden top-0 w-full z-50"
  >
    <router-link class="p-1 flex-none" to="/">
      <i class="fa fa-arrow-left text-gray-400 text-md"></i>
    </router-link>
    <span class="dark:text-white ml-4 truncate flex-1">{{ title }}</span>
    <div class="flex-none">
      <IconCart :cart-count="cartCount" />
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import IconCart from "./icons/IconCart.vue";
import { useCartStore } from "@/stores/cartStore";
import IconFavorite from "./icons/IconFavorite.vue";

const cartStore = useCartStore();
const cartCount = computed(() => cartStore.items.length);

defineProps({
  title: {
    type: String,
    required: false,
    default: "Topnav mobile",
  },
});
</script>
