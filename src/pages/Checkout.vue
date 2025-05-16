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
            <input
              id="reference"
              v-model="customerData.reference"
              class="input"
            ></input>
          </div>
          <div class="mb-4">
            <label
              for="neighborhood"
              class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
              >Bairro:</label
            >
            <input
              id="neighborhood"
              v-model="customerData.neighborhood"
              class="input"
            ></input>
          </div>
        </div>

        <div class="mb-4">
          <label 
            for="deliveryType" 
            class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
          >
            Tipo de Entrega/Retirada:
          </label>
          <select
            id="deliveryType"
            v-model="customerData.deliveryType"
            class="input w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="Entrega">Delivery (Entrega)</option>
            <option value="Retirada">Retirada no local</option>
            </select>
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
const DEFAULT_DELIVERY_FEE = 5.00;

const customerData = ref({
  name: "",
  phone: "",
  deliveryType: "Entrega",
  address: "",
  reference: "",
  neighborhood: "",
});
const hasCustomerData = computed(() =>
  Object.values(customerData.value).some((value) => value !== "")
);
const editingCustomerData = ref(false);

const paymentMethod = ref("pix");
const needChange = ref("no");
const changeAmount = ref(0);
const orderNumber = ref("");
const tax = 5;

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

// Assumindo que você tem DEFAULT_DELIVERY_FEE definido no escopo do seu script setup
// const DEFAULT_DELIVERY_FEE = 5.00; // Exemplo

async function submitOrder() {
  if (cartStore.items.length === 0) {
    alert("Seu carrinho está vazio. Adicione itens para finalizar o pedido.");
    return;
  }

  // Determinar a taxa de entrega baseada no tipo de entrega
  const currentDeliveryFee = customerData.value.deliveryType === 'Retirada' 
                            ? 0 
                            : DEFAULT_DELIVERY_FEE; // Use sua taxa padrão aqui

  const subtotalPedido = cartTotal.value; // Subtotal dos itens do carrinho
  const totalPedido = subtotalPedido + currentDeliveryFee;

  const orderDetails = {
    orderNumber: generateOrderNumber(),
    customer: { ...customerData.value }, // Inclui deliveryType
    items: cartStore.items,
    subtotal: subtotalPedido,
    tax: currentDeliveryFee, // Taxa de entrega calculada
    total: totalPedido,      // Total com taxa de entrega
    paymentMethod: paymentMethod.value,
    deliveryType: customerData.value.deliveryType, // Adicionado para clareza
    needChange: needChange.value === "yes" ? true : false,
    changeAmount:
      paymentMethod.value === "cash" && needChange.value === "yes"
        ? changeAmount.value
        : null,
    orderDate: new Date().toISOString(),
    status: "pending",
  };

  console.log("Dados do Pedido:", orderDetails);

  const cartItems = cartStore.items
    .map((item) => {
      let itemString = `${item.quantity}x ${item.name}${item.size ? ` (${item.size})` : ''} - R$ ${item.subtotal.toFixed(2).replace('.', ',')}`;
      if (item.extras && item.extras.length > 0) {
        const extrasString = item.extras
          .map(e => `${e.name} - R$ ${e.price.toFixed(2).replace('.', ',')}`)
          .join(' | ');
        itemString += `\nAdicionais: ${extrasString}`;
      }
      return itemString;
    })
    .join("\n");

  // Ajustar informações de entrega na mensagem
  let deliverySpecificInfo = [`Tipo: ${orderDetails.deliveryType}`];
  if (orderDetails.deliveryType === 'Entrega') {
    deliverySpecificInfo.push(`Tempo de entrega: 40 a 50min`); // Ou sua lógica de tempo de entrega
  }
  // Para retirada, você pode adicionar um horário de retirada ou instruções. Ex:
  // else if (orderDetails.deliveryType === 'Retirada') {
  //   deliverySpecificInfo.push(`Pronto para retirada em: 20-30min`);
  // }


  const message =
    `NOVO PEDIDO: #${orderDetails.orderNumber}\n\n` +
    `DADOS DO PEDIDO:\n` +
    `${cartItems}\n\n` +
    `DADOS DA ENTREGA:\n` +
    `${deliverySpecificInfo.join('\n')}\n` + // Linhas de tipo e tempo de entrega
    `Cliente: ${customerData.value.name}\n` +
    `Telefone: ${customerData.value.phone}\n` +
    // Endereço só faz sentido para Delivery
    (orderDetails.deliveryType === 'Entrega' ? `Endereço: ${customerData.value.address}\n` : '') +
    (orderDetails.deliveryType === 'Entrega' && customerData.value.reference ? `Ponto de referência: ${customerData.value.reference}\n` : (orderDetails.deliveryType === 'Entrega' ? `Ponto de referência: nenhum\n` : '')) +
    (orderDetails.deliveryType === 'Entrega' && customerData.value.neighborhood ? `Bairro: ${customerData.value.neighborhood}\n` : '') +
    `\n` + // Espaço extra antes dos dados de pagamento, mesmo se bairro não for mostrado
    `DADOS DO PAGAMENTO:\n` +
    `Método de pagamento: ${orderDetails.paymentMethod ? orderDetails.paymentMethod.toUpperCase() : 'N/A'}\n` +
    `Subtotal: R$ ${orderDetails.subtotal.toFixed(2).replace('.', ',')}\n` +
    (orderDetails.deliveryType === 'entrega' ? `Taxa de entrega: R$ ${orderDetails.tax.toFixed(2).replace('.', ',')}\n` : '') + // Só mostra taxa se for delivery
    `Total: R$ ${orderDetails.total.toFixed(2).replace('.', ',')}`;

  const phone = "5571992477638";
  const encoded = encodeURIComponent(message);

  window.open(`https://wa.me/${phone}?text=${encoded}`);

  await new Promise((resolve) => setTimeout(resolve, 1000));

  orderNumber.value = orderDetails.orderNumber;
  saveCustomerDataLocally(); // Certifique-se que salve customerData.deliveryType também
  cartStore.clearCart();
  editingCustomerData.value = false;

  setTimeout(() => {
    orderNumber.value = "";
    router.push("/");
  }, 3000);
}
</script>
