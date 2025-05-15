<template>
  <AppLayout top-nav-title="Monte Sua Pizza">
    <div class="container mx-auto p-4">
      <h2 class="text-2xl font-semibold mb-6 dark:text-gray-200">Monte Sua Pizza</h2>

      <div class="mb-4">
        <label
          for="pizza-size"
          class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
        >
          Tamanho da Pizza:
        </label>
        <select id="pizza-size" v-model="selectedSize" class="input">
          <option v-for="size in sizes" :key="size.name" :value="size">
            {{ size.name }} (Máx. {{ size.maxSabor }} sabores) -
            {{ $formatPrice(size.price) }}
          </option>
        </select>
        <p v-if="selectedSize" class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Você pode escolher até {{ selectedSize.maxSabor }} sabores.
        </p>
      </div>

      <div class="mb-4">
        <h3 class="text-xl font-semibold mb-2 dark:text-gray-100">Sabores</h3>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          <label v-for="sabor in sabores" :key="sabor.name" class="flex items-center">
            <input
              type="checkbox"
              :value="sabor"
              v-model="selectedSabores"
              :disabled="
                selectedSabores.length >= selectedMaxSabores && !isSelected(sabor)
              "
              class="mr-2"
            />
            <span>{{ sabor.name }} - {{ $formatPrice(sabor.price) }}</span>
          </label>
        </div>
        <p
          v-if="selectedSabores.length > selectedMaxSabores"
          class="text-red-500 text-sm mt-1"
        >
          Você selecionou mais sabores do que o permitido para este tamanho.
        </p>
        <div v-if="selectedSabores.length > 1 && selectedSize?.maxSabor > 1" class="mt-2">
          <h4 class="font-semibold mb-1 dark:text-gray-100">Metades:</h4>
          <div
            v-for="(sabor, index) in selectedSabores"
            :key="'metade-' + index"
            class="flex items-center mb-1"
          >
            <span class="mr-2">{{ sabor.name }}:</span>
            <select v-model="saboresMetade[index]" class="input-sm">
              <option value="inteira">Inteira</option>
              <option v-if="selectedSabores.length === 2" value="metade">Metade</option>
            </select>
          </div>
        </div>
      </div>

      <div class="mb-4">
        <h3 class="text-xl font-semibold mb-2 dark:text-gray-100">Adicionais</h3>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          <label
            v-for="adicional in adicionais"
            :key="adicional.name"
            class="flex items-center"
          >
            <input
              type="checkbox"
              :value="adicional"
              v-model="selectedAdicionais"
              class="mr-2"
            />
            <span>{{ adicional.name }} - {{ $formatPrice(adicional.price) }}</span>
          </label>
        </div>
      </div>

      <div class="mb-4">
        <label
          for="pizza-borda"
          class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
        >
          Borda:
        </label>
        <select id="pizza-borda" v-model="selectedBorda" class="input">
          <option :value="null">Sem Borda</option>
          <option v-for="borda in bordas" :key="borda.name" :value="borda">
            {{ borda.name }} - {{ $formatPrice(borda.price) }}
          </option>
        </select>
      </div>

      <div class="mt-8 border-t pt-4 dark:border-gray-700">
        <h3 class="text-xl font-semibold mb-2 dark:text-gray-100">Resumo:</h3>
        <p v-if="selectedSize">
          Tamanho: {{ selectedSize.name }} - {{ $formatPrice(selectedSize.price) }}
        </p>
        <p v-if="selectedSabores.length > 0">
          Sabores:
          <span v-for="(sabor, index) in selectedSabores" :key="sabor.name">
            {{ sabor.name
            }}<span v-if="saboresMetade[index] === 'metade'"> (Metade)</span>
            <span v-if="index < selectedSabores.length - 1"> | </span>
            {{ $formatPrice(sabor.price / (saboresMetade[index] === "metade" ? 2 : 1)) }}
          </span>
        </p>
        <p v-if="selectedAdicionais.length > 0">
          Adicionais:
          <span v-for="(adicional, index) in selectedAdicionais" :key="adicional.name">
            {{ adicional.name }} {{ $formatPrice(adicional.price)
            }}<span v-if="index < selectedAdicionais.length - 1">, </span>
          </span>
        </p>
        <p v-if="selectedBorda">
          Borda: {{ selectedBorda.name }} - {{ $formatPrice(selectedBorda.price) }}
        </p>
        <div class="flex justify-between items-center mt-4 dark:text-gray-200">
          <span class="font-semibold">Preço Total:</span>
          <span class="text-xl font-bold">{{ $formatPrice(totalPrice) }}</span>
        </div>
        <button
          @click="addToCart"
          :disabled="
            selectedSabores.length < 2 || selectedSabores.length > selectedMaxSabores
          "
          class="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg shadow-md mt-4 focus:outline-none focus:shadow-outline"
        >
          Adicionar ao Carrinho
        </button>
        <p
          v-if="selectedSabores.length < 2 || selectedSabores.length > selectedMaxSabores"
          class="text-red-500 text-sm mt-1"
        >
          Selecione de 2 a {{ selectedMaxSabores }} sabores para adicionar ao carrinho.
        </p>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed } from "vue";
import { useCartStore } from "@/stores/cartStore";
import AppLayout from "@/layouts/AppLayout.vue";

const cartStore = useCartStore();

// Dados de exemplo (você buscaria isso de uma API ou configuraria)
const sizes = ref([
  { name: "Média", maxSabor: 2, price: 25 },
  { name: "Grande", maxSabor: 4, price: 35 },
]);
const sabores = ref([
  { name: "Calabresa", price: 10 },
  { name: "Pepperoni", price: 12 },
  { name: "Margherita", price: 9 },
  { name: "Frango com Catupiry", price: 11 },
  { name: "Portuguesa", price: 10 },
  { name: "Quatro Queijos", price: 13 },
]);
const adicionais = ref([
  { name: "Queijo Extra", price: 5 },
  { name: "Azeitonas", price: 3 },
  { name: "Bacon", price: 6 },
  { name: "Cebola Caramelizada", price: 4 },
]);
const bordas = ref([
  { name: "Catupiry", price: 7 },
  { name: "Cheddar", price: 8 },
  { name: "Chocolate", price: 9 },
]);

const selectedSize = ref(sizes.value[0]);
const selectedSabores = ref([]);
const selectedAdicionais = ref([]);
const selectedBorda = ref(null);
const saboresMetade = ref([]);

const selectedMaxSabores = computed(() =>
  selectedSize.value ? selectedSize.value.maxSabor : 0
);

const isSelected = (sabor) => selectedSabores.value.some((s) => s.name === sabor.name);

const totalPrice = computed(() => {
  let price = selectedSize.value ? selectedSize.value.price : 0;
  selectedSabores.value.forEach((sabor, index) => {
    price += sabor.price / (saboresMetade.value[index] === "metade" ? 2 : 1);
  });
  selectedAdicionais.value.forEach((adicional) => {
    price += adicional.price;
  });
  if (selectedBorda.value) {
    price += selectedBorda.value.price;
  }
  return price;
});

const addToCart = () => {
  if (
    selectedSabores.value.length >= 2 &&
    selectedSabores.value.length <= selectedMaxSabores.value
  ) {
    const pizzaCustomizada = {
      id: "pizza-customizada-" + Date.now(), // Gera um ID único
      name: "Pizza Montada",
      size: selectedSize.value.name,
      sabores: selectedSabores.value.map((sabor, index) => ({
        name: sabor.name,
        metade: saboresMetade.value[index],
      })),
      adicionais: selectedAdicionais.value.map((adicional) => adicional.name),
      borda: selectedBorda.value ? selectedBorda.value.name : "Sem Borda",
      price: totalPrice.value,
      quantity: 1, // Por padrão, adiciona 1
      // Você pode adicionar mais informações conforme necessário
    };
    cartStore.addItem(pizzaCustomizada);
    alert("Pizza personalizada adicionada ao carrinho!");
    // Opcional: resetar os seletores após adicionar ao carrinho
    // selectedSize.value = sizes.value[0];
    // selectedSabores.value = [];
    // selectedAdicionais.value = [];
    // selectedBorda.value = null;
    // saboresMetade.value = [];
  } else {
    alert(
      `Selecione de 2 a ${selectedMaxSabores.value} sabores para adicionar ao carrinho.`
    );
  }
};
</script>

<style scoped lang="postcss">
@reference "tailwindcss";
.input {
  @apply shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 leading-tight focus:outline-none focus:shadow-outline;
}

.input-sm {
  @apply shadow appearance-none border rounded py-2 px-3 text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 leading-tight focus:outline-none focus:shadow-outline;
  width: 100px;
}
</style>
