<template>
  <AppLayout :top-nav-visible="true" :is-header-visible="false" top-nav-title="Favoritos">
    <div class="container mx-auto p-4">
      <h2 class="text-2xl font-semibold mb-4 dark:text-gray-200">
        Meus Favoritos ({{ favCount }})
      </h2>

      <div v-if="favCount === 0" class="text-gray-500 dark:text-gray-400">
        Sua lista de favoritos está vazia. Adicione produtos clicando no ícone de coração!
      </div>

      <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <ProductCard v-for="product in favorites" :key="product.id" :product="product" />
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import AppLayout from "@/layouts/AppLayout.vue";
import ProductCard from "@/components/ProductCard.vue"; // Importe o ProductCard
import { useFavoriteStore } from "@/stores/favoritesStore";
import { computed } from "vue";

const favoritesStore = useFavoriteStore();
const favorites = computed(() => favoritesStore.favorites); // Acesse a lista de favoritos
const favCount = computed(() => favorites.value.length); // Calcule o número de favoritos
</script>

<style scoped>
/* Adicione estilos específicos para esta página, se necessário */
</style>
