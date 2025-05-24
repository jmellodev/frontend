// src/composables/useProducts.js
import { ref, computed, watch, onMounted } from "vue";
import api from "@/services/httpClient";

const PRODUCTS_LOCAL_STORAGE_KEY = "cached_products";
const LAST_UPDATED_LOCAL_STORAGE_KEY = "products_last_updated";
const CACHE_EXPIRATION_TIME = 60 * 60 * 1000; // 1 hora

export function useProducts() {
  const products = ref([]); // Lista completa de produtos
  const loading = ref(true);
  const selectedCategoryIds = ref(null);
  const searchTerm = ref("");
  const sortOption = ref("name_asc"); // opções: name_asc, name_desc, price_asc, price_desc

  // 🔍 Filtragem reativa por categoria + busca
  const filteredProducts = computed(() => {
    let result = [...products.value];

    if (selectedCategoryIds.value) {
      result = result.filter((p) =>
        p.categoryIds?.some((id) => selectedCategoryIds.value.includes(id))
      );
    }

    if (searchTerm.value.trim() !== "") {
      const term = searchTerm.value.toLowerCase();
      result = result.filter((p) =>
        p.name?.toLowerCase().includes(term)
      );
    }

    // 🔃 Ordenação
    switch (sortOption.value) {
      case "name_asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name_desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "price_asc":
        result.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        break;
      case "price_desc":
        result.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
        break;
    }

    return result;
  });

  const filterByCategory = (categoryIds) => {
    selectedCategoryIds.value = categoryIds;
  };

  const fetchProducts = async () => {
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
  };

  onMounted(async () => {
    const cached = localStorage.getItem(PRODUCTS_LOCAL_STORAGE_KEY);
    const lastUpdated = localStorage.getItem(LAST_UPDATED_LOCAL_STORAGE_KEY);

    const cacheIsValid = cached && lastUpdated &&
      Date.now() - parseInt(lastUpdated, 10) < CACHE_EXPIRATION_TIME;

    if (cacheIsValid) {
      try {
        products.value = JSON.parse(cached);
        loading.value = false;
        // await fetchProducts(); // opcional: refetch em segundo plano
      } catch {
        await fetchProducts();
      }
    } else {
      await fetchProducts();
    }
  });

  return {
    products, // <--- EXPOSTO AQUI: a lista bruta de produtos
    filteredProducts,
    loading,
    selectedCategoryIds,
    searchTerm,
    sortOption,
    filterByCategory,
  };
}