<template>
  <!-- <nav class="border-b border-gray-200 px-4 py-2.5 bg-white dark:bg-gray-900 dark:border-gray-700 fixed left-0 right-0 top-0 z-50"
  >
    <div class="flex flex-wrap justify-between items-center">
      <div class="flex justify-start items-center">
        <button
          v-if="showBackButton"
          @click="goBack"
          class="flex items-center justify-center mr-4 text-gray-700 dark:text-white text-xl"
        >
          <i class="fas fa-arrow-left mr-2"></i>
          <span class="text-[14pt] font-semibold">{{ title }}</span>
        </button>
        <router-link v-else to="/" class="flex items-center justify-between mr-4">
          <img src="../assets/images/logo.png" class="mr-3 h-8" alt="Pizzaria da Nonna" />
          <span
            class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white"
          >
            {{ title }}
          </span>
        </router-link>
      </div>
      <div class="flex items-center lg:order-2">
        <ThemeToggle />
        <IconCart :cart-count="cartCount" />
      </div>
    </div>
  </nav> -->

  <header
    class="w-full h-[420px] bg-zinc-900 bg-cover bg-center relative"
    :style="{ backgroundImage: `url(${background})` }"
  >
    <div class="w-full h-full bg-black/50 backdrop-blur-sm absolute z-0"></div>
    <div class="w-full h-full flex flex-col justify-center items-center z-20 absolute">
      <img
        src="../assets/image/bg_header.jpg"
        alt="Pizzaria da Nonna"
        class="w-32 h-32 rounded-full , shadow-lg hover:scale-110 duration-200"
      />
      <h1 class="text-4x1 mt-4 font-bold text-white">{{ title }}</h1>
      <span class="text-white font-medium"
        >Rua de casa, Cajaziuras 11, Salvador - BA</span
      >
      <div class="px-4 py-1 rounded-lg mt-5" id="date-span">
        <span class="text-white">seg à domingo - 18:00 às 22:00</span>
      </div>
    </div>
    <div class="flex items-center lg:order-2 absolute right-5 top-5 z-50">
      <ThemeToggle />
      <IconCart :cart-count="cartCount" />
    </div>
  </header>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useCartStore } from "@/stores/cartStore";
import ThemeToggle from "@/components/ThemeToggle.vue";
import IconCart from "./icons/IconCart.vue";

// Props
defineProps({
  title: {
    type: String,
    default: "Pizzaria da Nonna",
  },
  showBackButton: {
    type: Boolean,
    default: false,
  },
  background: {
    type: String,
    default: new URL("../assets/image/bg_header.jpg", import.meta.url).href,
    required: false,
  },
});

// Carrinho via Pinia
const cartStore = useCartStore();
const cartCount = computed(() => cartStore.items.length);

// Voltar
const router = useRouter();
const goBack = () => router.back();

function checkRestaurantOpen() {
  const data = new Date();
  const hora = data.getHours();
  return hora >= 18 && hora < 22;
}

onMounted(() => {
  const spanItem = document.getElementById("date-span");

  if (spanItem) {
    const isOpen = checkRestaurantOpen();

    if (isOpen) {
      spanItem.classList.remove("bg-red-500");
      spanItem.classList.add("bg-green-500");
    } else {
      spanItem.classList.add("bg-red-500");
      spanItem.classList.remove("bg-green-500");
    }
  }
});
</script>
