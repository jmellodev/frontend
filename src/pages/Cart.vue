<template>
  <AppLayout :is-header-visible="false" :top-nav-visible="true" top-nav-title="Carrinho">
    <div class="container mx-auto p-4">
      <h2 class="text-2xl font-semibold mb-4 dark:text-gray-200">
        Meu Carrinho ({{ itemCount }})
      </h2>

      <div v-if="itemCount === 0" class="text-gray-500 dark:text-gray-400">
        Seu carrinho está vazio. Adicione deliciosos itens ao seu pedido!
      </div>

      <div v-else class="grid grid-cols-1 gap-4">
        <div
          v-for="item in cartItems"
          :key="generateCartItemId(item)"
          class="flex items-center border rounded-md shadow-sm p-4 dark:bg-gray-800 dark:border-gray-700"
        >
          <router-link :to="'/produto/' + item.slug" class="w-24 h-24 mr-4">
            <div
              class="w-full h-full rounded-md bg-cover bg-center shadow-md"
              :style="{ backgroundImage: item.img ? `url(${item.img})` : 'none' }"
              :class="{ 'bg-emerald-500 dark:bg-amber-400': !item.img }"
            ></div>
          </router-link>

          <div class="flex-grow">
            <router-link
              :to="'/produto/' + item.slug"
              class="font-semibold dark:text-gray-200 hover:underline"
            >
              {{ item.name || "Item sem nome" }}
            </router-link>
            <div v-if="item.size" class="text-gray-600 dark:text-gray-400 text-sm">
              Tamanho: {{ item.size }}
            </div>
            <div
              v-if="item.extras && item.extras.length > 0"
              class="text-gray-600 dark:text-gray-400 text-sm"
            >
              Extras: {{ item.extras.map((extra) => extra.name).join(", ") }}
            </div>
            <p class="text-gray-600 dark:text-gray-400 text-sm">
              Preço Unitário:
              {{
                $formatPrice(
                  item.price + item.extras.reduce((acc, extra) => acc + extra.price, 0)
                )
              }}
            </p>
            <div class="flex items-center mt-2">
              <label
                for="quantity"
                class="mr-2 text-sm text-gray-700 dark:text-gray-300 sr-only"
              >
                Quantidade:
              </label>
              <div
                class="flex items-center border rounded-md shadow-sm dark:border-gray-700"
              >
                <button
                  @click="decrementQuantity(item)"
                  class="px-2 py-1 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 focus:outline-none"
                >
                  <i class="fa fa-minus"></i>
                </button>
                <span class="w-8 text-center text-gray-700 dark:text-gray-300">{{
                  item.quantity
                }}</span>
                <button
                  @click="incrementQuantity(item)"
                  class="px-2 py-1 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 focus:outline-none"
                >
                  <i class="fa fa-plus"></i>
                </button>
              </div>
            </div>
          </div>
          <button
            @click="removeFromCart(item)"
            class="text-red-500 hover:text-red-700 focus:outline-none"
          >
            <i class="fa fa-trash"></i>
          </button>
        </div>
      </div>

      <div v-if="itemCount > 0" class="mt-8 border-t pt-4 dark:border-gray-700">
        <div class="flex justify-between items-center dark:text-gray-200">
          <span class="font-semibold">Total do Pedido:</span>
          <span class="text-xl font-bold">{{ $formatPrice(cartTotal) }}</span>
        </div>
        <button
          class="bg-emerald-500 container hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded-md shadow-md mt-4"
          @click="checkout"
        >
          Finalizar Pedido
        </button>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import AppLayout from "@/layouts/AppLayout.vue";
import { useCartStore } from "@/stores/cartStore";
import { computed } from "vue";
import { useRouter } from "vue-router";

const cartStore = useCartStore();
const router = useRouter();

const cartItems = computed(() => cartStore.items);
const itemCount = computed(() => cartStore.items.length);
const cartTotal = computed(() => cartStore.total);

const removeFromCart = (item) => {
  cartStore.removeItem(item);
};

const updateQuantity = (item, quantity) => {
  // Certifique-se de que a quantidade seja pelo menos 1
  if (quantity >= 1) {
    // Encontre o índice do item correto no carrinho
    const index = cartStore.items.value.findIndex(
      (i) =>
        i.id === item.id && i.size === item.size && areExtrasEqual(i.extras, item.extras)
    );

    if (index !== -1) {
      // Crie uma cópia do array para manter a reatividade
      const updatedItems = [...cartStore.items.value];
      // Atualize a quantidade do item na cópia
      updatedItems[index].quantity = quantity;
      // Atribua a cópia atualizada de volta ao ref
      cartStore.items.value = updatedItems;
    } else {
      console.warn("Item não encontrado no carrinho para atualização:", item);
    }
  }
};

const decrementQuantity = (item) => {
  if (item.quantity > 1) {
    updateQuantity(item, item.quantity - 1);
  }
};

const incrementQuantity = (item) => {
  updateQuantity(item, item.quantity + 1);
};

const checkout = () => {
  console.log("Finalizar Pedido!");
  router.push("/checkout"); // Redirecione para a página de checkout, se existir
};

const generateCartItemId = (item) => {
  // Cria um ID único para cada item no carrinho, considerando suas opções
  let id = item.id;
  if (item.size) id += `-${item.size}`;
  if (item.extras && item.extras.length > 0) {
    id += `-${item.extras.map((e) => e.name).join("-")}`;
  }
  return id;
};

const areExtrasEqual = (a, b) => {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort((x, y) => x.name.localeCompare(y.name));
  const sortedB = [...b].sort((x, y) => x.name.localeCompare(y.name));
  return sortedA.every(
    (extra, index) =>
      extra.name === sortedB[index].name && extra.price === sortedB[index].price
  );
};
</script>

<style scoped>
/* Estilos específicos para a página de carrinho */
</style>
