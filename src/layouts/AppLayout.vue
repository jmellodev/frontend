<template>
  <Header
    :title="title"
    :showBackButton="showBackButton"
    v-if="isHeaderVisible"
    :background="background"
  />
  <Topnav :title="topNavTitle" v-if="topNavVisible" />

  <main class="py-4 px-0 h-auto pb-16 md:pb-0 pt-20 m-auto">
    <slot />
  </main>

  <MenuMobile v-if="mobileMenuVisible" />
</template>

<script setup>
import Header from "@/components/Header.vue";
import MenuMobile from "@/components/MenuMobile.vue";
import Sidebar from "@/components/Sidebar.vue";
import Topnav from "@/components/Topnav.vue";

defineProps({
  isHeaderVisible: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
    default: "Pizzaria da Nonna",
  },
  topNavVisible: {
    type: Boolean,
    default: false,
  },
  topNavTitle: {
    type: String,
    default: "Topnav",
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
