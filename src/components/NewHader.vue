<template>
  <header class="py-2 bg-red-400 fixed top-0 w-full z-50 hidden md:block">
    <nav class="relative px-4">
      <div class="container mx-auto flex justify-between items-center">
        <div class="text-white text-2xl font-bold">
          Pizzaria da Nonna
        </div>
        <ul class="space-x-6 text-white hidden md:flex">
          <li @click="selectCategory(null)" class="py-4">
            <span :class="[
              'cursor-pointer whitespace-nowrap',
              selectedCategoryIds === null ? 'text-yellow-300' : '',
            ]"><i class="fa fa-list"></i> Todas</span>
          </li>
          <li class="group flex relative py-4" v-for="parent in parentCategories" :key="parent.id">
            <span @click="selectCategory(parent.id, true)" :class="[
              'cursor-pointer whitespace-nowrap ',
              isSelected([
                parent.id,
                ...(childCategories[parent.id]?.map((c) => c.id) || []),
              ])
                ? 'text-pink-600 font-bold border-b'
                : 'text-yellow-300 group-hover:text-yellow-300',
            ]">
              <i :class="parent.icon"></i>
              {{ parent.name }}
            </span>
            <i class="fa-solid fa-chevron-down fa-2xs pt-3 ml-1 group-hover:rotate-180 group-hover:text-yellow-300 transition duration-200 ease-in-out"
              v-if="childCategories[parent.id]?.length > 0"></i>
            <ul v-if="childCategories[parent.id]?.length > 0"
              class="absolute bg-white p-3 w-52 top-12 transform scale-0 group-hover:scale-100 transition duration-150 ease-in-out origin-top shadow-lg rounded-md">
              <li v-for="child in childCategories[parent.id]" :key="child.id" @click="selectCategory(child.id)" :class="[
                'cursor-pointer p-1 whitespace-nowrap rounded-md text-gray-600 hover:text-red-400 hover:bg-gray-300',
                selectedCategoryIds?.includes(child.id)
                  ? 'text-red-400 font-bold bg-gray-200'
                  : 'text-gray-600 hover:text-red-400 hover:bg-gray-300'
              ]">
                <span><i :class="child.icon"></i> {{ child.name }}</span>
              </li>
            </ul>
          </li>
          <li class="py-4"><a href="#contact" class="hover:text-yellow-300">Contact</a></li>
        </ul>
        <div class="flex space-x-2">
          <IconCart :cart-count="cartCount" />
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { computed, ref } from "vue";
import { useCategories } from "@/composables/useCategories";
import { useCartStore } from "@/stores/cartStore";
import IconCart from "./icons/IconCart.vue";

const cartStore = useCartStore();
const cartCount = computed(() => cartStore.items.length);

const props = defineProps({ selectedCategoryIds: Array });
const emit = defineEmits(["categorySelected"]);

const selectedCategoryIdsRef = ref(props.selectedCategoryIds); // se quiser reatividade
const { parentCategories, childCategories, selectCategory, isSelected } = useCategories(
  emit,
  selectedCategoryIdsRef
);
</script>