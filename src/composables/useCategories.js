// src/composables/useCategories.js
import { ref, onMounted, watch } from "vue";
import api from "@/services/httpClient";

const CATEGORIES_LOCAL_STORAGE_KEY = "cached_categories";
const LAST_CAT_UPDATED_LOCAL_STORAGE_KEY = "categories_last_updated";
const CACHE_EXPIRATION_TIME = 60 * 60 * 1000; // 1 hora

export function useCategories(emit, selectedCategoryIdsPropRef, allProductsRef = ref([])) {
  const open = ref(false);
  const toggleMenu = () => (open.value = !open.value);

  const categories = ref([]); // Todas as categorias do backend
  const parentCategories = ref([]);
  const childCategories = ref({});

  // Função para processar e filtrar categorias com base nos produtos
  const processAndFilterCategories = (allCategories, products) => {
    const productCategoryIds = new Set();
    products.forEach(p => {
      p.categoryIds?.forEach(id => productCategoryIds.add(id));
    });

    // Passo 1: Identificar todas as categorias (pais e filhos) que têm produtos
    const categoriesWithProducts = allCategories.filter(cat => productCategoryIds.has(cat.id));
    const categoriesWithProductsIds = new Set(categoriesWithProducts.map(c => c.id));

    const finalParentCategories = [];
    const finalChildCategories = {};

    // Passo 2: Construir a lista de categorias pai a serem exibidas
    // Um pai é incluído se ele mesmo tem produtos OU se algum de seus filhos tem produtos
    allCategories.filter(cat => !cat.parent_id).forEach(parent => {
      let shouldIncludeParent = false;

      // 2a: O próprio pai tem produtos?
      if (categoriesWithProductsIds.has(parent.id)) {
        shouldIncludeParent = true;
      }

      // 2b: Algum filho desse pai tem produtos?
      const childrenOfThisParent = allCategories.filter(cat => cat.parent_id === parent.id);
      const childrenWithProducts = childrenOfThisParent.filter(child => categoriesWithProductsIds.has(child.id));

      if (childrenWithProducts.length > 0) {
        shouldIncludeParent = true;
      }

      // Se o pai deve ser incluído, adicionamos ele e seus filhos que têm produtos
      if (shouldIncludeParent) {
        finalParentCategories.push(parent);
        finalChildCategories[parent.id] = childrenWithProducts; // Apenas filhos com produtos
      }
    });

    parentCategories.value = finalParentCategories;
    childCategories.value = finalChildCategories;
  };

  const fetchCategories = async () => {
    try {
      const { data } = await api.get("/categories");
      localStorage.setItem(CATEGORIES_LOCAL_STORAGE_KEY, JSON.stringify(data));
      localStorage.setItem(LAST_CAT_UPDATED_LOCAL_STORAGE_KEY, Date.now().toString());

      categories.value = data; // Armazena todas as categorias do backend
      // Processa e filtra as categorias com base nos produtos atuais
      processAndFilterCategories(data, allProductsRef.value);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
    }
  };

  const selectCategory = (id, includeChildren = false) => {
    setTimeout(() => (open.value = false), 100);
    let idsToEmit = null;
    if (id) {
      if (includeChildren) {
        // Ao incluir filhos, agora use a lista filtrada `finalChildCategories`
        const children = childCategories.value[id] || [];
        idsToEmit = [id, ...children.map((c) => c.id)];
      } else {
        idsToEmit = [id];
      }
    }
    if (emit) {
      emit("categorySelected", idsToEmit);
    }
  };

  const isSelected = (ids) => {
    if (!selectedCategoryIdsPropRef || !selectedCategoryIdsPropRef.value) return false;
    return ids.some((id) => selectedCategoryIdsPropRef.value.includes(id));
  };

  onMounted(() => {
    const cached = localStorage.getItem(CATEGORIES_LOCAL_STORAGE_KEY);
    const lastUpdated = localStorage.getItem(LAST_CAT_UPDATED_LOCAL_STORAGE_KEY);

    const cacheIsValid = cached && lastUpdated && (Date.now() - parseInt(lastUpdated, 10) < CACHE_EXPIRATION_TIME);

    if (cacheIsValid) {
      try {
        const parsed = JSON.parse(cached);
        categories.value = parsed; // Carrega todas as categorias do cache
        // Processa e filtra com os produtos atuais
        processAndFilterCategories(parsed, allProductsRef.value);
      } catch (error) {
        console.warn("Cache de categorias corrompido. Recarregando...", error);
        fetchCategories();
      }
    } else {
      fetchCategories();
    }
  });

  // WATCHER: Re-filtra categorias quando a lista de produtos muda
  watch(allProductsRef, (newProducts) => {
    // Garante que as categorias já foram carregadas do backend/cache
    // e que a lista de produtos não está vazia (inicialmente vazia)
    if (categories.value.length > 0 && newProducts && newProducts.length > 0) {
      processAndFilterCategories(categories.value, newProducts);
    } else if (categories.value.length > 0 && (!newProducts || newProducts.length === 0)) {
      // Se a lista de produtos ficar vazia, limpar as categorias exibidas
      parentCategories.value = [];
      childCategories.value = {};
    }
  }, { deep: true });

  return {
    open,
    toggleMenu,
    // `categories` continua sendo todas as categorias do backend (não filtradas)
    parentCategories, // Estas são as categorias pai filtradas para exibir
    childCategories,  // Estas são as categorias filhas filtradas para exibir
    selectCategory,
    isSelected,
  };
}