<template>
  <AppLayout
    :show-back-button="true"
    :background="product?.img"
    :top-nav-title="product?.name"
  >
    <div class="p-4 max-w-2xl mx-auto">
      <ProductSkeleton v-if="loading" />

      <div v-else>
        <img
          :src="product?.img"
          alt="Imagem do produto"
          class="w-full h-56 object-cover mb-6 rounded-2xl shadow-lg"
        />

        <div class="flex items-center justify-between mb-4">
          <h1 class="text-xl font-semibold">{{ product?.name }}</h1>
          <span class="text-green-600 font-bold text-lg">
            {{ $formatPrice(product?.price?.[selectedSize]) }}
          </span>
        </div>

        <p class="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
          {{ product?.description }}
        </p>

        <div class="mb-6">
          <h4 class="font-medium mb-2">Quantidade</h4>
          <div class="flex items-center gap-4 w-36">
            <button
              @click="decreaseQuantity"
              class="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-md text-xl font-bold hover:bg-gray-300"
            >
              -
            </button>
            <span class="text-xl font-medium w-8 text-center">{{ localQuantity }}</span>
            <button
              @click="increaseQuantity"
              class="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-md text-xl font-bold hover:bg-gray-300"
            >
              +
            </button>
          </div>
        </div>

        <div v-if="product?.sizes?.length" class="mb-6">
          <h4 class="font-medium mb-2">
            Tamanho{{ product.sizes.length > 1 ? "s" : "" }}
          </h4>
          <div class="flex gap-2 flex-wrap">
            <div
              v-for="(size, index) in product.sizes"
              :key="index"
              @click="selectedSize = index"
              :class="[
                'cursor-pointer border rounded-md px-4 py-2 shadow-sm transition',
                selectedSize === index
                  ? 'bg-red-600 text-white border-red-700'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600',
              ]"
            >
              <div class="font-semibold">{{ size }}</div>
              <div class="text-sm">{{ $formatPrice(product.price?.[index]) }}</div>
            </div>
          </div>
        </div>

        <div v-if="extras.length" class="mb-6">
          <h4 class="font-medium mb-2">Adicionais</h4>
          <div class="flex flex-wrap gap-2">
            <label
              v-for="(extra, index) in extras"
              :key="index"
              :for="'extra-' + index"
              class="cursor-pointer border rounded-md px-4 py-2 flex flex-col items-center transition text-sm bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
              :class="{
                'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400': selectedExtras.includes(
                  extra
                ),
              }"
            >
              <input
                class="hidden"
                type="checkbox"
                :id="'extra-' + index"
                :value="extra"
                v-model="selectedExtras"
              />
              <span class="font-medium">{{ extra.name }}</span>
              <span class="text-xs text-red-500">{{ $formatPrice(extra.price) }}</span>
            </label>
          </div>
        </div>

        <Rating v-if="product" :rating="product.rating" class="mb-6" />

        <button
          @click="handleAddToCart"
          class="w-full bg-red-600 text-white font-semibold py-3 rounded-lg hover:bg-red-700 transition"
        >
          Adicionar ao Carrinho
        </button>

        <transition name="fade">
          <div
            v-if="showSuccess"
            class="m-4 fixed flex justify-center items-center space-x-2 top-4 transform bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50 border-l-4 border-l-green-800"
          >
            <i class="fa-regular fa-circle-check text-green-800" aria-hidden="true"></i>
            <span>Produto adicionado ao carrinho!</span>
          </div>
        </transition>
      </div>
    </div>
  </AppLayout>
</template>
<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCartStore } from "@/stores/cartStore";
import api from "@/services/httpClient";
import AppLayout from "@/layouts/AppLayout.vue";
import Rating from "@/components/Rating.vue";
import ProductSkeleton from "@/components/skeletons/ProductSkeleton.vue";

const PRODUCTS_LOCAL_STORAGE_KEY = "cached_products";

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();

const cartCount = computed(() => cartStore.items.length);
const product = ref(null);
const extras = ref([]);
const selectedSize = ref(0);
const selectedExtras = ref([]);
const localQuantity = ref(1);
const loading = ref(true);
const showSuccess = ref(false);

function increaseQuantity() {
  if (localQuantity.value < 10) localQuantity.value++;
}
function decreaseQuantity() {
  if (localQuantity.value > 1) localQuantity.value--;
}

async function fetchProductFromApi(slug) {
  try {
    const { data } = await api.get(`/products/${slug}`);
    product.value = data;
    extras.value = data.extras || [];
  } catch (err) {
    console.error("Erro ao carregar produto da API:", err);
    router.push("/");
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  const cachedProductsString = localStorage.getItem(PRODUCTS_LOCAL_STORAGE_KEY);
  const cachedProducts = cachedProductsString ? JSON.parse(cachedProductsString) : [];
  const slug = route.params.slug;

  const cachedProduct = cachedProducts.find((p) => p.slug === slug);

  if (cachedProduct) {
    product.value = cachedProduct;
    extras.value = cachedProduct.extras || [];
    loading.value = false;
    // Ainda buscar da API em segundo plano para garantir que os detalhes estejam atualizados
    fetchProductFromApi(slug);
  } else {
    await fetchProductFromApi(slug);
  }
});

function handleAddToCart() {
  if (!product.value) return;

  const basePrice = product.value.price?.[selectedSize.value] || 0;
  const extrasTotal = selectedExtras.value.reduce((acc, item) => acc + item.price, 0);
  const subtotal = (basePrice + extrasTotal) * localQuantity.value;

  cartStore.addItem({
    id: product.value.id,
    name: product.value.name,
    quantity: localQuantity.value,
    size: product.value.sizes?.[selectedSize.value],
    price: basePrice,
    extras: selectedExtras.value,
    subtotal,
    img: product.value.img,
    slug: product.value.slug, // Adicione o slug para referência futura se necessário
  });

  showSuccess.value = true;
  setTimeout(() => (showSuccess.value = false), 3000);
}
</script>
