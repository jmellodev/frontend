<template>
  <AdminLayout>
    <div class="space-y-6">
      <h2 class="text-3xl font-bold text-white">Produtos</h2>
      <p class="text-gray-400">Adicione, edite ou remova produtos do cardápio.</p>

      <button @click="openForm()" class="px-4 py-2 bg-green-600 rounded">
        Novo Produto
      </button>

      <div class="overflow-auto mt-4">
        <table class="min-w-full table-auto bg-gray-800 rounded-lg">
          <thead>
            <tr class="bg-gray-700">
              <th class="px-4 py-2 text-gray-300">Nome</th>
              <th class="px-4 py-2 text-gray-300">Preços</th>
              <th class="px-4 py-2 text-gray-300">Categorias</th>
              <th class="px-4 py-2 text-gray-300">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="p in paginatedProducts"
              :key="p.id"
              class="border-b border-gray-700"
            >
              <td class="px-4 py-2 text-gray-200">
                {{ p.name }}
                <div v-if="p.extras?.length" class="text-sm text-gray-400 mt-1">
                  <div v-for="(extra, i) in p.extras" :key="i">
                    {{ extra.name }} - R$ {{ Number(extra.price).toFixed(2) }}
                  </div>
                </div>
              </td>
              <td class="px-4 py-2 text-gray-200 whitespace-pre-line">
                <div v-for="(price, i) in p.price" :key="i">
                  {{ p.sizes[i] }} - R$ {{ Number(price).toFixed(2) }}
                </div>
              </td>
              <td class="px-4 py-2 text-gray-200">
                {{ getCategoryNames(p.categoryIds) }}
              </td>
              <td class="px-4 py-2 text-gray-200">
                <button @click="openForm(p)" class="px-3 py-1 bg-yellow-600 rounded mr-2">
                  Editar
                </button>
                <button @click="askDelete(p)" class="px-3 py-1 bg-red-600 rounded">
                  Excluir
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="flex justify-between items-center mt-6 text-white">
          <span>Total de itens: {{ totalItems }}</span>

          <div class="flex items-center gap-2">
            <label for="pageSize" class="text-sm text-gray-300">Itens por página:</label>
            <div class="relative">
              <select
                id="pageSize"
                v-model.number="pageSize"
                class="appearance-none bg-gray-700 text-white border border-gray-600 rounded px-3 py-1 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option :value="3">3</option>
                <option :value="5">5</option>
                <option :value="10">10</option>
                <option :value="25">25</option>
              </select>
              <div
                class="pointer-events-none absolute inset-y-0 right-2 flex items-center text-white"
              >
                ▼
              </div>
            </div>

            <button
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="px-2 py-1 bg-gray-700 rounded disabled:opacity-50"
            >
              &lt; Anterior
            </button>
            <span class="px-2">Página {{ currentPage }} de {{ totalPages }}</span>
            <button
              @click="currentPage++"
              :disabled="currentPage >= totalPages"
              class="px-2 py-1 bg-gray-700 rounded disabled:opacity-50"
            >
              Próximo &gt;
            </button>
          </div>
        </div>
      </div>

      <!-- Modal -->
      <div
        v-if="showForm"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div
          class="bg-gray-900 p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto"
        >
          <h3 class="text-xl font-bold mb-4">
            {{ form.id ? "Editar" : "Novo" }} Produto
          </h3>

          <input
            v-model="form.name"
            placeholder="Nome"
            class="w-full mb-2 p-2 bg-gray-800 rounded"
          />
          <textarea
            v-model="form.description"
            placeholder="Descrição"
            class="w-full mb-2 p-2 bg-gray-800 rounded"
          />
          <input
            v-model="form.img"
            placeholder="URL da imagem"
            class="w-full mb-2 p-2 bg-gray-800 rounded"
          />

          <!-- Múltiplas categorias -->
          <select
            v-model="form.categoryIds"
            multiple
            class="w-full mb-4 p-2 bg-gray-800 rounded text-white"
          >
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>

          <!-- Tamanhos e preços -->
          <div class="mb-2">
            <p class="text-sm text-gray-300 mb-1">Tamanhos e preços:</p>
            <div
              v-for="(price, index) in form.price"
              :key="index"
              class="flex items-center mb-1 gap-2"
            >
              <input
                v-model="form.sizes[index]"
                placeholder="Tamanho"
                class="w-1/2 p-2 bg-gray-800 rounded"
              />
              <input
                v-model.number="form.price[index]"
                type="number"
                placeholder="Preço"
                class="w-1/3 p-2 bg-gray-800 rounded"
              />
              <button @click="removeSize(index)" class="text-red-400 text-sm">x</button>
            </div>
            <button @click="addSizePrice()" class="text-sm text-blue-400 underline mt-1">
              + Adicionar tamanho
            </button>
          </div>

          <!-- Adicionais -->
          <div class="mt-4 mb-2">
            <p class="text-sm text-gray-300 mb-1">Adicionais:</p>
            <div
              v-for="(extra, index) in form.extras"
              :key="index"
              class="flex items-center gap-2 mb-1"
            >
              <input
                v-model="extra.name"
                placeholder="Adicional"
                class="w-2/3 p-2 bg-gray-800 rounded"
              />
              <input
                v-model.number="extra.price"
                type="number"
                placeholder="Preço"
                class="w-1/3 p-2 bg-gray-800 rounded"
              />
              <button @click="removeExtra(index)" class="text-red-400 text-sm">x</button>
            </div>
            <button @click="addExtra()" class="text-sm text-blue-400 underline mt-1">
              + Adicionar adicional
            </button>
          </div>

          <!-- Ações -->
          <div class="flex justify-end mt-4 gap-2">
            <button @click="save()" class="px-4 py-2 bg-blue-600 rounded">Salvar</button>
            <button @click="showForm = false" class="px-4 py-2 bg-gray-600 rounded">
              Cancelar
            </button>
          </div>
        </div>
      </div>

      <!-- Modal de confirmação de exclusão -->
      <BaseModal v-if="showDeleteModal" @close="showDeleteModal = false">
        <template #default>
          <p class="text-white">
            Tem certeza que deseja excluir o produto
            <strong>{{ productToDelete?.name }}</strong
            >?
          </p>
          <div class="mt-4 flex justify-end gap-2">
            <button @click="deleteProduct" class="px-4 py-2 bg-red-600 rounded">
              Excluir
            </button>
            <button
              @click="showDeleteModal = false"
              class="px-4 py-2 bg-gray-600 rounded"
            >
              Cancelar
            </button>
          </div>
        </template>
      </BaseModal>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import api from "@/services/httpClient";
import AdminLayout from "@/layouts/AdminLayout.vue";
import BaseModal from "@/components/modals/BaseModal.vue";

const products = ref([]);
const categories = ref([]);
const showForm = ref(false);
const showDeleteModal = ref(false);
const productToDelete = ref(null);
const currentPage = ref(1);
const pageSize = ref(3);
const totalItems = ref(0);

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return products.value.slice(start, start + pageSize.value);
});

const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value));

const form = ref({
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

// Slug automático
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
  if (product) {
    form.value = JSON.parse(JSON.stringify(product));
  } else {
    resetForm();
  }
  showForm.value = true;
}

function addSizePrice() {
  form.value.sizes.push("");
  form.value.price.push("");
}

function removeSize(index) {
  form.value.sizes.splice(index, 1);
  form.value.price.splice(index, 1);
}

function addExtra() {
  form.value.extras.push({ name: "", price: "" });
}

function removeExtra(index) {
  form.value.extras.splice(index, 1);
}

async function save() {
  const data = { ...form.value };
  if (data.id) {
    await api.put(`/products/${data.id}`, data);
  } else {
    await api.post("/products", data);
  }
  showForm.value = false;
  await load();
}

function askDelete(product) {
  productToDelete.value = product;
  showDeleteModal.value = true;
}

async function deleteProduct() {
  await api.delete(`/products/${productToDelete.value.id}`);
  showDeleteModal.value = false;
  await load();
}

function getCategoryNames(ids) {
  return ids
    ?.map((id) => categories.value.find((cat) => cat.id === id)?.name)
    .filter(Boolean)
    .join(", ");
}

async function load() {
  const res = await api.get("/products");
  products.value = res.data;
  totalItems.value = res.data.length;
}

async function loadCategories() {
  const res = await api.get("/categories");
  categories.value = res.data;
}

watch(pageSize, () => {
  currentPage.value = 1;
});

onMounted(() => {
  load();
  loadCategories();
});
</script>
