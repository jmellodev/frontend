<template>
  <AppLayout :top-nav-visible="true" top-nav-title="Finalizar pedido" :is-header-visible="false">
    <form @submit.prevent="submitOrder">
      <div class="container mx-auto p-4 lg:pt-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 lg:gap-8 gap-4">
        <ol aria-label="Breadcrumb"
          class="lg:col-span-8 md:col-span-2 px-1 flex text-xs space-x-2 items-center text-gray-400 min-w-0 gap-2 whitespace-nowrap">
          <li class="text-xs/loose">
            <a href="/" class="flex items-center gap-2 align-middle leading-none transition-all">
              <i class="fa fa-home"></i> Início
            </a>
          </li>
          <i class="fa fa-chevron-right text-gray-400"></i>
          <span class="text-green-600">Finalizar pedido</span>
        </ol>

        <!-- Bloco de exibição/edição dos dados do usuário -->
        <div class="lg:col-span-2">
          <!-- Exibe os dados do cliente se existirem E não estiver em modo de edição -->
          <div v-if="hasCustomerData && !editingCustomerData"
            class="p-4 border border-gray-300 rounded-md mb-4 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
            <h3 class="font-semibold mb-4 dark:text-gray-100">Dados para a entrega</h3>
            <div
              class="p-2 border border-gray-300 dark:border-gray-700/40 rounded mb-2 cursor-default select-none shadow">
              <span class="font-semibold mr-2">Nome:</span>
              <span class="text-gray-500 dark:text-gray-400">{{ customerData.name }}</span>
            </div>
            <div
              class="p-2 border border-gray-300 dark:border-gray-700/40 rounded mb-2 cursor-default select-none shadow">
              <span class="font-semibold mr-2">Telefone:</span>
              <span class="text-gray-500 dark:text-gray-400">{{ customerData.phone }}</span>
            </div>
            <div
              class="p-2 border border-gray-300 dark:border-gray-700/40 rounded mb-2 cursor-default select-none shadow">
              <span class="font-semibold mr-2">CEP:</span>
              <span class="text-gray-500 dark:text-gray-400">{{
                customerData.cep || 'N/A'
                }}</span>
            </div>
            <div
              class="p-2 border border-gray-300 dark:border-gray-700/40 rounded mb-2 cursor-default select-none shadow">
              <span class="font-semibold mr-2">Endereço:</span>
              <span class="text-gray-500 dark:text-gray-400">{{
                customerData.address
                }}</span>
            </div>
            <div
              class="p-2 border border-gray-300 dark:border-gray-700/40 rounded mb-2 cursor-default select-none shadow">
              <span class="font-semibold mr-2">Ponto de referência:</span>
              <span class="text-gray-500 dark:text-gray-400">{{
                customerData.reference || 'N/A'
                }}</span>
            </div>
            <div
              class="p-2 border border-gray-300 dark:border-gray-700/40 rounded mb-2 cursor-default select-none shadow">
              <span class="font-semibold mr-2">Bairro:</span>
              <span class="text-gray-500 dark:text-gray-400">{{
                customerData.neighborhood
                }}</span>
            </div>
            <button type="button" @click.stop="editingCustomerData = true"
              class="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded-md shadow focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-green-500">
              Alterar meus dados
            </button>
          </div>

          <!-- Exibe o formulário de preenchimento SE NÃO HOUVER DADOS DO CLIENTE OU SE ESTIVER EM MODO DE EDIÇÃO -->
          <div v-if="!hasCustomerData || editingCustomerData"
            class="p-4 border border-gray-300 rounded-md mb-4 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
            <h3 class="font-semibold mb-4 dark:text-gray-100">Dados para a entrega<br /><span
                class="text-xs font-normal">Só
                precisa
                preencher seus
                dados
                apenas uma vez.</span></h3>

            <div class="mb-4">
              <label for="name" class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Nome:</label>
              <input type="text" id="name" v-model="customerData.name"
                :class="['input', { 'border-red-500': formErrors.name }]" @blur="validateField('name')" />
              <p v-if="formErrors.name" class="text-red-500 text-xs italic mt-1">{{ formErrors.name }}</p>
            </div>

            <div class="mb-4">
              <label for="phone" class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Telefone:</label>
              <input type="tel" id="phone" v-model="customerData.phone"
                :class="['input', { 'border-red-500': formErrors.phone }]" @blur="validateField('phone')" />
              <p v-if="formErrors.phone" class="text-red-500 text-xs italic mt-1">{{ formErrors.phone }}</p>
            </div>

            <div class="mb-4">
              <label for="cep" class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">CEP:</label>
              <input type="text" id="cep" v-model="customerData.cep" @blur="fetchAddressByCep"
                :class="['input', { 'border-red-500': formErrors.cep }]" />
              <p v-if="formErrors.cep" class="text-red-500 text-xs italic mt-1">{{ formErrors.cep }}</p>
              <p v-if="cepLoading" class="text-gray-500 text-xs italic mt-1">Buscando endereço...</p>
            </div>

            <div class="mb-4">
              <label for="address"
                class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Endereço:</label>
              <input type="text" id="address" v-model="customerData.address"
                :class="['input', { 'border-red-500': formErrors.address && customerData.deliveryType === 'Entrega' }]"
                :required="customerData.deliveryType === 'Entrega'" @blur="validateField('address')" />
              <p v-if="formErrors.address && customerData.deliveryType === 'Entrega'"
                class="text-red-500 text-xs italic mt-1">{{ formErrors.address }}</p>
            </div>

            <div class="mb-4">
              <label for="reference" class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Ponto de
                Referência (Opcional):</label>
              <input id="reference" v-model="customerData.reference" class="input" />
            </div>

            <div class="mb-4">
              <label for="neighborhood"
                class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Bairro:</label>
              <input id="neighborhood" v-model="customerData.neighborhood"
                :class="['input', { 'border-red-500': formErrors.neighborhood && customerData.deliveryType === 'Entrega' }]"
                :required="customerData.deliveryType === 'Entrega'" @blur="validateField('neighborhood')" />
              <p v-if="formErrors.neighborhood && customerData.deliveryType === 'Entrega'"
                class="text-red-500 text-xs italic mt-1">{{ formErrors.neighborhood }}</p>
            </div>

            <div class="flex justify-end gap-2">
              <button type="button" @click="editingCustomerData = false"
                class="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md shadow-md" v-if="hasCustomerData">
                Cancelar
              </button>
              <button type="button" @click="saveCustomerDataAndExitEditMode"
                class="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md shadow-md">
                Salvar
              </button>
            </div>
          </div>
        </div>
        <div
          class="p-4 border border-gray-300 rounded-md mb-4 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">

          <h3
            class="font-semibold mb-4 dark:text-gray-100 text-gray-700 border-b dark:border-b-gray-900 border-b-gray-300">
            Resumo do pedido
          </h3>
          <div class="mb-6">
            <div v-for="item in cartItems" :key="item.id"
              class="flex items-center gap-4 text-gray-700 dark:text-gray-300 text-xs mb-2">
              <img :src="item.img" :alt="item.name" class="h-10 w-10 rounded-md object-cover shadow-md" />
              <span class="flex-3">{{ item.name }}</span>
              <span class="flex-1">x{{ item.quantity }}</span>
              <span>{{ formatPrice(item.subtotal) }}</span>
            </div>
          </div>

          <div class="space-y-2">
            <label for="coupon" class="text-xs text-gray-700">Código do cupom</label>
            <div class="relative">
              <input type="text" name="coupon" id="coupon" v-model="couponCode"
                :disabled="appliedCoupon !== null || isApplyingCoupon"
                class="block w-full rounded-md py-3 ps-4 pe-12 text-gray-800 text-sm focus:ring-transparent border-gray-200 dark:bg-gray-50"
                placeholder="Digite o código" autocomplete="off" />
              <button type="button" @click="applyCoupon"
                :disabled="!couponCode || appliedCoupon !== null || isApplyingCoupon"
                class="absolute top-1/2 -translate-y-1/2 end-1 py-2 px-4 inline-block font-light tracking-wide border align-middle duration-500 text-xs text-center bg-orange-200 hover:bg-orange-300 border-gray-200 hover:border-gray-300 text-gray-900 rounded-md disabled:opacity-50 disabled:cursor-not-allowed">
                <i class="fa-solid fa-badge-percent text-orange-500 mr-1"></i> {{ isApplyingCoupon ? 'Aplicando...' :
                'Aplicar' }}
              </button>
            </div>
            <p v-if="couponError" class="text-red-500 text-xs italic mt-1">{{ couponError }}</p>
            <div v-if="appliedCoupon"
              class="mt-2 p-2 bg-green-100 text-green-800 rounded-md text-sm flex items-center justify-between dark:bg-green-900/20 dark:text-green-400">
              <span>Cupom aplicado: <span class="font-semibold">{{ appliedCoupon.name.toUpperCase() }}</span> ({{
                appliedCoupon.type === 'percentage' ? appliedCoupon.discount_amount + '%' :
                  formatPrice(appliedCoupon.discount_amount) }})</span>
              <button type="button" @click="removeCoupon" class="text-red-500 hover:text-red-700 ml-2">
                <i class="fa-solid fa-times"></i>
              </button>
            </div>
          </div>

          <Divider />

          <div class="mb-4">
            <span class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-4">
              Tipo de entrega:
            </span>
            <div class="space-x-4 flex items-center">
              <div>
                <input type="radio" id="deliveryTypeDelivery" name="deliveryTypeOptions" value="Entrega"
                  v-model="customerData.deliveryType" class="form-radio hidden" @change="validateForm()" />
                <label for="deliveryTypeDelivery" :class="[
                  'cursor-pointer px-4 py-2 rounded border text-sm font-medium transition',
                  customerData.deliveryType === 'Entrega'
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-900',
                ]">
                  🚚 Entrega
                </label>
              </div>
              <div>
                <input type="radio" id="deliveryTypeRetirada" name="deliveryTypeOptions" value="Retirada"
                  v-model="customerData.deliveryType" class="form-radio hidden" @change="validateForm()" />
                <label for="deliveryTypeRetirada" :class="[
                  'cursor-pointer px-4 py-2 rounded border text-sm font-medium transition',
                  customerData.deliveryType === 'Retirada'
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-900',
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
              <input type="number" id="changeAmount" v-model.number="changeAmount" min="0"
                :class="['input', { 'border-red-500': formErrors.changeAmount }]"
                @blur="validateField('changeAmount')" />
              <p v-if="formErrors.changeAmount" class="text-red-500 text-xs italic mt-1">{{ formErrors.changeAmount }}
              </p>
            </div>
          </div>
          <Divider />
          <div class="mb-4">
            <label for="obs" class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Observações
              (Opcional)</label>
            <textarea type="text" name="obs" id="obs" v-model="customerData.obs"
              class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Alguma observação para a entrega desse pedido? Digite aqui..."></textarea>
          </div>
          <div>
            <div class="flex justify-between items-center dark:text-gray-200">
              <span class="font-semibold">Subtotal:</span>
              <span>{{ formatPrice(cartTotal) }}</span>
            </div>
            <div class="flex justify-between items-center dark:text-gray-200"
              v-if="customerData.deliveryType === 'Entrega'">
              <span class="font-semibold">Taxa de Entrega:</span>
              <span>{{ formatPrice(deliveryFee) }}</span>
            </div>
            <div class="flex justify-between items-center dark:text-gray-200 font-bold text-lg" v-if="appliedCoupon">
              <span class="font-semibold text-green-500">Desconto ({{ appliedCoupon.type === 'percentage' ?
                appliedCoupon.discount_amount + '%' : formatPrice(appliedCoupon.discount_amount) }}):</span>
              <span class="text-green-500">- {{ formatPrice(calculatedDiscount) }}</span>
            </div>
            <Divider />
            <div class="flex justify-between items-center dark:text-gray-200 font-bold text-xl">
              <span class="font-semibold">Total do Pedido:</span>
              <span class="font-bold">{{ formatPrice(finalOrderTotal) }}</span>
            </div>
            <button type="submit" :disabled="isSubmitting"
              class="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg shadow-md mt-4 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed">
              {{ isSubmitting ? 'Finalizando...' : 'Finalizar Pedido' }}
            </button>
          </div>

        </div>
        <transition name="fade">
          <div v-if="orderNumber"
            class="m-4 fixed flex justify-center items-center space-x-2 top-4 transform bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50 border-l-4 border-l-green-800">
            <i class="fa-regular fa-circle-check text-green-800" aria-hidden="true"></i>
            <span>Pedido realizado com sucesso! Número do Pedido: {{ orderNumber }}</span>
          </div>
        </transition>
      </div>
    </form>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted, reactive, watch } from "vue";
import { useCartStore } from "@/stores/cartStore";
import AppLayout from "@/layouts/AppLayout.vue";
import { useRouter } from "vue-router";
import Divider from "@/components/Divider.vue";
import { formatPrice } from "@/utils/formatters"; // Import formatPrice
import api from '@/services/httpClient'; // Importe seu cliente HTTP

const router = useRouter();
const cartStore = useCartStore();
const cartTotal = computed(() => cartStore.total); // Subtotal do carrinho (antes da taxa de entrega e cupom)
const CUSTOMER_DATA_LOCAL_STORAGE_KEY = "customer_data";
const APPLIED_COUPON_LOCAL_STORAGE_KEY = "applied_coupon"; // Nova chave para o cupom no localStorage
const DEFAULT_DELIVERY_FEE = 5.0;
const VIA_CEP_API_URL = "https://viacep.com.br/ws/";

const cartItems = computed(() => cartStore.items);

const customerData = reactive({
  name: "",
  phone: "",
  deliveryType: "Entrega",
  cep: "",
  address: "",
  reference: "",
  neighborhood: "",
  obs: "",
});

const hasCustomerData = computed(() => {
  return (
    customerData.name.trim() !== "" &&
    customerData.phone.trim() !== "" &&
    (customerData.deliveryType === "Retirada" || (customerData.address.trim() !== "" && customerData.neighborhood.trim() !== ""))
  );
});

const editingCustomerData = ref(false);
const paymentMethod = ref("pix");
const needChange = ref("no");
const changeAmount = ref(0);
const orderNumber = ref("");
const isSubmitting = ref(false);
const cepLoading = ref(false);

// Novos estados para o cupom
const couponCode = ref('');
const appliedCoupon = ref(null); // Armazena os detalhes do cupom aplicado: { name, type, discount_amount }
const couponError = ref(null);
const isApplyingCoupon = ref(false);


const formErrors = reactive({
  name: null,
  phone: null,
  cep: null,
  address: null,
  neighborhood: null,
  changeAmount: null,
});

const paymentOptions = [
  { value: "pix", label: "Pix", icon: "fa-brands fa-pix" },
  { value: "credit-card", label: "Cartão", icon: "fa fa-credit-card" },
  { value: "cash", label: "Dinheiro", icon: "fa fa-money-bill-1-wave" },
];

function generateOrderNumber() {
  const timestampPart = Date.now().toString().slice(-5);
  const randomPart = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  return `${timestampPart}${randomPart}`;
}

// Calculo da taxa de entrega
const deliveryFee = computed(() => {
  return customerData.deliveryType === "Retirada" ? 0 : DEFAULT_DELIVERY_FEE;
});

// Calculo do desconto do cupom
const calculatedDiscount = computed(() => {
  if (!appliedCoupon.value) {
    return 0;
  }

  const baseForDiscount = cartTotal.value + deliveryFee.value; // Desconto é sobre o total do pedido (subtotal + taxa)

  if (appliedCoupon.value.type === 'percentage') {
    return (baseForDiscount * appliedCoupon.value.discount_amount) / 100;
  } else if (appliedCoupon.value.type === 'value') {
    return appliedCoupon.value.discount_amount;
  }
  return 0;
});

// Total final do pedido (subtotal + taxa - desconto)
const finalOrderTotal = computed(() => {
  let total = cartTotal.value + deliveryFee.value;
  total -= calculatedDiscount.value;
  return Math.max(0, total); // Garante que o total não seja negativo
});


// Watch para resetar erros de CEP/endereço se o tipo de entrega mudar para Retirada
watch(() => customerData.deliveryType, (newType) => {
  if (newType === 'Retirada') {
    formErrors.cep = null;
    formErrors.address = null;
    formErrors.neighborhood = null;
  }
  validateForm(); // Revalidar o formulário completo após a mudança de tipo de entrega
});

// Watch para salvar/carregar o cupom do localStorage
watch(appliedCoupon, (newValue) => {
  if (newValue) {
    localStorage.setItem(APPLIED_COUPON_LOCAL_STORAGE_KEY, JSON.stringify(newValue));
  } else {
    localStorage.removeItem(APPLIED_COUPON_LOCAL_STORAGE_KEY);
  }
}, { deep: true });


// Validação de campo individual (chamada no blur)
function validateField(field) {
  formErrors[field] = null; // Limpa erro anterior

  switch (field) {
    case 'name':
      if (!customerData.name.trim()) formErrors.name = 'O nome é obrigatório.';
      break;
    case 'phone':
      if (!customerData.phone.trim()) formErrors.phone = 'O telefone é obrigatório.';
      break;
    case 'cep':
      if (customerData.deliveryType === 'Entrega') {
        if (!customerData.cep.trim()) {
          formErrors.cep = 'O CEP é obrigatório para entrega.';
        } else if (!/^\d{5}-?\d{3}$/.test(customerData.cep.trim())) {
          formErrors.cep = 'Formato de CEP inválido (ex: 12345-678).';
        }
      }
      break;
    case 'address':
      if (customerData.deliveryType === 'Entrega' && !customerData.address.trim()) {
        formErrors.address = 'O endereço é obrigatório para entrega.';
      }
      break;
    case 'neighborhood':
      if (customerData.deliveryType === 'Entrega' && !customerData.neighborhood.trim()) {
        formErrors.neighborhood = 'O bairro é obrigatório para entrega.';
      }
      break;
    case 'changeAmount':
      if (paymentMethod.value === 'cash' && needChange.value === 'yes') {
        if (changeAmount.value <= 0) {
          formErrors.changeAmount = 'Informe um valor válido para o troco.';
        } else if (changeAmount.value < finalOrderTotal.value) { // Compara com o total final do pedido
          formErrors.changeAmount = `O valor para troco deve ser igual ou maior que o total do pedido (${formatPrice(finalOrderTotal.value)}).`;
        }
      }
      break;
  }
  validateForm(); // Revalida o formulário global
}


// Validação completa do formulário
function validateForm() {
  let isValid = true;

  // Reset all errors before validating
  for (let key in formErrors) {
    formErrors[key] = null;
  }

  if (!customerData.name.trim()) {
    formErrors.name = 'O nome é obrigatório.';
    isValid = false;
  }
  if (!customerData.phone.trim()) {
    formErrors.phone = 'O telefone é obrigatório.';
    isValid = false;
  }

  // Validação condicional para entrega
  if (customerData.deliveryType === 'Entrega') {
    if (!customerData.cep.trim()) {
      formErrors.cep = 'O CEP é obrigatório para entrega.';
      isValid = false;
    } else if (customerData.cep.trim() && !/^\d{5}-?\d{3}$/.test(customerData.cep.trim())) {
      formErrors.cep = 'Formato de CEP inválido (ex: 12345-678).';
      isValid = false;
    }

    if (!customerData.address.trim()) {
      formErrors.address = 'O endereço é obrigatório para entrega.';
      isValid = false;
    }
    if (!customerData.neighborhood.trim()) {
      formErrors.neighborhood = 'O bairro é obrigatório para entrega.';
      isValid = false;
    }
  }

  // Validação do troco
  if (paymentMethod.value === 'cash' && needChange.value === 'yes') {
    if (changeAmount.value <= 0) {
      formErrors.changeAmount = 'Informe um valor válido para o troco.';
      isValid = false;
    } else if (changeAmount.value < finalOrderTotal.value) {
      formErrors.changeAmount = `O valor para troco deve ser igual ou maior que o total do pedido (${formatPrice(finalOrderTotal.value)}).`;
      isValid = false;
    }
  }

  return isValid;
}

// Função para buscar endereço por CEP
async function fetchAddressByCep() {
  const cep = customerData.cep.replace(/\D/g, ''); // Remove não-dígitos
  if (cep.length !== 8) {
    formErrors.cep = 'CEP deve ter 8 dígitos.';
    return;
  }

  cepLoading.value = true;
  formErrors.cep = null; // Limpa erro de CEP enquanto busca
  try {
    const response = await fetch(`${VIA_CEP_API_URL}${cep}/json/`);
    const data = await response.json();

    if (data.erro) {
      formErrors.cep = 'CEP não encontrado.';
      customerData.address = '';
      customerData.neighborhood = '';
    } else {
      customerData.address = data.logradouro;
      customerData.neighborhood = data.bairro;
      // customerData.city = data.localidade; // Adicione se tiver este campo
      // customerData.state = data.uf; // Adicione se tiver este campo
      formErrors.address = null; // Limpa erros se preenchido
      formErrors.neighborhood = null; // Limpa erros se preenchido
    }
  } catch (error) {
    console.error("Erro ao buscar CEP:", error);
    formErrors.cep = 'Erro ao buscar CEP. Tente novamente.';
  } finally {
    cepLoading.value = false;
    validateField('address'); // Revalida os campos de endereço e bairro após a busca do CEP
    validateField('neighborhood');
  }
}

// Salva dados do cliente e sai do modo de edição, se válido
function saveCustomerDataAndExitEditMode() {
  if (validateForm()) {
    saveCustomerDataLocally();
    editingCustomerData.value = false;
  } else {
    // Não usar alert aqui, as mensagens de erro já estão nos campos
    // alert("Por favor, corrija os erros nos seus dados para salvar.");
  }
}

// --- Funções de Cupom ---
async function applyCoupon() {
  if (!couponCode.value || isApplyingCoupon.value) return;

  isApplyingCoupon.value = true;
  couponError.value = null;
  appliedCoupon.value = null;

  try {
    const response = await api.post('/coupons/apply', { couponCode: couponCode.value.toUpperCase() });
    appliedCoupon.value = response.data.coupon; // Supondo que a API retorne { coupon: { name, type, discount_amount } }
    couponCode.value = appliedCoupon.value.name; // Garante que o input mostre o nome correto do cupom
    // O watcher de appliedCoupon cuidará de salvar no localStorage
  } catch (err) {
    console.error("Erro ao aplicar cupom:", err);
    couponError.value = err.response?.data?.error || "Erro ao aplicar cupom. Verifique o código.";
  } finally {
    isApplyingCoupon.value = false;
  }
}

function removeCoupon() {
  appliedCoupon.value = null;
  couponCode.value = ''; // Limpa o campo do cupom
  couponError.value = null; // Limpa qualquer erro de cupom
  // O watcher de appliedCoupon cuidará de remover do localStorage
}


onMounted(() => {
  const storedCustomerData = localStorage.getItem(CUSTOMER_DATA_LOCAL_STORAGE_KEY);
  if (storedCustomerData) {
    try {
      const parsedData = JSON.parse(storedCustomerData);
      Object.assign(customerData, parsedData);
    } catch (e) {
      console.error("Erro ao parsear dados do cliente do localStorage:", e);
      localStorage.removeItem(CUSTOMER_DATA_LOCAL_STORAGE_KEY);
    }
  }

  const storedCoupon = localStorage.getItem(APPLIED_COUPON_LOCAL_STORAGE_KEY);
  if (storedCoupon) {
    try {
      appliedCoupon.value = JSON.parse(storedCoupon);
      couponCode.value = appliedCoupon.value.name; // Pré-preenche o campo do cupom
    } catch (e) {
      console.error("Erro ao parsear cupom do localStorage:", e);
      localStorage.removeItem(APPLIED_COUPON_LOCAL_STORAGE_KEY);
      appliedCoupon.value = null;
      couponCode.value = '';
    }
  }

  // Se não há dados válidos, ou se estamos iniciando sem dados, force a edição
  if (!hasCustomerData.value) {
    editingCustomerData.value = true;
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

  // Garante que o modo de edição esteja desativado e os dados sejam válidos
  if (editingCustomerData.value) {
    saveCustomerDataAndExitEditMode();
    if (editingCustomerData.value) { // Se ainda estiver em modo de edição, significa que a validação falhou
      alert("Por favor, preencha corretamente seus dados de entrega antes de finalizar o pedido.");
      return;
    }
  }

  // Validação final antes de prosseguir
  if (!validateForm()) {
    alert("Por favor, corrija os erros no formulário antes de finalizar o pedido.");
    return;
  }

  isSubmitting.value = true; // Ativa o estado de carregamento

  try {
    const subtotalPedido = cartTotal.value;
    const taxaEntregaPedido = deliveryFee.value;
    const totalPedido = finalOrderTotal.value; // Usa o total já com desconto

    const orderDetails = {
      orderNumber: generateOrderNumber(),
      customer: { ...customerData },
      items: cartStore.items,
      subtotal: subtotalPedido,
      tax: taxaEntregaPedido,
      total: totalPedido,
      paymentMethod: paymentMethod.value,
      deliveryType: customerData.deliveryType,
      needChange: needChange.value === "yes",
      changeAmount:
        paymentMethod.value === "cash" && needChange.value === "yes" && changeAmount.value > totalPedido
          ? changeAmount.value
          : null,
      obs: customerData.obs || null,
      coupon: appliedCoupon.value ? { // Inclui detalhes do cupom se aplicado
        name: appliedCoupon.value.name,
        type: appliedCoupon.value.type,
        discount_amount: appliedCoupon.value.discount_amount,
        calculated_discount: calculatedDiscount.value
      } : null,
      created_at: new Date().toISOString(),
      status: "pending", // Status inicial do pedido antes de ser processado pelo robô
    };

    const cartItemsFormatted = cartStore.items.map((item) => {
      let itemString = `${item.quantity}x ${item.name}${item.size ? ` (${item.size})` : ""
        } - R$ ${item.subtotal.toFixed(2).replace(".", ",")}`;
      if (item.extras && item.extras.length > 0) {
        const extrasString = item.extras
          .map((e) => `${e.name} - R$ ${e.price.toFixed(2).replace(".", ",")}`)
          .join(" | ");
        itemString += `\n_Adicionais:_ ${extrasString}`;
      }
      return itemString;
    }).join("\n");

    let deliverySpecificInfo = [`*Tipo:* ${orderDetails.deliveryType}`];
    if (orderDetails.deliveryType === "Entrega") {
      deliverySpecificInfo.push(`*Tempo de entrega:* 40 a 50min`);
    } else {
      deliverySpecificInfo.push(`*Pronto para retirada em:* 20-30min`);
    }

    let message =
      `NOVO PEDIDO: #${orderDetails.orderNumber}\n\n` +
      `DADOS DO PEDIDO:\n` +
      `${cartItemsFormatted}\n\n` +
      `DADOS DA ENTREGA:\n` +
      `${deliverySpecificInfo.join("\n")}\n` +
      `*Cliente:* ${customerData.name}\n` +
      `*Telefone:* ${customerData.phone}\n`;

    if (orderDetails.deliveryType === "Entrega") {
      message += `*CEP:* ${customerData.cep || 'N/A'}\n`;
      message += `*Endereço:* ${customerData.address}\n`;
      message += `*Ponto de referência:* ${customerData.reference || 'nenhum'}\n`;
      message += `*Bairro:* ${customerData.neighborhood}\n`;
    }

    message +=
      `\n` +
      `DADOS DO PAGAMENTO:\n` +
      `*Método de pagamento:* ${orderDetails.paymentMethod ? orderDetails.paymentMethod.toUpperCase() : "N/A"
      }\n` +
      `*Subtotal:* R$ ${subtotalPedido.toFixed(2).replace(".", ",")}\n`;

    if (orderDetails.deliveryType === "Entrega") {
      message += `*Taxa de entrega:* R$ ${taxaEntregaPedido.toFixed(2).replace(".", ",")}\n`;
    }

    if (appliedCoupon.value) {
      message += `*Desconto de Cupom (${appliedCoupon.value.name.toUpperCase()}):* - ${formatPrice(calculatedDiscount.value)}\n`;
    }

    message += `*Total:* R$ ${totalPedido.toFixed(2).replace(".", ",")}`;

    if (orderDetails.paymentMethod === 'cash' && orderDetails.needChange && orderDetails.changeAmount) {
      message += `\n*Troco para:* R$ ${orderDetails.changeAmount.toFixed(2).replace(".", ",")}`;
    }

    if (customerData.obs) {
      message += `\n\n*Observações:* ${customerData.obs}`;
    }

    const phone = "5571992477638"; // Seu número de telefone para o robô WhatsApp
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${phone}?text=${encoded}`);

    // Aguarda um curto período para garantir que a janela do WhatsApp seja aberta
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Se o cupom foi aplicado, chame a API para marcá-lo como usado APÓS ABRIR O WHATSAPP
    if (appliedCoupon.value) {
      try {
        await api.post('/coupons/use', { couponCode: appliedCoupon.value.name.toUpperCase(), orderId: orderDetails.orderNumber });
        console.log(`Cupom ${appliedCoupon.value.name} marcado como usado.`);
      } catch (couponUseError) {
        console.error("Erro ao marcar cupom como usado:", couponUseError);
        // Não impede o fluxo, mas loga o erro.
      }
    }

    orderNumber.value = orderDetails.orderNumber; // Exibe o número do pedido
    saveCustomerDataLocally();
    cartStore.clearCart();
    removeCoupon(); // Remove o cupom do localStorage e do estado local
    editingCustomerData.value = false;

    // Redireciona após um tempo para que o usuário veja o número do pedido
    setTimeout(() => {
      orderNumber.value = "";
      router.push("/");
    }, 3000);

  } catch (error) {
    console.error("Erro ao finalizar pedido:", error);
    alert("Ocorreu um erro ao finalizar o pedido. Por favor, tente novamente.");
  } finally {
    isSubmitting.value = false; // Desativa o estado de carregamento
  }
}
</script>
