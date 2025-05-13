import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export const useFavoriteStore = defineStore('favorite', () => {
  const favorites = ref(JSON.parse(localStorage.getItem('favorites') || '[]'))

  function toggleFavorite(product) {
    const index = favorites.value.findIndex(fav => fav.id === product.id)

    if (index !== -1) {
      favorites.value.splice(index, 1)
    } else {
      favorites.value.push(product)
    }
  }

  function isFavorite(productId) {
    return favorites.value.some(fav => fav.id === productId)
  }

  function clearFavorites() {
    favorites.value = []
  }

  // Atualiza o localStorage sempre que favorites mudar
  watch(favorites, newVal => {
    localStorage.setItem('favorites', JSON.stringify(newVal))
  }, { deep: true })

  const count = computed(() => favorites.value.length)

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    count,
  }
})
