<template>
  <div>
    <NewHader :title="topNavTitle" :showBackButton="showBackButton" />
    <main class="py-4 h-auto pb-16 md:pb-0 pt-20 m-auto">
      <slot />
    </main>
    <MenuMobile v-if="props.mobileMenuVisible" />
  </div>
</template>

<script setup>
import MenuMobile from "@/components/MenuMobile.vue";
import NewHader from "@/components/NewHader.vue"; // Importe NewHader aqui

const props = defineProps({
  isHeaderVisible: {
    type: Boolean,
    default: true,
  },
  // Mantenha props como title e showBackButton se elas forem genéricas para o layout
  title: {
    type: String,
    default: "Pizzaria da Nonna",
  },
  topNavVisible: { // Se topNavVisible ainda for uma prop usada em AppLayout
    type: Boolean,
    default: false,
  },
  topNavTitle: { // Passado para NewHeader
    type: String,
    default: "Pizzaria da Nonna",
  },
  showBackButton: { // Passado para NewHeader
    type: Boolean,
    default: true,
  },
  mobileMenuVisible: {
    type: Boolean,
    default: true,
  },
});
</script>