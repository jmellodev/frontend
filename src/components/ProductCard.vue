<template>
  <div
    class="rounded-[8px] p-2 shadow-md flex flex-col justify-between bg-gray-200 dark:bg-gray-700 gap-4"
  >
    <!-- Imagem do produto ou fallback -->
    <router-link :to="'/produto/' + product.slug">
      <div
        class="h-32 rounded-md bg-cover bg-center shadow-md hover:shadow-lg object-contain hover:scale-110 hover:-rotate-2 duration-200"
        :style="{ backgroundImage: product.img ? `url(${product.img})` : 'none' }"
        :class="{ 'bg-emerald-500 dark:bg-amber-400': !product.img }"
      ></div>
    </router-link>

    <!-- Nome do produto -->
    <span class="font-semibold dark:text-gray-200 truncate">
      {{ product.name || "Produto sem nome" }}
    </span>

    <!-- Ratings fictícios -->
    <Rating
      v-if="product.rating > 0"
      :rating="product.rating"
      :show-text-rating="true"
      :rating-text="product.rating"
    />
    <div class="hidden"></div>

    <div class="flex flex-row justify-between items-baseline">
      <!-- Preço formatado -->
      <span class="text-sm font-medium text-gray-800 dark:text-white">
        {{ $formatPrice(product.price[0]) }}
      </span>

      <router-link
        :to="'/produto/' + product.slug"
        class="bg-gray-900 px-3 py-1 rounded-md shadow-lg shadow-gray-400 cursor-pointer hover:bg-gray-950"
      >
        <i class="fa fa-cart-plus text-white"></i>
      </router-link>
    </div>
  </div>
</template>

<script setup>
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
