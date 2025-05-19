<template>
  <AppLayout :show-back-button="false">
    <MegaMenuTop
      :selectedCategoryIds="selectedCategoryIds"
      @categorySelected="filterByCategory"
    />
    <div class="mx-auto max-w-7xl px-2 lg:px-8">
      <input
        type="text"
        v-model="searchTerm"
        placeholder="Buscar produtos..."
        class="w-full p-2 rounded border mb-2"
      />

      <select v-model="sortOption" class="w-full p-2 rounded border mb-4">
        <option value="name_asc">Nome (A-Z)</option>
        <option value="name_desc">Nome (Z-A)</option>
        <option value="price_asc">Preço (menor primeiro)</option>
        <option value="price_desc">Preço (maior primeiro)</option>
      </select>

      <ProductListSkeleton v-if="loading" />

      <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mt-5">
        <ProductCard
          v-for="product in filteredProducts"
          :key="product.id"
          :product="product"
        />
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import AppLayout from "@/layouts/AppLayout.vue";
import ProductCard from "@/components/ProductCard.vue";
import ProductListSkeleton from "@/components/skeletons/ProductListSkeleton.vue";
import MegaMenuTop from "@/components/MegaMenuTop.vue";
import { useProducts } from "@/composables/useProducts";

const {
  filteredProducts,
  loading,
  selectedCategoryIds,
  filterByCategory,
  sortOption,
  searchTerm,
} = useProducts();
</script>
