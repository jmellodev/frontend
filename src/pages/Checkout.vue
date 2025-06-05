<template>
  <AppLayout :top-nav-visible="true" top-nav-title="Finalizar pedido" :is-header-visible="false">
    <div class="container mx-auto p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:gap-8 gap-4 lg:-mt-20">
      <ol aria-label="Breadcrumb"
        class="lg:col-span-8 md:col-span-2 px-1 flex text-xs space-x-2 items-center text-gray-500 min-w-0 gap-2 whitespace-nowrap">
        <li class="text-xs/loose">
          <a href="" class="flex items-center gap-2 align-middle  leading-none transition-all">
            <i class="fa fa-home"></i> Início
          </a>
        </li>
        <i class="fa fa-chevron-right text-gray-400"></i>
        <span class="text-green-600">Finalizar pedido</span>
      </ol>
      <div class="lg:col-span-2">
        <div v-if="hasCustomerData && !editingCustomerData"
          class="p-4 border border-gray-300 rounded-md mb-4 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
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
            <span class="text-gray-500 dark:text-gray-400">{{
              customerData.address
            }}</span>
          </div>
          <div>
            <span class="font-semibold mr-2">Ponto de referência:</span>
            <span class="text-gray-500 dark:text-gray-400">{{
              customerData.reference
            }}</span>
          </div>
          <button @click="editingCustomerData = true"
            class="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-md shadow focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-green-500">
            Alterar meus dados
          </button>
        </div>
      </div>
      <div class="p-4 border border-gray-300 rounded-md mb-4 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
        <form @submit.prevent="submitOrder">
          <div v-if="!hasCustomerData || editingCustomerData">
            <h3 class="font-semibold mb-4 dark:text-gray-100">Dados do Cliente</h3>
            <div class="mb-4">
              <label for="name" class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Nome:</label>
              <input type="text" id="name" v-model="customerData.name" required class="input" />
            </div>

            <div class="mb-4">
              <label for="phone" class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Telefone:</label>
              <input type="tel" id="phone" v-model="customerData.phone" required class="input" />
            </div>

            <div class="mb-4">
              <label for="address"
                class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Endereço:</label>
              <input type="text" id="address" v-model="customerData.address" required class="input" />
            </div>

            <div class="mb-4">
              <label for="reference" class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Ponto de
                Referência:</label>
              <input id="reference" v-model="customerData.reference" class="input" />
            </div>

            <div class="mb-4">
              <label for="neighborhood"
                class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Bairro:</label>
              <input id="neighborhood" v-model="customerData.neighborhood" class="input" />
            </div>

            <div class="flex justify-end gap-2">
              <button type="button" @click="editingCustomerData = false"
                class="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md shadow-md">
                Cancelar
              </button>
              <button type="button" @click="
                () => {
                  editingCustomerData = false;
                  saveCustomerDataLocally();
                }
              " class="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md shadow-md">
                Salvar
              </button>
            </div>
          </div>

          <h3 class="font-semibold mb-4 dark:text-gray-100 text-gray-700">
            Resumo do pedido
          </h3>
          <div class="mb-6">
            <div v-for="item in cartItems"
              class="flex items-center gap-4 text-gray-700 dark:text-gray-300 text-xs mb-2">
              <img :src="item.img" :alt="item.name" class="h-10 w-10 rounded-md object-cover shadow-md" />
              <span class="flex-3">{{ item.name }}</span>
              <span class="flex-1">x{{ item.quantity }}</span>
              <span>{{ $formatPrice(item.subtotal) }}</span>
            </div>
          </div>

          <div class="space-y-2">
            <label for="coupon" class="text-xs text-gray-700">Código do cupom</label>
            <div class="relative">
              <input type="text" name="coupon" id="coupon"
                class="block w-full rounded-md py-3 ps-4 pe-12 text-gray-800 text-sm focus:ring-transparent border-gray-200 dark:bg-gray-50"
                placeholder="Digite o código" autocomplete="off" />
              <button
                class="absolute top-1/2 -translate-y-1/2 end-1 py-2 px-5 inline-block font-semibold tracking-wide border align-middle duration-500 text-sm text-center bg-gray-200 hover:bg-gray-300 border-gray-200 hover:border-gray-300 text-gray-900 rounded-md">
                Aplicar cupom
              </button>
            </div>
          </div>

          <Divider />

          <div class="mb-4">
            <span class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-4">
              Tipo de Entrega/Retirada:
            </span>
            <div class="space-x-4 flex items-center">
              <div>
                <input type="radio" id="deliveryTypeDelivery" name="deliveryTypeOptions" value="Entrega"
                  v-model="customerData.deliveryType" class="form-radio hidden" />
                <label for="deliveryTypeDelivery" :class="[
                  'cursor-pointer px-4 py-2 rounded border text-sm font-medium transition',
                  customerData.deliveryType === 'Entrega'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600',
                ]">
                  🚚 Entrega
                </label>
              </div>
              <div>
                <input type="radio" id="deliveryTypeRetirada" name="deliveryTypeOptions" value="Retirada"
                  v-model="customerData.deliveryType" class="form-radio hidden" />
                <label for="deliveryTypeRetirada" :class="[
                  'cursor-pointer px-4 py-2 rounded border text-sm font-medium transition',
                  customerData.deliveryType === 'Retirada'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600',
                ]">
                  🏠 Retirada
                </label>
              </div>
            </div>
          </div>
          <Divider />
          <h3 class="font-semibold mb-4 dark:text-gray-100 text-gray-700">Pagamento</h3>
          <div class="flex gap-2 mb-4">
            <label v-for="method in paymentOptions" :key="method.value" class="relative cursor-pointer">
              <input type="radio" name="paymentMethod" :value="method.value" v-model="paymentMethod" class="hidden" />
              <div :class="[
                'flex px-4 py-2 space-x-2 items-center justify-center border rounded-md shadow-md transition',
                paymentMethod === method.value
                  ? 'bg-green-600 text-white border-green-600'
                  : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600',
              ]">
                <i :class="method.icon"></i>
                <div class="text-sm font-medium">{{ method.label }}</div>
              </div>
            </label>
          </div>

          <div v-if="paymentMethod === 'cash'" class="mb-4">
            <label class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Precisa de Troco?</label>
            <label>
              <input type="radio" value="yes" v-model="needChange" class="mr-2" /> Sim
            </label>
            <label class="ml-4">
              <input type="radio" value="no" v-model="needChange" class="mr-2" /> Não
            </label>

            <div v-if="needChange === 'yes'" class="mt-4">
              <label for="changeAmount" class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Valor para
                Troco:</label>
              <input type="number" id="changeAmount" v-model.number="changeAmount" min="0" class="input" />
            </div>
          </div>
          <Divider />
          <div>
            <div class="flex justify-between items-center dark:text-gray-200">
              <span class="font-semibold">Total do Pedido:</span>
              <span class="font-bold">{{ $formatPrice(cartTotal) }}</span>
            </div>
            <button type="submit"
              class="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg shadow-md mt-4 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-green-500">
              Finalizar Pedido
            </button>
          </div>
        </form>
      </div>
      <transition name="fade">
        <div v-if="orderNumber"
          class="m-4 fixed flex justify-center items-center space-x-2 top-4 transform bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50 border-l-4 border-l-green-800">
          <i class="fa-regular fa-circle-check text-green-800" aria-hidden="true"></i>
          <span>Pedido realizado com sucesso! Número do Pedido: {{ orderNumber }}</span>
        </div>
      </transition>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from "vue";
import { useCartStore } from "@/stores/cartStore";
import AppLayout from "@/layouts/AppLayout.vue";
import { useRouter } from "vue-router";
import Divider from "@/components/Divider.vue";

const router = useRouter();
const cartStore = useCartStore();
const cartTotal = computed(() => cartStore.total);
const CUSTOMER_DATA_LOCAL_STORAGE_KEY = "customer_data";
const DEFAULT_DELIVERY_FEE = 5.0;

const cartItems = computed(() => cartStore.items);

const customerData = reactive({
  name: "",
  phone: "",
  deliveryType: "Entrega",
  address: "",
  reference: "",
  neighborhood: "",
});

const hasCustomerData = computed(() =>
  Object.values(customerData).some((value) => value !== "")
);

const editingCustomerData = ref(false);
const paymentMethod = ref("pix");
const needChange = ref("no");
const changeAmount = ref(0);
const orderNumber = ref("");

const paymentOptions = [
  { value: "pix", label: "Pix", icon: "fa-brands fa-pix" },
  { value: "credit-card", label: "Cartão", icon: "fa fa-credit-card" },
  { value: "cash", label: "Dinheiro", icon: "fa fa-money-bill-1-wave" },
];

function generateOrderNumber() {
  // Pega os últimos 5 dígitos do timestamp atual
  const timestampPart = Date.now().toString().slice(-5);
  // Gera um número aleatório entre 0 e 99999 e garante 5 dígitos, preenchendo com zeros à esquerda se necessário
  const randomPart = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  // Concatena as partes para formar o número do pedido
  return `${timestampPart}${randomPart}`;
}


onMounted(() => {
  const storedData = localStorage.getItem(CUSTOMER_DATA_LOCAL_STORAGE_KEY);
  if (storedData) {
    Object.assign(customerData, JSON.parse(storedData));
  }
});

function saveCustomerDataLocally() {
  localStorage.setItem(CUSTOMER_DATA_LOCAL_STORAGE_KEY, JSON.stringify(customerData));
}

async function submitOrder() {
  if (cartStore.items.length === 0) {
    alert("Seu carrinho está vazio. Adicione itens para finalizar o pedido.");
    return;
  }

  const currentDeliveryFee =
    customerData.deliveryType === "Retirada" ? 0 : DEFAULT_DELIVERY_FEE;

  const subtotalPedido = cartTotal.value;
  const totalPedido = subtotalPedido + currentDeliveryFee;

  const orderDetails = {
    orderNumber: generateOrderNumber(),
    customer: { ...customerData },
    items: cartStore.items,
    subtotal: subtotalPedido,
    tax: currentDeliveryFee,
    total: totalPedido,
    paymentMethod: paymentMethod.value,
    deliveryType: customerData.deliveryType,
    needChange: needChange.value === "yes",
    changeAmount:
      paymentMethod.value === "cash" && needChange.value === "yes"
        ? changeAmount.value
        : null,
    created_at: new Date().toISOString(),
    status: "pending",
  };

  const cartItems = cartStore.items
    .map((item) => {
      let itemString = `${item.quantity}x ${item.name}${item.size ? ` (${item.size})` : ""
        } - R$ ${item.subtotal.toFixed(2).replace(".", ",")}`;
      if (item.extras && item.extras.length > 0) {
        const extrasString = item.extras
          .map((e) => `${e.name} - R$ ${e.price.toFixed(2).replace(".", ",")}`)
          .join(" | ");
        itemString += `\n_Adicionais:_ ${extrasString}`;
      }
      return itemString;
    })
    .join("\n");

  let deliverySpecificInfo = [`*Tipo:* ${orderDetails.deliveryType}`];
  if (orderDetails.deliveryType === "Entrega") {
    deliverySpecificInfo.push(`*Tempo de entrega:* 40 a 50min`);
  } else {
    deliverySpecificInfo.push(`*Pronto para retirada em:* 20-30min`);
  }

  const message =
    `NOVO PEDIDO: #${orderDetails.orderNumber}\n\n` +
    `DADOS DO PEDIDO:\n` +
    `${cartItems}\n\n` +
    `DADOS DA ENTREGA:\n` +
    `${deliverySpecificInfo.join("\n")}\n` +
    `*Cliente:* ${customerData.name}\n` +
    `*Telefone:* ${customerData.phone}\n` +
    (orderDetails.deliveryType === "Entrega"
      ? `*Endereço:* ${customerData.address}\n`
      : "") +
    (orderDetails.deliveryType === "Entrega" && customerData.reference
      ? `*Ponto de referência:* ${customerData.reference}\n`
      : orderDetails.deliveryType === "Entrega"
        ? `*Ponto de referência:* nenhum\n`
        : "") +
    (orderDetails.deliveryType === "Entrega" && customerData.neighborhood
      ? `*Bairro:* ${customerData.neighborhood}\n`
      : "") +
    `\n` +
    `DADOS DO PAGAMENTO:\n` +
    `*Método de pagamento:* ${orderDetails.paymentMethod ? orderDetails.paymentMethod.toUpperCase() : "N/A"
    }\n` +
    `*Subtotal:* R$ ${orderDetails.subtotal.toFixed(2).replace(".", ",")}\n` +
    (orderDetails.deliveryType === "Entrega"
      ? `*Taxa de entrega:* R$ ${orderDetails.tax.toFixed(2).replace(".", ",")}\n`
      : "") +
    `*Total:* R$ ${orderDetails.total.toFixed(2).replace(".", ",")}`;

  const phone = "5571992477638";
  const encoded = encodeURIComponent(message);
  window.open(`https://wa.me/${phone}?text=${encoded}`);

  await new Promise((resolve) => setTimeout(resolve, 1000));

  orderNumber.value = orderDetails.orderNumber;
  saveCustomerDataLocally();
  cartStore.clearCart();
  editingCustomerData.value = false;

  setTimeout(() => {
    orderNumber.value = "";
    router.push("/");
  }, 3000);
}
</script>
