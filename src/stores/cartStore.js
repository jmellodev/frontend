import { defineStore } from "pinia"
import { computed, ref, watch } from "vue"

export const useCartStore = defineStore('cart', () => {
  const items = ref(JSON.parse(localStorage.getItem('cart_items') || '[]'))

  function addItem(item) {
    if (!item || !item.id) {
      console.warn('Tentativa de adicionar item inválido:', item)
      return
    }

    const existing = items.value.find(i =>
      i.id === item.id &&
      i.size === item.size &&
      areExtrasEqual(i.extras, item.extras)
    )

    if (existing) {
      existing.quantity += item.quantity
    } else {
      items.value.push({
        ...item,
        subtotal: (item.price + item.extras.reduce((acc, extra) => acc + extra.price, 0))
      })
    }
  }

  function removeItem(item) {
    console.log('Removendo item:', item)

    const index = items.value.findIndex(i =>
      i.id === item.id &&
      i.size === item.size &&
      areExtrasEqual(i.extras, item.extras)
    )

    if (index !== -1) {
      items.value.splice(index, 1)
      console.log('Item removido com sucesso!')
    } else {
      console.warn('Item para remover não encontrado.')
    }
  }

  function clearCart() {
    items.value = []
  }

  function areExtrasEqual(a, b) {
    if (a.length !== b.length) return false

    const sortedA = [...a].sort((x, y) => x.name.localeCompare(y.name))
    const sortedB = [...b].sort((x, y) => x.name.localeCompare(y.name))

    return sortedA.every((extra, index) =>
      extra.name === sortedB[index].name && extra.price === sortedB[index].price
    )
  }

  // Total recalculado automaticamente sempre que items muda
  const total = computed(() => {
    return items.value.reduce((total, item) => {
      return total + (item.price + item.extras.reduce((acc, extra) => acc + extra.price, 0)) * item.quantity
    }, 0)
  })

  watch(items, (newItems) => {
    localStorage.setItem('cart_items', JSON.stringify(newItems))
  }, { deep: true })

  return {
    items,
    addItem,
    removeItem,
    clearCart,
    total,
  }
})