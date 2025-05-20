<script setup>
import { useFavoriteStore } from "@/stores/favoritesStore";
const favoriteStore = useFavoriteStore();

const props = defineProps({
  product: {
    type: Object,
    // required: false, // Já alterado para false
  },
});

const toggle = () => {
  if (props.product) {
    favoriteStore.toggleFavorite(props.product);
  } else {
    console.warn("Tentativa de adicionar/remover favorito sem um produto.");
    // Adicione alguma lógica de fallback ou tratamento de erro, se necessário
  }
};

const isFav = () => {
  return props.product && favoriteStore.isFavorite(props.product.id);
};
</script>

<template>
  <button @click="toggle" class="rounded-full h-6 w-6 border border-gray-400/50">
    <i
      :class="isFav() ? 'fas fa-heart text-red-500' : 'fas fa-heart text-gray-400'"
      class="hover:text-red-500"
    ></i>
  </button>
</template>
