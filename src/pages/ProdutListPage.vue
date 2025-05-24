<template>
  <AppLayout :show-back-button="false">
    <div class="mx-auto max-w-7xl px-0 lg:px-8 relative">
      <div class="flex items-center justify-end space-x-4 bg-white dark:bg-gray-900 pb-2 mt-2 pt-2 sticky top-14 px-2">
        <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <i class="fa fa-search h-4 w-4 text-gray-400" aria-hidden="true"></i>
        </div>
        <input type="text" v-model="searchTerm" placeholder="Buscar produtos..."
          class="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
        <div class="w-10 text-right">
          <Menu as="div" class="relative inline-block text-left group">
            <div>
              <MenuButton
                class="inline-flex space-x-1 w-full items-center bg-white dark:bg-gray-800 justify-center rounded-md shadow-md p-2 text-sm font-medium dark:text-white group-hover:bg-black/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
                <i class="fa-solid fa-arrow-up-wide-short"></i>
              </MenuButton>
            </div>

            <transition enter-active-class="transition duration-100 ease-out"
              enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
              leave-active-class="transition duration-75 ease-in" leave-from-class="transform scale-100 opacity-100"
              leave-to-class="transform scale-95 opacity-0">
              <MenuItems
                class="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 dark:divide-gray-900 rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black/5 focus:outline-none">
                <div class="px-1 py-1">
                  <MenuItem v-slot="{ active, selected }">
                  <label for="az">
                    <span :class="[
                      active ? 'bg-violet-500 text-white' : 'text-gray-900 dark:text-white',
                      'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                    ]">
                      <input type="radio" name="nama_az" id="az" value="name_asc" class="hidden" v-model="sortOption">
                      <i :active="active" class="mr-2 h-5 w-5 text-violet-400 fa fa-arrow-down-a-z"
                        aria-hidden="true"></i>
                      Nome (A-Z)
                    </span>
                  </label>
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                  <label for="za">
                    <span :class="[
                      active ? 'bg-violet-500 text-white' : 'text-gray-900 dark:text-white',
                      'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                    ]">
                      <input type="radio" name="nama_za" id="za" value="name_desc" class="hidden" v-model="sortOption">
                      <i :active="active" class="mr-2 h-5 w-5 text-violet-400 fa fa-arrow-up-z-a"
                        aria-hidden="true"></i>
                      Nome (Z-A)
                    </span>
                  </label>
                  </MenuItem>
                </div>
                <div class="px-1 py-1">
                  <MenuItem v-slot="{ active }">
                  <label for="minor_price">
                    <input type="radio" name="minor_price" id="minor_price" value="price_asc" class="hidden"
                      v-model="sortOption">
                    <span :class="[
                      active ? 'bg-violet-500 text-white' : 'text-gray-900 dark:text-white',
                      'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                    ]">
                      <i :active="active" class="mr-2 h-5 w-5 text-violet-400 fa fa-arrow-down-1-9"
                        aria-hidden="true"></i>
                      Menor preço
                    </span>
                  </label>
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                  <label for="hight_price">
                    <input type="radio" name="hight_price" id="hight_price" value="price_desc" class="hidden"
                      v-model="sortOption">
                    <span :class="[
                      active ? 'bg-violet-500 text-white' : 'text-gray-900 dark:text-white',
                      'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                    ]">
                      <i :active="active" class="mr-2 h-5 w-5 text-violet-400 fa fa-arrow-up-9-1"
                        aria-hidden="true"></i>
                      Maior preço
                    </span>
                  </label>
                  </MenuItem>
                </div>
              </MenuItems>
            </transition>
          </Menu>
        </div>
      </div>

      <ProductListSkeleton v-if="loading" />

      <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mt-5">
        <ProductCard v-for="product in filteredProducts" :key="product.id" :product="product" />
        <div v-if="filteredProducts.length == 0" class="col-span-6 flex items-center justify-center">
          Não há produtos para esta categoria
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { provide } from 'vue'; // Adicionado provide
import AppLayout from "@/layouts/AppLayout.vue";
import ProductCard from "@/components/ProductCard.vue";
import ProductListSkeleton from "@/components/skeletons/ProductListSkeleton.vue";
import { useProducts } from "@/composables/useProducts";

// Chaves para provide/inject
import { SELECTED_CATEGORY_IDS_KEY, FILTER_PRODUCTS_BY_CATEGORY_KEY } from '@/keys'; // Crie este arquivo keys.js
import { Listbox, ListboxOptions, ListboxOption, ListboxButton, Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue';

const {
  filteredProducts,
  loading,
  selectedCategoryIds, // ESTA É A REF ORIGINAL do useProducts
  filterByCategory,   // ESTA É A FUNÇÃO ORIGINAL do useProducts
  sortOption,
  searchTerm,
} = useProducts();

// PROVIDE: Torna a ref selectedCategoryIds e a função filterByCategory disponíveis para descendentes
provide(SELECTED_CATEGORY_IDS_KEY, selectedCategoryIds);
provide(FILTER_PRODUCTS_BY_CATEGORY_KEY, filterByCategory);
</script>