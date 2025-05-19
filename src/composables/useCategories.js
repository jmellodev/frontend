import { ref, onMounted } from "vue";
import api from "@/services/httpClient";

export function useCategories(emit, selectedCategoryIds = ref(null)) {
  const open = ref(false);
  const toggleMenu = () => (open.value = !open.value);

  const CATEGORIES_LOCAL_STORAGE_KEY = "cached_categories";
  const LAST_CAT_UPDATED_LOCAL_STORAGE_KEY = "categories_last_updated";
  const CACHE_EXPIRATION_TIME = 60 * 60 * 1000; // 1 hora

  const categories = ref([]);
  const parentCategories = ref([]);
  const childCategories = ref({});

  const processCategories = (data) => {
    categories.value = data;

    const parents = data.filter((cat) => !cat.parent_id);
    const childrenMap = {};
    parents.forEach((parent) => {
      childrenMap[parent.id] = data.filter((cat) => cat.parent_id === parent.id);
    });

    parentCategories.value = parents;
    childCategories.value = childrenMap;
  };

  const fetchCategories = async () => {
    try {
      const { data } = await api.get("/categories");

      localStorage.setItem(CATEGORIES_LOCAL_STORAGE_KEY, JSON.stringify(data));
      localStorage.setItem(LAST_CAT_UPDATED_LOCAL_STORAGE_KEY, Date.now().toString());

      processCategories(data);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
    }
  };

  const selectCategory = (id, includeChildren = false) => {
    setTimeout(() => (open.value = false), 100);

    if (!id) {
      emit("categorySelected", null); // "Todos"
      return;
    }

    if (includeChildren) {
      const children = childCategories.value[id] || [];
      const ids = [id, ...children.map((c) => c.id)];
      emit("categorySelected", ids);
    } else {
      emit("categorySelected", [id]);
    }
  };

  const isSelected = (ids) => {
    if (!selectedCategoryIds.value) return false;
    return ids.some((id) => selectedCategoryIds.value.includes(id));
  };

  onMounted(() => {
    const cached = localStorage.getItem(CATEGORIES_LOCAL_STORAGE_KEY);
    const lastUpdated = localStorage.getItem(LAST_CAT_UPDATED_LOCAL_STORAGE_KEY);

    const cacheIsValid = cached && lastUpdated && (Date.now() - parseInt(lastUpdated, 10) < CACHE_EXPIRATION_TIME);

    if (cacheIsValid) {
      try {
        const parsed = JSON.parse(cached)
        processCategories(parsed);
        fetchCategories();
      } catch (error) {
        console.warn("Cache de categorias corrompido. Recarregando...");
        fetchCategories();
      }
    } else {
      fetchCategories();
    }
  });

  return {
    open,
    toggleMenu,
    categories,
    parentCategories,
    childCategories,
    selectCategory,
    isSelected,
  };
}
