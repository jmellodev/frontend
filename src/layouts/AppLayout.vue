<template>
  <div class="bg-gray-100 dark:bg-gray-700">
    <!-- <Header :title="title" :background="background" /> -->

    <Topnav :title="props.topNavTitle" :showBackButton="props.showBackButton"
      :selectedCategoryIds="props.selectedCategoryIds" @categorySelected="props.filterByCategory" />

    <main class="py-4 h-auto pb-16 md:pb-0 pt-20 m-auto">
      <slot />
    </main>

    <MenuMobile v-if="props.mobileMenuVisible" />
  </div>
</template>

<script setup>
import { ref, computed } from "vue"; // Importe 'computed' se você for usar 'cartCount' ou outras computadas
import Header from "@/components/Header.vue";
import MenuMobile from "@/components/MenuMobile.vue";
import NewHader from "@/components/NewHader.vue";
import Topnav from "@/components/Topnav.vue";
import { useCategories } from "@/composables/useCategories";
import { useCartStore } from "@/stores/cartStore"; // Se você estiver usando cartStore no NewHader.vue, é bom importá-lo aqui também ou onde ele for realmente usado.


// Combine todas as definições de props em uma única chamada defineProps
const props = defineProps({
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
  // Esta prop 'selectedCategoryIds' estava em um defineProps separado, agora está mesclada
  selectedCategoryIds: {
    type: Array, // Use uma função para o default de arrays/objetos
  },
});

// A constante 'emit' também é definida uma única vez
const emit = defineEmits(["categorySelected"]);


// Se 'selectedCategoryIdsRef' precisa ser uma ref para 'useCategories', use-a assim:
// Se o 'useCategories' já espera uma prop reativa diretamente, talvez 'selectedCategoryIdsRef' não seja necessário.
// O 'useCategories' que você mostrou antes esperava 'selectedCategoryIdsRef', então vamos mantê-lo.
const selectedCategoryIdsRef = ref(props.selectedCategoryIds);


const { parentCategories, childCategories, selectCategory, isSelected } = useCategories(
  emit,
  selectedCategoryIdsRef // Passe a ref
);

// Exemplo: Se você precisar do cartStore neste componente App.vue
// const cartStore = useCartStore();
// const cartCount = computed(() => cartStore.items.length);

</script>
