// useCategories.js (Seu código original, com renomeação de parâmetro)
import { ref, onMounted } from "vue";
import api from "@/services/httpClient";

const CATEGORIES_LOCAL_STORAGE_KEY = "cached_categories";
const LAST_CAT_UPDATED_LOCAL_STORAGE_KEY = "categories_last_updated";
const CACHE_EXPIRATION_TIME = 60 * 60 * 1000; // 1 hora

export function useCategories(emit, selectedCategoryIdsPropRef) { // selectedCategoryIdsPropRef é a prop passada via `toRef`
  const open = ref(false); // Esta `open` e `toggleMenu` podem ser removidas se não forem usadas internamente por `useCategories` para algo visível.
  const toggleMenu = () => (open.value = !open.value);

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

  // Esta função selectCategory não será diretamente usada pelo NewHeader para emitir eventos.
  // Ela ainda existe, mas o NewHeader usará a prop `filterByCategory` diretamente.
  // Se nenhum outro componente a usar para emitir, pode até ser removida do retorno.
  const selectCategory = (id, includeChildren = false) => {
    setTimeout(() => (open.value = false), 100);
    let idsToEmit = null;
    if (id) {
      if (includeChildren) {
        const children = childCategories.value[id] || [];
        idsToEmit = [id, ...children.map((c) => c.id)];
      } else {
        idsToEmit = [id];
      }
    }
    // Apenas emite se 'emit' for fornecido (que é nulo para NewHeader)
    if (emit) {
      emit("categorySelected", idsToEmit);
    }
  };

  const isSelected = (ids) => {
    // Usa a ref `selectedCategoryIdsPropRef` (que é a prop) para verificar a seleção
    if (!selectedCategoryIdsPropRef || !selectedCategoryIdsPropRef.value) return false;
    return ids.some((id) => selectedCategoryIdsPropRef.value.includes(id));
  };

  onMounted(() => {
    const cached = localStorage.getItem(CATEGORIES_LOCAL_STORAGE_KEY);
    const lastUpdated = localStorage.getItem(LAST_CAT_UPDATED_LOCAL_STORAGE_KEY);
    const cacheIsValid = cached && lastUpdated &&
      (Date.now() - parseInt(lastUpdated, 10) < CACHE_EXPIRATION_TIME);

    if (cacheIsValid) {
      try {
        const parsed = JSON.parse(cached);
        processCategories(parsed);
      } catch (error) {
        console.warn("Cache de categorias corrompido. Recarregando...", error);
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
    selectCategory, // Mantida por segurança, mas NewHeader não a chamará para emitir
    isSelected,
  };
}