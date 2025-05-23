<template>
  <div
    class="py-2 px-4 bg-gray-50 shadow dark:bg-gray-700 flex justify-between items-center fixed md:hidden top-0 w-full z-50">
    <a v-if="showBackButton" @click.prevent="goBack" class="flex-none">
      <i class="fa fa-arrow-left text-gray-400 text-md"></i>
    </a>
    <div v-else>

      <button class="md:hidden p-2 text-gray-600 relative">
        <i @click="toggleMobileMenu" class="h-4"
          :class="['fas text-sm', isMobileMenuOpen ? 'fa-xmark' : 'fa-bars']"></i>
        <!-- Menu mobile -->
        <div
          class="absolute group-hover:translate-x-2 transition-all duration-200 ease-in-out z-50 p-2 dark:bg-gray-700 rounded-md -top-2 -left-5 h-screen flex flex-col space-y-2"
          :class="[isMobileMenuOpen ? 'translate-x-0  bg-white' : '-translate-x-full']">
          <div class="flex-row-reverse flex  h-4 w-full">
            <i @click="toggleMobileMenu" class="fas text-xl fa-xmark "></i>
          </div>


          <ul class="flex flex-col space-y-2 w-max items-start">
            <li @click="[selectCategory(null), isMobileMenuOpen = false]"
              class="flex p-2 whitespace-nowrap hover:bg-gray-800/50">Vert todas</li>
            <li v-for="parent in parentCategories" :key="parent.id"
              class="flex flex-col p-2 whitespace-nowrap hover:bg-gray-800/50 items-start">
              <span class="mb-2 font-medium"><i :class="parent.icon"></i>
                {{ parent.name }}</span>
              <ul v-if="childCategories[parent.id]?.length > 0" class="grid grid-cols-2 ml-2 gap-y-2 gap-x-3">
                <li class="flex" v-for="child in childCategories[parent.id]" :key="child.id"
                  @click="[selectCategory(child.id), isMobileMenuOpen = false]"><span><i :class="child.icon"></i> {{
                    child.name }}</span></li>
              </ul>
            </li>
          </ul>
        </div>

      </button>
    </div>
    <div v-if="isMobileMenuOpen" class="bg-black/50 backdrop-blur-sm w-screen h-screen z-20 top-0 left-0 absolute">
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

const isMobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
  console.log(isMobileMenuOpen.value)
};

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
</style>
