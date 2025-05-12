<template>
  <Header
    :title="title"
    :showBackButton="showBackButton"
    v-if="isHeaderVisible"
    :background="background"
  />

  <main class="p-4 h-auto pt-20 m-auto">
    <slot />
  </main>

  <MenuMobile v-if="mobileMenuVisible" />
</template>

<script setup>
import Header from "@/components/Header.vue";
import MenuMobile from "@/components/MenuMobile.vue";
import Sidebar from "@/components/Sidebar.vue";

defineProps({
  isHeaderVisible: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
    default: "Pizzaria da Nonna",
  },
  showBackButton: {
    type: Boolean,
    default: false,
  },
  mobileMenuVisible: {
    type: Boolean,
    default: true,
  },
  background: {
    type: String,
    default: new URL("../assets/image/bg_header.jpg", import.meta.url).href,
    required: false,
  },
});
</script>
