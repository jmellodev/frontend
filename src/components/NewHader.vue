<template>
  <header class=" bg-red-400 fixed top-0 w-full z-50">
    <!-- Menu top -->
    <nav class="relative px-4 hidden md:block">
      <div class="container mx-auto flex justify-between items-center">
        <div class="text-white text-2xl font-bold">Pizzaria da Nonna</div>
        <ul class="space-x-6 text-white flex">
          <li @click="handleCategorySelection(null)" class="py-4">
            <span :class="[
              'cursor-pointer whitespace-nowrap',
              selectedCategoryIdsRef === null || (selectedCategoryIdsRef && selectedCategoryIdsRef.length === 0)
                ? 'text-yellow-300'
                : '',
            ]"><i class="fa fa-list"></i> Todas</span>
          </li>
          <li class="group flex relative py-4" v-for="parent in parentCategories" :key="parent.id">
            <span @click="handleCategorySelection(parent.id, true)" :class="[
              'cursor-pointer whitespace-nowrap ',
              isSelected([
                parent.id,
                ...(childCategories[parent.id]?.map((c) => c.id) || []),
              ])
                ? 'text-yellow-300'
                : 'group-hover:text-yellow-300',
            ]">
              <i :class="parent.icon"></i>
              {{ parent.name }}
            </span>
            <i class="fa-solid fa-chevron-down fa-2xs pt-3 ml-1 group-hover:rotate-180 group-hover:text-yellow-300 transition duration-200 ease-in-out"
              v-if="childCategories[parent.id]?.length > 0"></i>
            <ul v-if="childCategories[parent.id]?.length > 0"
              class="absolute bg-white p-3 w-52 top-12 transform scale-0 group-hover:scale-100 transition duration-150 ease-in-out origin-top shadow-lg rounded-md">
              <li v-for="child in childCategories[parent.id]" :key="child.id" @click="handleCategorySelection(child.id)"
                :class="[
                  'cursor-pointer p-1 whitespace-nowrap rounded-md text-gray-600 hover:text-red-400 hover:bg-gray-300',
                  selectedCategoryIdsRef?.includes(child.id)
                    ? 'text-red-400 font-bold bg-gray-200'
                    : 'text-gray-600 hover:text-red-400 hover:bg-gray-300',
                ]">
                <span><i :class="child.icon"></i> {{ child.name }}</span>
              </li>
            </ul>
          </li>
          <li class="py-4"><a href="#contact" class="hover:text-yellow-300">Contato</a></li>
        </ul>
        <div class="flex space-x-2">
          <!-- <ThemeToggle /> -->
          <IconCart :cart-count="cartCount" />
        </div>
      </div>
    </nav>

    <!-- Mobile menu -->
    <div class="py-2 px-4 bg-gray-50 dark:bg-gray-800 flex justify-between items-center md:hidden w-screen">
      <button type="button" name="goback" v-if="showBackButton" @click.prevent="goBack" class="flex-none">
        <i class="fa fa-arrow-left text-gray-400 dark:text-gray-200 text-md"></i>
      </button>

      <div v-else>
        <button type="button" name="mobile-menu" class="p-2 text-gray-600 dark:text-gray-300 text-sm relative">
          <i @click="toggleMobileMenu" class="h-4 fas text-sm" :class="[isMobileMenuOpen ? 'fa-xmark' : 'fa-bars']"></i>
          <div
            class="absolute group-hover:translate-x-2 transition-all duration-200 ease-in-out z-50 p-2 dark:bg-gray-700 rounded-md -top-2 -left-5 h-screen flex flex-col space-y-2"
            :class="[isMobileMenuOpen ? 'translate-x-0 bg-white' : '-translate-x-full']">
            <div class="flex-row-reverse flex h-4 w-full">
              <i @click="toggleMobileMenu" class="fas text-xl fa-xmark "></i>
            </div>
            <ul class="flex flex-col w-48 items-start">
              <li @click="handleCategorySelectionAndCloseMenu(null)"
                class="flex space-x-2 items-center w-full p-2 text-sm hover:bg-gray-400/30 hover:rounded-md cursor-pointer whitespace-nowrap"
                :class="[
                  selectedCategoryIdsRef === null || (selectedCategoryIdsRef && selectedCategoryIdsRef.length === 0)
                    ? 'text-red-400 bg-gray-400/30 rounded-md'
                    : '',
                ]">
                <i class="fa fa-list"></i> <span>Ver tudo</span>
              </li>
              <li v-for="parent in parentCategories" :key="parent.id"
                class="flex flex-col w-full mt-1 whitespace-nowrap group" :class="[
                  'cursor-pointer whitespace-nowrap ',
                  isSelected([
                    parent.id,
                    ...(childCategories[parent.id]?.map((c) => c.id) || []),
                  ])
                    ? 'text-red-400 group-hover:bg-pink-400'
                    : 'group-hover:text-red-400',
                ]">

                <span
                  class="flex space-x-1 items-center w-full p-2 text-sm hover:bg-gray-400/30 hover:rounded-md cursor-pointer whitespace-nowrap"
                  @click="handleCategorySelectionAndCloseMenu(parent.id, true)">
                  <i :class="['text-xs text-gray-400', parent.icon]"></i>
                  <span>{{ parent.name }}</span>
                </span>
                <ul v-if="childCategories[parent.id]?.length > 0" class="ml-3">
                  <li :class="[
                    'cursor-pointer p-2 whitespace-nowrap rounded-md flex justify-start mb-1 w-full',
                    selectedCategoryIdsRef?.includes(child.id)
                      ? 'text-red-400  bg-gray-400/30'
                      : 'text-gray-600 dark:text-gray-100 hover:text-red-400 hover:bg-gray-400/30 ',
                  ]" v-for="child in childCategories[parent.id]" :key="child.id"
                    @click="handleCategorySelectionAndCloseMenu(child.id)">
                    <span><i :class="['text-xs text-gray-400', child.icon]"></i> {{ child.name }}</span>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </button>
      </div>

      <div v-if="isMobileMenuOpen" @click="toggleMobileMenu"
        class="bg-black/50 backdrop-blur-sm w-screen h-screen z-20 top-0 left-0 absolute">
      </div>

      <span v-if="showBackButton" class="dark:text-white ml-4 truncate flex justify-center items-center title-font p-2">
        {{ title }}
      </span>
      <img v-else src="../assets/image/logo.png" alt="Pizzaria da Nonna" class="object-contain h-10 w-full" />

      <div class="flex-none">
        <!-- <ThemeToggle /> -->
        <IconCart :cart-count="cartCount" />
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, inject } from "vue";
import IconCart from "./icons/IconCart.vue";
import ThemeToggle from "./ThemeToggle.vue";
import { useCartStore } from "@/stores/cartStore";
import { useCategories } from "@/composables/useCategories";

import { SELECTED_CATEGORY_IDS_KEY, FILTER_PRODUCTS_BY_CATEGORY_KEY, ALL_PRODUCTS_KEY } from '@/keys'; // Adicionado ALL_PRODUCTS_KEY

const isMobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
  console.log("Menu mobile is:", isMobileMenuOpen.value);
};

const props = defineProps({
  title: {
    type: String,
    required: false,
    default: "Pizzaria da Nonna",
  },
  showBackButton: {
    type: Boolean,
    default: false,
  },
});

const cartStore = useCartStore();
const cartCount = computed(() => cartStore.items.length);

const selectedCategoryIdsRef = inject(SELECTED_CATEGORY_IDS_KEY, ref(null));
const filterProductsByCategory = inject(FILTER_PRODUCTS_BY_CATEGORY_KEY, () => {
  console.warn('filterByCategory function not provided to NewHeader.');
});
// INJECT: Recebe a lista de produtos (allProductsRef)
const allProductsRef = inject(ALL_PRODUCTS_KEY, ref([])); // <-- INJECT AQUI

// Passa allProductsRef para useCategories
const { parentCategories, childCategories, isSelected } = useCategories(
  null,
  selectedCategoryIdsRef,
  allProductsRef // <--- PASSADO AQUI
);

const handleCategorySelection = (id, includeChildren = false) => {
  let idsToFilter = null;
  if (id) {
    if (includeChildren) {
      const children = childCategories.value[id] || [];
      idsToFilter = [id, ...children.map((c) => c.id)];
    } else {
      idsToFilter = [id];
    }
  }
  filterProductsByCategory(idsToFilter);

  // Lógica de navegação (se você estiver em uma página diferente da de produtos)
  // Certifique-se de que o router esteja configurado em sua aplicação
  // import { useRouter } from 'vue-router';
  // const router = useRouter();
  // if (router) {
  //   router.push({ name: 'products', query: { categoryIds: idsToFilter ? idsToFilter.join(',') : 'all' } });
  // }
};

const handleCategorySelectionAndCloseMenu = (id, includeChildren = false) => {
  handleCategorySelection(id, includeChildren);
  toggleMobileMenu();
};

function goBack() {
  window.history.back();
}
</script>

<style scoped>
/* Seus estilos */
.title-font {
  font-family: "Lora", serif;
  font-style: italic;
}

.mobile-menu {
  left: -200%;
  transition: left 0.5s ease-in-out;
  top: 64px;
  position: absolute;
  z-index: 40;
}

.mobile-menu.active {
  left: 0;
}
</style>