<template>
  <div>
    <AdminLayout>
      <div class="space-y-6 p-4 bg-white dark:bg-gray-900 rounded-lg shadow-xl">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white">
          Categorias
          <p class="text-gray-600 dark:text-gray-400 text-sm font-normal">Adicione, edite ou remova categorias de
            produtos.</p>

        </h2>

        <button @click="openForm()"
          class="px-5 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md transition-colors duration-200">
          Nova Categoria
        </button>

        <div v-if="isLoading" class="text-center py-8">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-400 dark:border-gray-600 mx-auto">
          </div>
          <p class="text-gray-600 dark:text-gray-400 mt-4">Carregando categorias...</p>
        </div>

        <div v-else-if="categories.length === 0" class="text-center py-8">
          <p class="text-gray-600 dark:text-gray-400 text-lg">Nenhuma categoria encontrada.</p>
        </div>

        <div v-else class="overflow-x-auto mt-4 rounded-lg">
          <table class="min-w-full table-auto bg-gray-100 dark:bg-gray-800">
            <thead>
              <tr class="bg-gray-200 dark:bg-gray-700">
                <th class="py-3 px-6 text-left text-gray-700 dark:text-gray-300 uppercase text-sm leading-normal">Nome
                </th>
                <th class="py-3 px-6 text-left text-gray-700 dark:text-gray-300 uppercase text-sm leading-normal">
                  Categoria Pai</th>
                <th class="py-3 px-6 text-left text-gray-700 dark:text-gray-300 uppercase text-sm leading-normal">Ícone
                </th>
                <th class="py-3 px-6 text-right text-gray-700 dark:text-gray-300 uppercase text-sm leading-normal">Ações
                </th>
              </tr>
            </thead>
            <tbody class="text-gray-800 dark:text-gray-200 text-sm font-light">
              <tr v-for="cat in paginatedCategories" :key="cat.id"
                class="border-b border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700">
                <td class="py-3 px-6 text-left whitespace-nowrap flex flex-col">
                  <span>{{ cat.name }}</span>
                  <small class="italic text-gray-600 dark:text-gray-400">/{{ cat.slug }}</small>
                </td>
                <td class="py-3 px-6 text-left">{{ getParentCategoryName(cat.parent_id) }}</td>
                <td class="py-3 px-6 text-left">
                  <i :class="cat.icon" class="mr-2 text-blue-600 dark:text-blue-400" :title="cat.icon"></i>
                </td>
                <td class="py-3 px-6 text-right">
                  <button @click="openForm(cat)"
                    class="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-l-md transition-colors duration-200">
                    <i class="fa-duotone fa-edit" aria-label="hidden"></i>
                  </button>
                  <button @click="askDelete(cat)"
                    class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-r-md transition-colors duration-200">
                    <i class="fa-duotone fa-trash" aria-label="hidden"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <div
            class="flex flex-col md:flex-row justify-between items-center mt-6 text-gray-900 dark:text-white p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <span class="mb-4 md:mb-0">Total de itens: {{ totalItems }}</span>

            <div class="flex items-center gap-2">
              <label for="pageSize" class="text-sm text-gray-700 dark:text-gray-300">Itens por página:</label>
              <div class="relative">
                <select id="pageSize" v-model.number="pageSize"
                  class="appearance-none bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-400 dark:border-gray-600 rounded px-3 py-1 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option :value="3">3</option>
                  <option :value="5">5</option>
                  <option :value="10">10</option>
                  <option :value="25">25</option>
                </select>
                <div
                  class="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-800 dark:text-white">
                  ▼
                </div>
              </div>

              <button @click="currentPage--" :disabled="currentPage === 1"
                class="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
                &lt; Anterior
              </button>
              <span class="px-2">Página {{ currentPage }} de {{ totalPages }}</span>
              <button @click="currentPage++" :disabled="currentPage >= totalPages"
                class="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
                Próximo &gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
    <BaseModal v-if="showForm" v-model:open="showForm">
      <div class="max-w-md text-gray-900 dark:text-white relative">
        <button @click="showForm = false"
          class="absolute top-3 right-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-xl">
          &times;
        </button>
        <h3 class="text-2xl font-bold mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
          {{ form.id ? "Editar" : "Nova" }} Categoria
        </h3>

        <div v-if="isFormLoading" class="text-center py-4">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400 dark:border-gray-600 mx-auto">
          </div>
          <p class="text-gray-600 dark:text-gray-400 mt-2">Salvando...</p>
        </div>

        <div v-else class="space-y-4">
          <input v-model="form.name" placeholder="Nome da Categoria"
            class="w-full p-3 bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input v-model="form.slug" placeholder="Slug (gerado automaticamente)" readonly
            class="w-full p-3 bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md hidden focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-not-allowed" />

          <div>
            <label for="parent-category-select"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Categoria Pai
              (Opcional):</label>
            <select id="parent-category-select" v-model="form.parent_id"
              class="w-full p-3 bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Nenhuma (Categoria Principal)</option>
              <option v-for="cat in availableParentCategories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
          </div>

          <div>
            <label for="icon-input"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ícone:</label>
            <div class="flex items-center gap-2 relative">
              <input type="text" id="icon-input" v-model="form.icon" placeholder="Ex: fas fa-pizza-slice"
                class="w-full p-3 bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <button @click="showIconPicker = true"
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors duration-200 absolute right-0 top-0 h-full flex items-center">
                <i :class="form.icon || 'fas fa-search'"></i>
                <span class="ml-2 hidden sm:inline">Escolher</span>
              </button>
            </div>
            <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">Use classes de ícones como "fas fa-pizza-slice"
              <a class="text-blue-600 dark:text-blue-400 hover:underline" href="https://fontawesome.com/icons"
                target="_blank">(Font
                Awesome)</a>.
            </p>
          </div>

          <div class="flex justify-end mt-6 gap-3 border-t border-gray-300 dark:border-gray-700 pt-4">
            <button @click="save()" :disabled="isFormLoading"
              class="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
              Salvar
            </button>
            <button @click="showForm = false" :disabled="isFormLoading"
              class="px-5 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </BaseModal>

    <BaseModal v-if="showDeleteModal" v-model:open="showDeleteModal">
      <button @click="showDeleteModal = false"
        class="absolute top-3 right-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-xl mb-5">
        &times;
      </button>
      <div class="mb-4 flex flex-col items-center space-y-4">
        <i class="fa-duotone fa-solid fa-circle-exclamation text-6xl text-red-400"></i>
        <span>
          Tem certeza que deseja excluir a categoria
          <strong class="text-red-600 dark:text-red-400">{{ categoryToDelete?.name }}</strong>?
        </span>
        Esta ação é irreversível.
      </div>
      <div class="mt-6 flex justify-end gap-3">
        <button @click="deleteCategory" :disabled="isFormLoading"
          class="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
          Excluir
        </button>
        <button @click="showDeleteModal = false" :disabled="isFormLoading"
          class="px-5 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
          Cancelar
        </button>
      </div>
    </BaseModal>

    <IconPickerModal v-if="showIconPicker" v-model:open="showIconPicker" @icon-selected="handleIconSelection" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import api from "@/services/httpClient";
import AdminLayout from "@/layouts/AdminLayout.vue";
import BaseModal from "@/components/modals/BaseModal.vue";
import IconPickerModal from "@/components/modals/IconPickerModal.vue"; // Nova importação

const categories = ref([]);
const showForm = ref(false);
const showDeleteModal = ref(false);
const showIconPicker = ref(false); // Novo ref para controlar o Icon Picker
const categoryToDelete = ref(null);
const currentPage = ref(1);
const pageSize = ref(5);
const totalItems = ref(0);
const isLoading = ref(true);
const isFormLoading = ref(false);

const paginatedCategories = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return categories.value.slice(start, start + pageSize.value);
});

const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value));

const form = ref({
  id: null, // Adicionado para edição
  name: "",
  slug: "",
  parent_id: "",
  icon: "",
});

const availableParentCategories = computed(() => {
  if (!form.value.id) {
    return categories.value;
  }
  return categories.value.filter(cat => cat.id !== form.value.id);
});


function resetForm() {
  form.value = {
    id: null,
    name: "",
    slug: "",
    parent_id: "",
    icon: "",
  };
}

watch(
  () => form.value.name,
  (name) => {
    form.value.slug = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");
  }
);

function openForm(category = null) {
  resetForm();
  if (category) {
    form.value = JSON.parse(JSON.stringify(category));
  }
  showForm.value = true;
}

// Função para lidar com a seleção do ícone do picker
function handleIconSelection(iconClass) {
  form.value.icon = iconClass;
  showIconPicker.value = false; // Fecha o picker após a seleção
}

async function save() {
  isFormLoading.value = true;
  try {
    const dataToSave = { ...form.value };
    if (dataToSave.parent_id === "") {
      dataToSave.parent_id = null;
    }

    if (dataToSave.id) {
      await api.put(`/categories/${dataToSave.id}`, dataToSave);
      console.log(`Categoria ${dataToSave.id} atualizada com sucesso.`);
    } else {
      await api.post("/categories", dataToSave);
      console.log('Nova categoria criada com sucesso.');
    }
    showForm.value = false;
    await loadCategories();
  } catch (err) {
    console.error("Erro ao salvar categoria:", err.response?.data || err.message);
    // TODO: Adicionar feedback visual para o usuário (ex: toast de erro)
  } finally {
    isFormLoading.value = false;
  }
}

function askDelete(category) {
  categoryToDelete.value = category;
  showDeleteModal.value = true;
}

async function deleteCategory() {
  isFormLoading.value = true;
  try {
    if (categoryToDelete.value && categoryToDelete.value.id) {
      await api.delete(`/categories/${categoryToDelete.value.id}`);
      console.log(`Categoria ${categoryToDelete.value.id} excluída com sucesso.`);
      showDeleteModal.value = false;
      await loadCategories();
    }
  } catch (err) {
    console.error("Erro ao excluir categoria:", err.response?.data || err.message);
    // TODO: Adicionar feedback visual para o usuário (ex: toast de erro)
  } finally {
    isFormLoading.value = false;
  }
}

function getParentCategoryName(parentId) {
  if (!parentId) return "Nenhuma";
  const parent = categories.value.find(cat => cat.id === parentId);
  return parent ? parent.name : "Desconhecida";
}

async function loadCategories() {
  isLoading.value = true;
  try {
    const res = await api.get("/categories");
    categories.value = Array.isArray(res.data) ? res.data : [];
    totalItems.value = categories.value.length;
    if (currentPage.value > totalPages.value && totalPages.value > 0) {
      currentPage.value = totalPages.value;
    } else if (totalPages.value === 0) {
      currentPage.value = 1;
    }
  } catch (err) {
    console.error("Erro ao carregar categorias:", err.response?.data || err.message);
    // TODO: Adicionar feedback visual para o usuário (ex: toast de erro)
  } finally {
    isLoading.value = false;
  }
}

watch(pageSize, () => {
  currentPage.value = 1;
});

onMounted(() => {
  loadCategories();
});
</script>
