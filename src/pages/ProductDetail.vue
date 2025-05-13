<template>
  <AppLayout
    :is-header-visible="false"
    :mobile-menu-visible="true"
    :cart-count="cartCount"
    :background="product?.img"
    top-nav-visible="true"
    :top-nav-title="product?.name"
  >
    <div class="p-4 max-w-2xl mx-auto">
      <!-- Loading Spinner -->
      <ProductSkeleton v-if="loading" />

      <!-- Produto -->
      <div v-else>
        <img
          :src="product?.img"
          alt="Imagem do produto"
          class="w-full h-56 object-cover mb-6 rounded-2xl shadow-lg"
        />

        <!-- Título e Preço -->
        <div class="flex items-center justify-between mb-4">
          <h1 class="text-xl font-semibold">{{ product?.name }}</h1>
          <span class="text-green-600 font-bold text-lg">
            {{ $formatPrice(product?.price[0]) }}
          </span>
        </div>

        <p class="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
          {{ product?.description }}
        </p>

        <!-- Quantidade -->
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

        <!-- Tamanhos -->
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
              <div class="text-sm">{{ $formatPrice(product.price[index]) }}</div>
            </div>
          </div>
        </div>

        <!-- Adicionais -->
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

        <!-- Avaliações -->
        <Rating v-if="product" :rating="product.rating" class="mb-6" />

        <!-- Botão adicionar ao carrinho -->
        <button
          @click="handleAddToCart"
          class="w-full bg-red-600 text-white font-semibold py-3 rounded-lg hover:bg-red-700 transition"
        >
          Adicionar ao Carrinho
        </button>

        <transition name="fade">
          <div
            v-if="showSuccess"
            class="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50"
          >
            Produto adicionado ao carrinho!
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

async function fetchProduct() {
  try {
    const { data } = await api.get(`/products/${route.params.slug}`);
    product.value = data;
    extras.value = data.extras || [];
  } catch (err) {
    console.error("Erro ao carregar produto:", err);
    router.push("/");
  } finally {
    loading.value = false;
  }
}

function handleAddToCart() {
  const basePrice = product.value.price[selectedSize.value];
  const extrasTotal = selectedExtras.value.reduce((acc, item) => acc + item.price, 0);
  const subtotal = (basePrice + extrasTotal) * localQuantity.value;

  cartStore.addItem({
    id: product.value.id,
    name: product.value.name,
    quantity: localQuantity.value,
    size: product.value.sizes[selectedSize.value],
    price: basePrice,
    extras: selectedExtras.value,
    subtotal,
    img: product.value.img,
  });

  showSuccess.value = true;
  setTimeout(() => (showSuccess.value = false), 2000);
}

onMounted(fetchProduct);
</script>
