<template>
  <AppLayout
    :top-nav-visible="true"
    top-nav-title="Finalizar pedido"
    :is-header-visible="false"
  >
    <div class="container mx-auto p-4">
      <div
        v-if="hasCustomerData && !editingCustomerData"
        class="p-4 border border-gray-300 shadow-md rounded-md mb-4 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
      >
        <h3 class="font-semibold mb-2 dark:text-gray-100">Dados do Cliente</h3>
        <div>
          <span class="font-semibold mr-2">Nome:</span>
          <span class="text-gray-500 dark:text-gray-400">{{ customerData.name }}</span>
        </div>
        <div>
          <span class="font-semibold mr-2">Telefone:</span>
          <span class="text-gray-500 dark:text-gray-400">{{ customerData.phone }}</span>
        </div>
        <div>
          <span class="font-semibold mr-2">Endereço:</span>
          <span class="text-gray-500 dark:text-gray-400">{{ customerData.address }}</span>
        </div>
        <div>
          <span class="font-semibold mr-2">Ponto de referência:</span>
          <span class="text-gray-500 dark:text-gray-400">{{
            customerData.reference
          }}</span>
        </div>
        <button
          @click="editingCustomerData = true"
          class="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-md shadow focus:outline-none focus:shadow-outline"
        >
          Alterar meus dados
        </button>
      </div>

      <form @submit.prevent="submitOrder">
        <div v-if="!hasCustomerData || editingCustomerData">
          <h3 class="font-semibold mb-4 dark:text-gray-100">Dados do Cliente</h3>
          <div class="mb-4">
            <label
              for="name"
              class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
              >Nome:</label
            >
            <input
              type="text"
              id="name"
              v-model="customerData.name"
              required
              class="input"
            />
          </div>

          <div class="mb-4">
            <label
              for="phone"
              class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
              >Telefone:</label
            >
            <input
              type="tel"
              id="phone"
              v-model="customerData.phone"
              required
              class="input"
            />
          </div>

          <div class="mb-4">
            <label
              for="address"
              class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
              >Endereço:</label
            >
            <input
              type="text"
              id="address"
              v-model="customerData.address"
              required
              class="input"
            />
          </div>

          <div class="mb-4">
            <label
              for="reference"
              class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
              >Ponto de Referência:</label
            >
            <textarea
              id="reference"
              v-model="customerData.reference"
              class="input"
            ></textarea>
          </div>
        </div>

        <h3 class="font-semibold mb-4 mt-6 dark:text-gray-100">Pagamento</h3>
        <div class="mb-4">
          <label
            for="paymentMethod"
            class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
            >Forma de Pagamento:</label
          >
          <select id="paymentMethod" v-model="paymentMethod" required class="input">
            <option value="pix">Pix</option>
            <option value="card">Cartão</option>
            <option value="cash">Dinheiro</option>
          </select>
        </div>

        <div v-if="paymentMethod === 'cash'" class="mb-4">
          <label class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
            >Precisa de Troco?</label
          >
          <label>
            <input type="radio" value="yes" v-model="needChange" class="mr-2" /> Sim
          </label>
          <label class="ml-4">
            <input type="radio" value="no" v-model="needChange" class="mr-2" /> Não
          </label>

          <div v-if="needChange === 'yes'" class="mt-4">
            <label
              for="changeAmount"
              class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
              >Valor para Troco:</label
            >
            <input
              type="number"
              id="changeAmount"
              v-model.number="changeAmount"
              min="0"
              class="input"
            />
          </div>
        </div>

        <div class="mt-8 border-t pt-4 dark:border-gray-700">
          <div class="flex justify-between items-center dark:text-gray-200">
            <span class="font-semibold">Total do Pedido:</span>
            <span class="text-xl font-bold">{{ $formatPrice(cartTotal) }}</span>
          </div>
          <button
            type="submit"
            class="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg shadow-md mt-4 focus:outline-none focus:shadow-outline"
          >
            Finalizar Pedido
          </button>
        </div>
      </form>

      <transition name="fade">
        <div
          v-if="orderNumber"
          class="m-4 fixed flex justify-center items-center space-x-2 top-4 transform bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50 border-l-4 border-l-green-800"
        >
          <i class="fa-regular fa-circle-check text-green-800" aria-hidden="true"></i>
          <span>Pedido realizado com sucesso! Número do Pedido: {{ orderNumber }}</span>
        </div>
      </transition>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useCartStore } from "@/stores/cartStore";
import AppLayout from "@/layouts/AppLayout.vue";
import { useRouter } from "vue-router"; // Importe o useRouter

const router = useRouter(); // Inicialize o router

const cartStore = useCartStore();
const cartTotal = computed(() => cartStore.total);

const CUSTOMER_DATA_LOCAL_STORAGE_KEY = "customer_data";

const customerData = ref({
  name: "",
  phone: "",
  address: "",
  reference: "",
});
const hasCustomerData = computed(() =>
  Object.values(customerData.value).some((value) => value !== "")
);
const editingCustomerData = ref(false);

const paymentMethod = ref("pix");
const needChange = ref("no");
const changeAmount = ref(0);
const orderNumber = ref("");

onMounted(() => {
  const storedData = localStorage.getItem(CUSTOMER_DATA_LOCAL_STORAGE_KEY);
  if (storedData) {
    customerData.value = JSON.parse(storedData);
  }
});

function generateOrderNumber() {
  const timestamp = Date.now().toString(36).slice(-5); // Pega os últimos 5 caracteres
  const randomChars = Math.random().toString(36).substring(2, 7); // Pega 5 caracteres aleatórios
  return `${timestamp.toUpperCase()}${randomChars.toUpperCase()}`; // Combina e converte para maiúsculo
}

function saveCustomerDataLocally() {
  localStorage.setItem(
    CUSTOMER_DATA_LOCAL_STORAGE_KEY,
    JSON.stringify(customerData.value)
  );
}

async function submitOrder() {
  if (cartStore.items.length === 0) {
    alert("Seu carrinho está vazio. Adicione itens para finalizar o pedido.");
    return;
  }

  const orderDetails = {
    orderNumber: generateOrderNumber(),
    customer: { ...customerData.value },
    items: cartStore.items,
    total: cartTotal.value,
    paymentMethod: paymentMethod.value,
    needChange: needChange.value === "yes" ? true : false,
    changeAmount:
      paymentMethod.value === "cash" && needChange.value === "yes"
        ? changeAmount.value
        : null,
    orderDate: new Date().toISOString(),
    status: "pending", // Status inicial do pedido
  };

  console.log("Dados do Pedido:", orderDetails);

  // Simulação de envio para o backend (você precisará implementar a lógica real)
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Simula um delay de envio

  orderNumber.value = orderDetails.orderNumber;
  saveCustomerDataLocally();
  cartStore.clearCart(); // Limpar o carrinho após o pedido
  editingCustomerData.value = false; // Voltar para a visualização dos dados após o pedido

  // Redirecionar para a home após alguns segundos
  setTimeout(() => {
    orderNumber.value = "";
    router.push("/"); // Redireciona para a rota '/' (home)
  }, 3000); // Ajuste o tempo conforme necessário
}
</script>
