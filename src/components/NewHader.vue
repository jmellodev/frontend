<template>
  <header class=" bg-red-400 fixed top-0 w-full z-50 shadow-lg">
    <nav class="relative px-4 hidden md:block">
      <div class="container mx-auto flex justify-between items-center">
        <div class="text-gray-700 text-2xl font-bold">
          <img src="../assets/image/logo.png" alt="Pizzaria da Nonna" title="Pizzaria da Nonna"
            class="object-contain h-10 w-full" />
        </div>
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
              // Usa a ref injetada para isSelected
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
                  // Usa a ref injetada para a estilização
                  selectedCategoryIdsRef?.includes(child.id)
                    ? 'text-red-400 font-bold bg-gray-200'
                    : 'text-gray-600 hover:text-red-400 hover:bg-gray-300',
                ]">
                <span><i :class="child.icon"></i> {{ child.name }}</span>
              </li>
            </ul>
          </li>
          <li class="py-4"><a href="#contact" class="hover:text-yellow-300">Contact</a></li>
        </ul>
        <div class="flex space-x-2">
          <ThemeToggle />
          <IconCart :cart-count="cartCount" />
        </div>
      </div>
    </nav>

    <div class="py-2 px-4 bg-gray-50 dark:bg-gray-700 flex justify-between items-center md:hidden w-full">
      <a v-if="showBackButton" @click.prevent="goBack" class="flex-none">
        <i class="fa fa-arrow-left text-gray-400 dark:text-gray-200 text-md"></i>
      </a>

      <div v-else>
        <button class="p-2 text-gray-600 relative">
          <i @click="toggleMobileMenu" class="h-4 fas text-sm dark:text-gray-200"
            :class="[isMobileMenuOpen ? 'fa-xmark' : 'fa-bars']">
          </i>
          <div
            class="absolute group-hover:translate-x-2 transition-all duration-200 ease-in-out z-50 p-2 bg-white dark:bg-gray-800 rounded-md -top-2 -left-5 h-screen flex flex-col space-y-2"
            :class="[isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full']">
            <div class="flex items-center justify-between pl-4 py-4 mb-4 h-4 w-full dark:text-gray-400">
              <span class="italic font-medium text-xl">Menu</span>
              <i @click="toggleMobileMenu" class="fas text-xl fa-xmark"></i>
            </div>
            <ul class="flex flex-col w-56 items-start text-gray-700 dark:text-gray-300 px-4">
              <li @click="handleCategorySelectionAndCloseMenu(null)"
                class="flex p-2 whitespace-nowrap hover:bg-gray-800/50 space-x-2">
                <span class="mb-1 font-medium"><i class="fa fa-list"></i> Ver todas</span>
              </li>
              <li v-for="parent in parentCategories" :key="parent.id"
                class="flex flex-col p-2 whitespace-nowrap hover:bg-gray-800/50 items-start space-x-2">
                <span class="mb-1 font-medium" @click="handleCategorySelectionAndCloseMenu(parent.id, true)">
                  <i :class="parent.icon"></i>
                  {{ parent.name }}
                </span>
                <ul v-if="childCategories[parent.id]?.length > 0" class="flex flex-col ml-3 gap-y-4 gap-x-3">
                  <li class="flex" v-for="child in childCategories[parent.id]" :key="child.id"
                    @click="handleCategorySelectionAndCloseMenu(child.id)">
                    <span><i :class="child.icon"></i> {{ child.name }}</span>
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
        <ThemeToggle />
        <IconCart :cart-count="cartCount" />
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, inject } from "vue"; // Adicionado inject
import IconCart from "./icons/IconCart.vue";
import ThemeToggle from "./ThemeToggle.vue";
import { useCartStore } from "@/stores/cartStore";
import { useCategories } from "@/composables/useCategories";

// Chaves para provide/inject
import { SELECTED_CATEGORY_IDS_KEY, FILTER_PRODUCTS_BY_CATEGORY_KEY } from '@/keys'; // Crie este arquivo keys.js

const isMobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
  console.log("Menu mobile is:", isMobileMenuOpen.value);
};

// Props genéricas que podem vir do AppLayout
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

// INJECT: Recebe a ref `selectedCategoryIds` do ProductListPage
// O valor default é importante caso o componente seja usado em uma página que não provê essa chave
const selectedCategoryIdsRef = inject(SELECTED_CATEGORY_IDS_KEY, ref(null));

// INJECT: Recebe a função `filterByCategory` do ProductListPage
const filterProductsByCategory = inject(FILTER_PRODUCTS_BY_CATEGORY_KEY, () => {
  console.warn('filterByCategory function not provided to NewHeader.');
});


// `useCategories` usa a ref injetada para a função `isSelected`
const { parentCategories, childCategories, isSelected } = useCategories(
  null, // Não há `emit` necessário para seleção de categoria neste componente
  selectedCategoryIdsRef // Passa a ref injetada para `isSelected`
);

// Função unificada para manipular o clique em uma categoria (desktop e mobile)
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
  // Chama a função injetada
  filterProductsByCategory(idsToFilter);

  // Se estiver na página de produtos, navegar para ela.
  // Isso é importante porque o NewHeader é global.
  // Se você estiver na página de carrinho e clicar em "Pizzas",
  // você quer ir para a ProductListPage com a categoria Pizza selecionada.
  // Depende da sua estratégia de rotas (Vue Router). Exemplo com Vue Router:
  // import { useRouter } from 'vue-router';
  // const router = useRouter();
  // router.push({ name: 'products', query: { category: id || 'all' } });
  // Ou simplesmente:
  // window.location.href = `/products?category=${id || 'all'}`;
  // POR ENQUANTO, vamos apenas chamar a função injetada.
  // Se a página atual NÃO for ProductListPage, a lógica de filtragem injetada pode não ter efeito.
  // O router.push seria a maneira robusta de garantir a navegação.
};

// Função para manipular o clique na categoria e fechar o menu mobile
const handleCategorySelectionAndCloseMenu = (id, includeChildren = false) => {
  handleCategorySelection(id, includeChildren); // Usa a função unificada
  toggleMobileMenu(); // Fecha o menu mobile
};

function goBack() {
  window.history.back();
}
</script>

<style scoped>
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