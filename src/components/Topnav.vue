<template>
  <div
    class="py-2 px-4 bg-gray-50 shadow dark:bg-gray-700 flex justify-between items-center fixed md:hidden top-0 w-full z-50"
  >
    <a v-if="showBackButton" @click.prevent="goBack" class="flex-none">
      <i class="fa fa-arrow-left text-gray-400 text-md"></i>
    </a>
    <div v-else>
      <img src="../assets/image/old_nonna.png" alt="logo" class="h-16 w-20 mr-2" />
    </div>
    <span
      v-if="showBackButton"
      class="dark:text-white ml-4 truncate flex justify-center items-center title-font p-2"
    >
      {{ title }}
    </span>
    <img
      v-else
      src="../assets/image/logo.png"
      alt="Pizzaria da Nonna"
      class="object-contain h-14 w-full"
    />
    <div class="flex-none">
      <ThemeToggle />
      <IconCart :cart-count="cartCount" />
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import IconCart from "./icons/IconCart.vue";
import { useCartStore } from "@/stores/cartStore";
import IconFavorite from "./icons/IconFavorite.vue";
import router from "@/router";
import ThemeToggle from "./ThemeToggle.vue";

const cartStore = useCartStore();
const cartCount = computed(() => cartStore.items.length);

const goBack = () => router.back();

defineProps({
  title: {
    type: String,
    required: false,
    default: "Topnav mobile",
  },
  showBackButton: {
    type: Boolean,
    default: true,
  },
});
</script>
<style scoped>
.title-font {
  font-family: "Lora", serif;
  font-style: italic;
}
</style>
