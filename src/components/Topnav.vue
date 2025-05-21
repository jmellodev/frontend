<template>
  <div
    class="py-2 px-4 bg-gray-50 shadow dark:bg-gray-700 flex justify-between items-center fixed md:hidden top-0 w-full z-50">
    <a v-if="showBackButton" @click.prevent="goBack" class="flex-none">
      <i class="fa fa-arrow-left text-gray-400 text-md"></i>
    </a>
    <div v-else>
      <button @click="toggleMenu" class="md:hidden p-2 text-gray-600 relative">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>

        <!-- Menu mobile -->
        <Transition name="fade-slide">
          <div class="">
            <div v-if="open"
              class="lg:hidden px-4 py-2 space-y-2 flex flex-col z-30 bg-white shadow-md rounded-md absolute top-0 left-0 w-64">
              <!-- Ícone de fechar -->
              <div class="flex justify-end">
                <button @click="open = false" class="p-2 text-gray-600 hover:text-black">
                  <i class="w-6 h-6 fa fa-xmark"></i>
                </button>
              </div>

              <button @click="selectCategory(null)" :class="[
                'block text-left w-full px-2 py-1 rounded-md font-medium',
                selectedCategoryIds === null
                  ? 'text-black font-bold bg-gray-200'
                  : 'text-gray-600 hover:text-black hover:bg-gray-100',
              ]">
                Home
              </button>

              <div v-for="parent in parentCategories" :key="parent.id">
                <div @click="selectCategory(parent.id, true)" class="font-semibold text-gray-800">
                  <i :class="parent.icon"></i>
                  {{ parent.name }}
                </div>
                <div class="ml-4 space-y-1">
                  <button v-for="child in childCategories[parent.id]" :key="child.id"
                    @click="selectCategory(child.id, true)" :class="[
                      'block text-left w-full px-2 py-1 rounded-md',
                      selectedCategoryIds?.includes(child.id)
                        ? 'text-black font-bold bg-gray-200'
                        : 'text-gray-600 hover:text-black hover:bg-gray-100',
                    ]">
                    {{ child.name }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </button>
    </div>
    <span v-if="showBackButton" class="dark:text-white ml-4 truncate flex justify-center items-center title-font p-2">
      {{ title }}
    </span>
    <img v-else src="../assets/image/logo.png" alt="Pizzaria da Nonna" class="object-contain h-10 w-full" />
    <div class="flex-none">
      <ThemeToggle />
      <IconCart :cart-count="cartCount" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import IconCart from "./icons/IconCart.vue";
import ThemeToggle from "./ThemeToggle.vue";
import { useCartStore } from "@/stores/cartStore";
import { useCategories } from "@/composables/useCategories";

// Props
const props = defineProps({
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

// Emit
const emit = defineEmits(["categorySelected"]);

// Controle de categorias
const selectedCategoryIds = ref(null);
const {
  open,
  toggleMenu,
  parentCategories,
  childCategories,
  selectCategory,
  isSelected,
} = useCategories(emit, selectedCategoryIds);

// Carrinho
const cartStore = useCartStore();
const cartCount = computed(() => cartStore.items.length);

// Função de navegação (se usada)
function goBack() {
  window.history.back();
}
</script>
<style scoped>
.title-font {
  font-family: "Lora", serif;
  font-style: italic;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
