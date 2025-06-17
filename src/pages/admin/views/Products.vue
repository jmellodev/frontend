<template>
  <div>
    <AdminLayout>
      <div class="space-y-6  p-4 md:p-8 bg-white dark:bg-gray-900 rounded-lg shadow-xl">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white">Produtos</h2>
        <p class="text-gray-600 dark:text-gray-400">Adicione, edite ou remova produtos do cardápio.</p>

        <button @click="openForm()"
          class="px-5 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md transition-colors duration-200">
          Novo Produto
        </button>

        <div v-if="isLoading" class="text-center py-8">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-400 dark:border-gray-600 mx-auto">
          </div>
          <p class="text-gray-600 dark:text-gray-400 mt-4">Carregando produtos...</p>
        </div>

        <div v-else-if="products.length === 0 && !isLoading" class="text-center py-8">
          <p class="text-gray-600 dark:text-gray-400 text-lg">Nenhum produto encontrado.</p>
        </div>

        <div v-else class="overflow-x-auto mt-4 rounded-lg">
          <table class="min-w-full table-auto bg-gray-100 dark:bg-gray-800">
            <thead>
              <tr class="bg-gray-400 dark:bg-gray-700">
                <th
                  class="py-3 px-2 text-left text-gray-700 dark:text-gray-300 uppercase text-sm leading-normal hidden md:block">
                  img
                </th>
                <th class="py-3 text-left text-gray-700 dark:text-gray-300 uppercase text-sm leading-normal">Nome
                </th>
                <th class="py-3 text-left text-gray-700 dark:text-gray-300 uppercase text-sm leading-normal">Preços
                </th>
                <th class="py-3 text-left text-gray-700 dark:text-gray-300 uppercase text-sm leading-normal">
                  Categorias</th>
                <th class="py-3 text-center text-gray-700 dark:text-gray-300 uppercase text-sm leading-normal">Ações
                </th>
              </tr>
            </thead>
            <tbody class="text-gray-800 dark:text-gray-200 text-sm font-light">
              <tr v-for="p in paginatedProducts" :key="p.id"
                class="border-b border-gray-300 dark:border-gray-700 hover:bg-gray-300 dark:hover:bg-gray-700 cursor-default transition-colors duration-300">
                <td class="py-2 px-2 text-left whitespace-nowrap hidden md:table-cell">
                  <img :src="p.img" :alt="p.name"
                    class="w-12 h-12 object-cover rounded-md shadow-sm border border-gray-300 dark:border-gray-700">
                </td>
                <td class="py-3 text-left whitespace-nowrap">
                  {{ p.name }}
                  <div v-if="p.extras && p.extras.length > 0" class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    <p class="font-semibold">Adicionais:</p>
                    <div v-for="(extra, i) in p.extras" :key="i">
                      {{ extra.name }} - {{ $formatPrice(extra.price) }}
                    </div>
                  </div>
                </td>
                <td class="py-3 text-left whitespace-pre-line">
                  <div v-if="p.price && Array.isArray(p.price) && p.price.length > 0">
                    <div v-if="p.sizes && Array.isArray(p.sizes) && p.price.length === p.sizes.length">
                      <div v-for="(price, i) in p.price" :key="i">
                        {{ p.sizes[i] }} - {{ $formatPrice(price) }}
                      </div>
                    </div>
                    <div v-else>
                      <div v-for="(price, i) in p.price" :key="i">
                        {{ $formatPrice(price) }}
                      </div>
                    </div>
                  </div>
                  <div v-else class="text-red-600 dark:text-red-400">Dados de preço ausentes ou inválidos.</div>
                </td>
                <td class="py-3 text-left">
                  {{ getCategoryNames(p.categoryIds) }}
                </td>
                <td class="py-3 text-right">
                  <button @click="openForm(p)" title="Editar Produto"
                    class="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-l-md transition-colors duration-200">
                    <i class="fa-duotone fa-edit"></i>
                  </button>
                  <button @click="askDelete(p)" title="Excluir Produto"
                    class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-r-md transition-colors duration-200">
                    <i class="fa-duotone fa-trash"></i>
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
      <div class="">
        <button @click="showForm = false"
          class="absolute top-3 right-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-xl">
          &times;
        </button>
        <h3 class="text-2xl font-bold mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
          {{ form.id ? "Editar" : "Novo" }} Produto
        </h3>

        <div v-if="isFormLoading" class="text-center py-4">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400 dark:border-gray-600 mx-auto">
          </div>
          <p class="text-gray-600 dark:text-gray-400 mt-2">Salvando...</p>
        </div>

        <div v-else class="space-y-4">
          <input v-model="form.name" placeholder="Nome do Produto"
            class="w-full p-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <textarea v-model="form.description" placeholder="Descrição do Produto" rows="3"
            class="w-full p-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input v-model="form.img" placeholder="URL da imagem (ex: https://exemplo.com/imagem.jpg)"
            class="w-full p-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />

          <div>
            <MultiSelectCategoryInput v-model="form.categoryIds" :categories="categories" class="w-full" />


            <!-- Select -->

            <!-- End Select -->
            <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">Segure Ctrl/Cmd para selecionar múltiplas.</p>
          </div>

          <div class="border border-gray-300 dark:border-gray-700 p-3 rounded-md">
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preços e Tamanhos:</p>
            <div v-for="(price, index) in form.price" :key="index" class="flex items-center mb-2 gap-2">
              <input v-model="form.sizes[index]" placeholder="Tamanho (Opcional)"
                class="w-full p-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input v-model.number="form.price[index]" type="number" step="0.01" placeholder="Preço"
                class="w-24 p-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <button @click="removeSize(index)"
                class="text-red-500 hover:text-red-400 text-xl transition-colors duration-200">
                &times;
              </button>
            </div>
            <button @click="addSizePrice()" class="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-2">
              + Adicionar Preço/Tamanho
            </button>
          </div>


          <div>
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Adicionais:</p>
            <div v-for="(extra, index) in form.extras" :key="index" class="flex items-center gap-2 mb-2">
              <input v-model="extra.name" placeholder="Nome do Adicional"
                class="flex-1 p-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input v-model.number="extra.price" type="number" step="0.01" placeholder="Preço"
                class="w-24 p-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <button @click="removeExtra(index)"
                class="text-red-500 hover:text-red-400 text-xl transition-colors duration-200">
                &times;
              </button>
            </div>
            <button @click="addExtra()" class="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-2">
              + Adicionar adicional
            </button>
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
        class="absolute top-3 right-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-xl">
        &times;
      </button>
      <p class="text-lg mb-4">
        Tem certeza que deseja excluir o produto
        <strong class="text-red-600 dark:text-red-400">{{ productToDelete?.name }}</strong>? Esta ação é
        irreversível.
      </p>
      <div class="mt-6 flex justify-end gap-3">
        <button @click="deleteProduct" :disabled="isFormLoading"
          class="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
          Excluir
        </button>
        <button @click="showDeleteModal = false" :disabled="isFormLoading"
          class="px-5 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
          Cancelar
        </button>
      </div>

    </BaseModal>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import api from "@/services/httpClient";
import AdminLayout from "@/layouts/AdminLayout.vue";
import BaseModal from "@/components/modals/BaseModal.vue";
import MultiSelectCategoryInput from "@/components/forms/MultiSelectCategoryInput.vue";

const products = ref([]);
const categories = ref([]);
const showForm = ref(false);
const showDeleteModal = ref(false);
const productToDelete = ref(null);
const currentPage = ref(1);
const pageSize = ref(10);
const totalItems = ref(0);
const isLoading = ref(true);
const isFormLoading = ref(false);

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return Array.isArray(products.value) ? products.value.slice(start, start + pageSize.value) : [];
});

const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value));

const form = ref({
  id: null,
  name: "",
  slug: "",
  description: "",
  img: "",
  sizes: [],
  price: [],
  extras: [],
  categoryIds: [],
});

function resetForm() {
  form.value = {
    id: null,
    name: "",
    slug: "",
    description: "",
    img: "",
    sizes: [],
    price: [],
    extras: [],
    categoryIds: [],
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

function openForm(product = null) {
  resetForm();
  if (product) {
    const productCopy = JSON.parse(JSON.stringify(product));
    form.value.id = productCopy.id;
    form.value.name = productCopy.name;
    form.value.slug = productCopy.slug;
    form.value.description = productCopy.description;
    form.value.img = productCopy.img;
    form.value.extras = productCopy.extras || [];
    form.value.categoryIds = productCopy.categoryIds || [];

    form.value.price = Array.isArray(productCopy.price) ? productCopy.price : [];
    form.value.sizes = Array.isArray(productCopy.sizes) ? productCopy.sizes : [];

    while (form.value.sizes.length < form.value.price.length) {
      form.value.sizes.push('');
    }
  }
  showForm.value = true;
}

function addSizePrice() {
  form.value.sizes.push("");
  form.value.price.push(0);
}

function removeSize(index) {
  form.value.sizes.splice(index, 1);
  form.value.price.splice(index, 1);
}

function addExtra() {
  form.value.extras.push({ name: "", price: 0 });
}

function removeExtra(index) {
  form.value.extras.splice(index, 1);
}

async function save() {
  isFormLoading.value = true;
  try {
    const dataToSave = { ...form.value };

    dataToSave.price = dataToSave.price.map(p => Number(p)).filter(p => !isNaN(p));
    dataToSave.extras = dataToSave.extras.map(e => ({ ...e, price: Number(e.price) })).filter(e => e.name && !isNaN(e.price));

    if (dataToSave.sizes.length !== dataToSave.price.length) {
      dataToSave.sizes = [];
      console.warn("Número de tamanhos não corresponde ao número de preços. Enviando tamanhos vazios.");
    } else {
      dataToSave.sizes = dataToSave.sizes.filter((s, i) => dataToSave.price[i] !== undefined);
    }

    if (dataToSave.price.length === 0) {
      dataToSave.sizes = [];
    }


    if (dataToSave.id) {
      await api.put(`/products/${dataToSave.id}`, dataToSave);
      console.log(`Produto ${dataToSave.name} (ID: ${dataToSave.id}) atualizado com sucesso.`);
    } else {
      await api.post("/products", dataToSave);
      console.log(`Novo produto '${dataToSave.name}' criado com sucesso.`);
    }
    showForm.value = false;
    await loadProducts();
  } catch (err) {
    console.error("Erro ao salvar produto:", err.response?.data || err.message);
  } finally {
    isFormLoading.value = false;
  }
}

function askDelete(product) {
  productToDelete.value = product;
  showDeleteModal.value = true;
}

async function deleteProduct() {
  isFormLoading.value = true;
  try {
    if (productToDelete.value && productToDelete.value.id) {
      await api.delete(`/products/${productToDelete.value.id}`);
      console.log(`Produto '${productToDelete.value.name}' (ID: ${productToDelete.value.id}) excluído com sucesso.`);
      showDeleteModal.value = false;
      productToDelete.value = null;
      await loadProducts();
    }
  } catch (err) {
    console.error("Erro ao excluir produto:", err.response?.data || err.message);
  } finally {
    isFormLoading.value = false;
  }
}

function getCategoryNames(ids) {
  if (!ids || !Array.isArray(ids) || categories.value.length === 0) return "";
  return ids
    .map((id) => categories.value.find((cat) => cat.id === id)?.name)
    .filter(Boolean)
    .join(", ");
}

async function loadProducts() {
  isLoading.value = true;
  try {
    console.log("Tentando carregar produtos...");
    const res = await api.get("/products");
    console.log("Produtos recebidos da API:", res.data);

    products.value = Array.isArray(res.data) ? res.data : [];
    totalItems.value = products.value.length;

    if (totalPages.value > 0 && currentPage.value > totalPages.value) {
      currentPage.value = totalPages.value;
    } else if (totalPages.value === 0) {
      currentPage.value = 1;
    }
    console.log(`Produtos carregados. Total: ${totalItems.value}, Página: ${currentPage.value}/${totalPages.value}`);
  } catch (err) {
    console.error("Erro ao carregar produtos:", err.response?.data || err.message);
  } finally {
    isLoading.value = false;
  }
}

async function loadCategories() {
  try {
    console.log("Tentando carregar categorias...");
    const res = await api.get("/categories");
    categories.value = Array.isArray(res.data) ? res.data : [];
    console.log("Categorias recebidas da API:", categories.value.length);
  } catch (err) {
    console.error("Erro ao carregar categorias:", err.response?.data || err.message);
  }
}

watch(pageSize, () => {
  currentPage.value = 1;
});

onMounted(() => {
  loadProducts();
  loadCategories();
});
</script>

<style scoped>
/* Estilos específicos para este componente, se necessário */
</style>
