<template>
  <div
    class="rounded-[8px] p-2 shadow flex flex-col justify-between bg-white dark:bg-gray-800 gap-4 border border-gray-200 dark:border-gray-700">
    <!-- Imagem do produto ou fallback -->
    <router-link :to="'/produto/' + product.slug">
      <div class="h-32 rounded-md bg-cover bg-center shadow-md hover:shadow-lg object-contain"
        :style="{ backgroundImage: product.img ? `url(${product.img})` : 'none' }"
        :class="{ 'bg-emerald-500 dark:bg-amber-400': !product.img }"></div>
    </router-link>

    <!-- Nome do produto -->
    <span class="font-semibold dark:text-gray-200 truncate">
      {{ product.name || "Produto sem nome" }}
    </span>

    <div class="flex justify-between items-center">
      <Rating :product-id="product.id" :rating="product.rating" :show-text-rating="true"
        :rating-text="product.rating" />
      <IconFavorite :product="product" />
    </div>
    <div class="hidden"></div>

    <div class="flex flex-row justify-between items-baseline">
      <!-- Preço formatado -->
      <span class="text-sm font-medium text-gray-800 dark:text-white">
        {{ $formatPrice(product.price[0]) }}
      </span>

      <router-link :to="'/produto/' + product.slug"
        class="bg-gray-900 px-3 py-1 rounded-md shadow-md dark:shadow-gray-800 shadow-gray-400 cursor-pointer hover:bg-gray-950">
        <i class="fa fa-cart-plus text-white"></i>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import IconFavorite from "./icons/IconFavorite.vue";
import Rating from "./Rating.vue";

const props = defineProps({
  product: {
    type: Object,
    required: true,
    default: () => ({
      name: "Sem nome",
      price: [0],
      image: null,
    }),
  },
});
</script>
