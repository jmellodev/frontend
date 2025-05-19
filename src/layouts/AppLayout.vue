<template>
  <div
    class="startingA:opacity-0 transitionA-all durationA-1000 bg-gray-100 dark:bg-gray-700"
  >
    <Header :title="title" :background="background" />
    <Topnav :title="topNavTitle" :showBackButton="showBackButton" />

    <main class="py-4 px-0 h-auto pb-16 md:pb-0 pt-20 m-auto">
      <slot />
    </main>

    <MenuMobile v-if="mobileMenuVisible" />
  </div>
</template>

<script setup>
import Header from "@/components/Header.vue";
import MenuMobile from "@/components/MenuMobile.vue";
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
    default: "Pizzaria da Nonna",
  },
  showBackButton: {
    type: Boolean,
    default: true,
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
