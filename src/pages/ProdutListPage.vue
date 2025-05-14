<template>
  <AppLayout :show-back-button="false">
    <div class="mx-auto max-w-7xl px-2 lg:px-8">
      <h2 class="font-manrope font-bold text-2xl md:text-3xl dark:text-gray-100 mb-8">
        Novidades
      </h2>

      <div v-if="loading">
        <ProductListSkeleton />
      </div>

      <div v-else class="grid grid-cols-2 xl:grid-cols-4 gap-2">
        <ProductCard v-for="product in products" :key="product.id" :product="product" />
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import ProductCard from "@/components/ProductCard.vue";
import AppLayout from "@/layouts/AppLayout.vue";
import ProductListSkeleton from "@/components/skeletons/ProductListSkeleton.vue";
import api from "@/services/httpClient.js";

const PRODUCTS_LOCAL_STORAGE_KEY = "cached_products";
const LAST_UPDATED_LOCAL_STORAGE_KEY = "products_last_updated";
const CACHE_EXPIRATION_TIME = 60 * 60 * 1000; // 1 hora (em milissegundos)

const products = ref([]);
const loading = ref(true);

async function fetchProductsFromApi() {
  try {
    const { data } = await api.get("/products");
    localStorage.setItem(PRODUCTS_LOCAL_STORAGE_KEY, JSON.stringify(data));
    localStorage.setItem(LAST_UPDATED_LOCAL_STORAGE_KEY, Date.now().toString());
    products.value = data;
  } catch (err) {
    console.error("Erro ao buscar produtos:", err);
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  const cachedProducts = localStorage.getItem(PRODUCTS_LOCAL_STORAGE_KEY);
  const lastUpdated = localStorage.getItem(LAST_UPDATED_LOCAL_STORAGE_KEY);

  if (
    cachedProducts &&
    lastUpdated &&
    Date.now() - parseInt(lastUpdated) < CACHE_EXPIRATION_TIME
  ) {
    // Produtos em cache são válidos
    products.value = JSON.parse(cachedProducts);
    loading.value = false;

    // Iniciar uma busca em segundo plano para verificar atualizações
    fetchProductsFromApi();
  } else {
    // Não há cache válido, buscar da API
    await fetchProductsFromApi();
  }

  // Opcional: Lógica para escutar por alterações no Firestore e invalidar o cache
  // Isso dependerá da sua configuração do Firestore e de como você detecta mudanças.
  // Exemplo conceitual (requer configuração específica):
  // const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
  //   if (snapshot.docChanges().length > 0) {
  //     console.log("Alterações detectadas nos produtos do Firestore, invalidando cache.");
  //     localStorage.removeItem(PRODUCTS_LOCAL_STORAGE_KEY);
  //     localStorage.removeItem(LAST_UPDATED_LOCAL_STORAGE_KEY);
  //     // Forçar uma nova busca na próxima vez que a página for carregada
  //   }
  // });
  // onUnmounted(() => {
  //   if (unsubscribe) {
  //     unsubscribe();
  //   }
  // });
});
</script>
