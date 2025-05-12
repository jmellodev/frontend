<template>
  <AppLayout>
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <h2 class="font-manrope font-bold text-2xl md:text-3xl text-black mb-8">
        Novidades
      </h2>

      <div v-if="loading">
        <ProductListSkeleton />
      </div>

      <div v-else class="grid grid-cols-2 xl:grid-cols-4 gap-8">
        <ProductCard v-for="product in products" :key="product.id" :product="product" />
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import ProductCard from "@/components/ProductCard.vue";
import AppLayout from "@/layouts/AppLayout.vue";
import ProductListSkeleton from "@/components/skeletons/ProductListSkeleton.vue"; // se quiser usar skeleton
import api from "@/services/httpClient.js";

const products = ref([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const { data } = await api.get("/products");

    products.value = data;
  } catch (err) {
    console.error("Erro ao buscar produtos:", err);
  } finally {
    loading.value = false;
  }
});
</script>
