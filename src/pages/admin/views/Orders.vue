<template>
  <div>
    <AdminLayout>
      <div class="space-y-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold text-gray-700 dark:text-white">
              Pedidos
              <span class="inline-flex items-center ml-2">
                <div
                  :class="[isConnected ? 'w-2 h-2 bg-green-500 rounded-full animate-pulse' : 'w-2 h-2 bg-red-500 rounded-full']">
                </div>
                <span
                  :class="[isConnected ? 'text-xs text-green-600 dark:text-green-400 ml-1' : 'text-xs text-red-600 dark:text-red-400 ml-1']">
                  {{ isConnected ? 'Tempo real' : 'Desconectado' }}
                </span>
              </span>
            </h2>
            <p class="text-gray-600 dark:text-gray-400 text-xs font-normal italic">
              Gerencie todos os pedidos recebidos em tempo real.
            </p>
          </div>
          <div class="text-right">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Total de pedidos: <span class="font-semibold">{{ orders.length }}</span>
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-500">
              Última atualização: {{ lastUpdate }}
            </p>
          </div>
        </div>

        <div v-if="isLoading" class="text-center py-8">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-400 dark:border-gray-600 mx-auto">
          </div>
          <p class="text-gray-600 dark:text-gray-400 mt-4">Carregando pedidos...</p>
        </div>

        <div v-else-if="orders.length === 0" class="text-center py-8">
          <p class="text-gray-600 dark:text-gray-400 text-lg">Nenhum pedido encontrado.</p>
        </div>

        <div v-else class="flex flex-col lg:flex-row gap-4">
          <div class="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-2 flex-grow">
            <!-- Novos -->
            <div class="bg-green-700/10 rounded-lg ">
              <h3
                class="p-2 text-white mb-4 border-b border-green-900/30 rounded-t-md bg-green-700 bg-linear from-green-800 via-green-700 to-green-500">
                <span>Novos pedidos</span>
                <span
                  class="ml-2 px-2 py-1 text-xs rounded-full bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200">
                  {{ newOrders.length }}
                </span>
              </h3>
              <div class="space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
                <div v-for="order in newOrders" :key="order.id" @click="view(order)" :class="[
                  'p-2 rounded-md border border-green-200/40 dark:border-green-700/40 bg-green-200 dark:bg-green-800 text-gray-800 dark:text-white text-sm flex items-end justify-between shadow-md cursor-pointer hover:shadow-lg transition-all duration-300',
                  newOrderIds.has(order.id) ? 'bg-green-50 dark:bg-green-900/20' : ''
                ]">
                  <div class="flex-shrink-0 space-y-1 text-xs">
                    <p class="font-semibold">Pedido: <span class="font-light">{{ order.id }}</span></p>
                    <p><i class="fa-duotone fa-solid fa-user"></i> <span class="font-light">
                        {{ order.client }}</span>
                    </p>
                    <p class="flex items-center justify-between space-x-4">
                    <div>
                      <i class="fa-duotone fa-solid fa-money-bill-wave mr-2"></i>
                      <span class="font-light">
                        {{ $formatPrice(order.total) }}
                      </span>
                    </div>
                    <div>Pagamento: {{ getStatusPayment(order.payment_status) }}</div>
                    </p>
                    <p class="font-semibold hidden">Status:
                      <span class="font-light" :class="getStatusBadgeClass(order.status)">
                        {{ formatText(order.status) }}
                      </span>
                    </p>
                    <p class="font-semibold"><i class="fa-duotone fa-solid fa-calendar-days"></i> <span
                        class="font-light">{{ formatDate(order.created_at)
                        }}</span>
                    </p>
                  </div>
                </div>
                <p v-if="newOrders.length === 0" class="text-center text-gray-500 dark:text-gray-400 py-4">Nenhum pedido
                  novo.</p>
              </div>
            </div>
            <!-- Em preparo -->
            <div class="bg-sky-700/10 rounded-lg">
              <h3
                class="text-white rounded-t-md mb-4 border-b p-2 border-gray-300 dark:border-gray-700 bg-sky-700 bg-linear from-sky-800 via-sky-700 to-sky-500">
                Em preparo
                <span
                  class="ml-2 px-2 py-1 text-xs rounded-full bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200">{{
                    preparingOrders.length }}</span>
              </h3>
              <div class="space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
                <div v-for="order in preparingOrders" :key="order.id" @click="view(order)" :class="[
                  'p-2 rounded-md border border-gray-200/40 dark:border-gray-700/40 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white text-sm flex items-end justify-between shadow-md cursor-pointer hover:shadow-lg transition-all duration-300'
                ]">
                  <div class="flex-shrink-0 mr-4 space-y-1 text-xs">
                    <p class="font-semibold">Pedido: <span class="font-light">{{ order.id }}</span></p>
                    <p class="font-semibold"><i class="fa-duotone fa-solid fa-user"></i> <span class="font-light">{{
                      order.client }}</span></p>
                    <p class="font-semibold">
                      <i class="fa-duotone fa-solid fa-money-bill-wave mr-2"></i>
                      <span class="font-light">
                        {{ $formatPrice(order.total) }}
                      </span>
                    </p>
                    <p class="font-semibold hidden">Status:
                      <span class="font-light" :class="getStatusBadgeClass(order.status)">
                        {{ formatText(order.status) }}
                      </span>
                    </p>
                    <p class="font-semibold"><i class="fa-duotone fa-solid fa-calendar-days"></i> <span
                        class="font-light">{{ formatDate(order.created_at)
                        }}</span>
                    </p>
                  </div>
                </div>
                <p v-if="preparingOrders.length === 0" class="text-center text-gray-500 dark:text-gray-400 py-4">Nenhum
                  pedido em preparo.</p>
              </div>
            </div>
            <!-- A caminho -->
            <div class="bg-purple-700/10 rounded-lg">
              <h3
                class="bg-purple-700 bg-linear from-purple-800 via-purple-700 to-purple-500 p-2 rounded-t-md text-white">
                A caminho
                <span
                  class="ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-purple-200 text-purple-800 dark:bg-purple-800 dark:text-purple-200">{{
                    onTheWayOrders.length }}</span>
              </h3>
              <div class="space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
                <div v-for="order in onTheWayOrders" :key="order.id" @click="view(order)" :class="[
                  'p-2 rounded-md border border-purple-200/40 dark:border-purple-700/40 bg-purple-200 dark:bg-purple-800 text-gray-800 dark:text-white text-sm flex items-end justify-between shadow-md cursor-pointer hover:shadow-lg transition-all duration-300'
                ]">
                  <div class="flex-shrink-0 mr-4 space-y-1 text-xs">
                    <p class="font-semibold">Pedido: <span class="font-light">{{ order.id }}</span></p>
                    <p class="font-semibold"><i class="fa-duotone fa-solid fa-user"></i> <span class="font-light">{{
                      order.client }}</span></p>
                    <p class="font-semibold">
                      <i class="fa-duotone fa-solid fa-money-bill-wave mr-2"></i>
                      <span class="font-light">
                        {{ $formatPrice(order.total) }}
                      </span>
                    </p>
                    <p class="font-semibold hidden">Status:
                      <span class="font-light" :class="getStatusBadgeClass(order.status)">
                        {{ formatText(order.status) }}
                      </span>
                    </p>
                    <p class="font-semibold"><i class="fa-duotone fa-solid fa-calendar-days"></i> <span
                        class="font-light">{{ formatDate(order.created_at)
                        }}</span>
                    </p>
                  </div>
                </div>
                <p v-if="onTheWayOrders.length === 0" class="text-center text-gray-500 dark:text-gray-400 py-4">Nenhum
                  pedido a caminho.</p>
              </div>
            </div>
          </div>
          <!-- Legenda -->
          <div class="lg:w-52 bg-gray-100 dark:bg-gray-900 p-4 rounded-lg shadow-inner flex-shrink-0">
            <h3
              class="text-lg font-bold text-gray-900 dark:text-white mb-4 border-b pb-2 border-gray-300 dark:border-gray-700">
              Legenda</h3>
            <ul class="space-y-2">
              <li>
                <span :class="getStatusBadgeClass('recebido')">Recebido</span>
              </li>
              <li>
                <span :class="getStatusBadgeClass('em processamento')">Em Processamento</span>
              </li>
              <li>
                <span :class="getStatusBadgeClass('em_preparo')">Em Preparo</span>
              </li>
              <li>
                <span :class="getStatusBadgeClass('a_caminho')">A Caminho</span>
              </li>
              <li>
                <span :class="getStatusBadgeClass('entregue')">Entregue</span>
              </li>
              <li>
                <span :class="getStatusBadgeClass('cancelado')">Cancelado</span>
              </li>
              <li class="flex flex-col">
                <span class="px-2 py-1 bg-green-500 text-green-800 text-xs rounded-full">NOVO <small>(Badge
                    Verde)</small></span>: <span class="dark:text-gray-400 text-xs">Pedido
                  que acaba de ser marcado como "recebido" ou "em processamento" e ainda não foi visualizado.</span>
              </li>
            </ul>
          </div>
        </div>

        <div v-if="finishedOrders.length > 0" class="mt-8">
          <h3
            class="text-xl font-bold text-gray-900 dark:text-white mb-4 border-b pb-2 border-gray-300 dark:border-gray-700">
            Pedidos finalizados
            <span class="ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-gray-200 text-gray-800 dark:bg-gray-900 inset-shadow-red-500 shaodw-md
               dark:text-gray-200">{{
                finishedOrders.length }}</span>
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <div v-for="order in finishedOrders" :key="order.id" @click="view(order)" :class="[
              'p-2 rounded-md border border-gray-200/40 dark:border-gray-700/40 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white text-sm flex items-end justify-between shadow-md cursor-pointer hover:shadow-lg transition-all duration-300'
            ]">
              <div class="flex-shrink-0 mr-4 space-y-1">
                <p class="font-semibold">Pedido: <span class="font-light">{{ order.id }}</span></p>
                <p class="font-semibold">Cliente: <span class="font-light">{{ order.client }}</span></p>
                <p class="font-semibold">Total: <span class="font-light">{{ $formatPrice(order.total) }}</span></p>
                <p class="font-semibold">Status:
                  <span class="font-light" :class="getStatusBadgeClass(order.status)">
                    {{ formatText(order.status) }}
                  </span>
                </p>
                <p class="font-semibold">Data: <span class="font-light">{{ formatDate(order.created_at) }}</span></p>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="!isLoading && orders.length > 0" class="mt-8 text-center text-gray-500 dark:text-gray-400 py-4">
          Nenhum pedido finalizado.</div>

        <div v-if="connectionError"
          class="bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded relative">
          <strong class="font-bold">Erro de Conexão!</strong>
          <span class="block sm:inline"> {{ connectionError }}</span>
          <button @click="reconnect" class="ml-2 underline hover:no-underline">
            Tentar Reconectar
          </button>
        </div>
      </div>
    </AdminLayout>

    <BaseModal v-if="selectedOrder" v-model:open="showDetails">
      <div class="text-gray-900 dark:text-white relative">
        <button @click="closeModal"
          class="absolute -top-5 -right-5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-xl">
          &times;
        </button>
        <h3 class="md:text-2xl font-bold mb-4 border-b border-gray-300 dark:border-gray-900 pb-2">
          Detalhes do Pedido <span class="text-orange-500 italic font-normal">#{{ selectedOrder.id }}</span>
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 text-gray-700 dark:text-gray-300 text-md">
          <div><span class="font-semibold text-gray-600 dark:text-gray-400">Cliente:</span> {{ selectedOrder.client }}
          </div>
          <div><span class="font-semibold text-gray-600 dark:text-gray-400">Telefone:</span> {{ selectedOrder.telefone
            || selectedOrder.phone }}</div>
          <div><span class="font-semibold text-gray-600 dark:text-gray-400">Total:</span> {{
            $formatPrice(selectedOrder.total) }}</div>
          <div><span class="font-semibold text-gray-600 dark:text-gray-400">Subtotal:</span> {{
            $formatPrice(selectedOrder.subtotal) }}</div>
          <div><span class="font-semibold text-gray-600 dark:text-gray-400">Taxa de Entrega:</span> {{
            $formatPrice(selectedOrder.taxaEntrega || selectedOrder.fee) }}</div>
          <div><span class="font-semibold text-gray-600 dark:text-gray-400">Tipo de Entrega:</span> {{
            selectedOrder.tipoEntrega || selectedOrder.delivery_type }}</div>
          <div><span class="font-semibold text-gray-600 dark:text-gray-400">Método de Pagamento:</span> {{
            getPaymentType(selectedOrder.metodoPagamento || selectedOrder.payment_method) }}</div>
          <div><span class="font-semibold text-gray-600 dark:text-gray-400">Status do Pagamento:</span> {{
            getStatusPayment(selectedOrder.payment_status) }}</div>
          <div><span class="font-semibold text-gray-600 dark:text-gray-400">Data do Pedido:</span> {{
            formatDate(selectedOrder.created_at) }}</div>

          <div class="col-span-full">
            <span class="font-semibold text-gray-600 dark:text-gray-400">Endereço:</span>
            <div v-if="selectedOrder.address && selectedOrder.address.length > 0">
              <p v-for="(addr, idx) in selectedOrder.address" :key="idx">
                {{ addr.street }}, {{ addr.neighborhood }}
                <span v-if="addr.reference"> (Ref: {{ addr.reference }})</span>
              </p>
            </div>
            <div v-else>Nenhum endereço fornecido.</div>
          </div>

          <div class="col-span-full">
            <span class="font-semibold text-gray-600 dark:text-gray-400">Status do Pedido:</span>
            <select v-model="selectedOrder.status"
              class="p-2 bg-gray-200 dark:bg-gray-700 border border-gray-400 dark:border-gray-600 rounded-md text-gray-800 dark:text-white focus:ring-blue-500 focus:border-blue-500 ml-2 mt-2">
              <option v-for="status in statusOptions" :key="status" :value="status">
                {{ formatText(status) }}
              </option>
            </select>
          </div>
        </div>

        <div v-if="selectedOrder.itens && selectedOrder.itens.length">
          <h4
            class="font-semibold mt-6 mb-2 text-gray-700 dark:text-gray-300 border-t border-gray-300 dark:border-gray-900 pt-4">
            Itens do Pedido:
          </h4>
          <ul class="text-sm space-y-1">
            <li v-for="(item, idx) in selectedOrder.itens" :key="idx" class="text-gray-700 dark:text-gray-300">
              <p class="font-semibold">{{ item.item.replaceAll('r$', 'R$') }}</p>
              <p v-if="item.adicionais" class="text-xs text-gray-600 dark:text-gray-400">
                <span class="italic">Adicionais:</span> {{ item.adicionais.replaceAll('r$', 'R$') }}
              </p>
            </li>
          </ul>
        </div>

        <div class="mt-6 flex justify-end space-x-4 border-t border-gray-300 dark:border-gray-900 pt-4">
          <button @click="updateStatus" :disabled="isUpdatingStatus || !selectedOrder?.id || !selectedOrder?.status"
            class="px-5 py-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed text-white text-md rounded-md transition-colors duration-200">
            {{ isUpdatingStatus ? 'Salvando...' : 'Salvar' }}
          </button>
          <button @click="closeModal"
            class="px-5 py-1 bg-red-600 hover:bg-red-800 text-white text-md rounded-md transition-colors duration-200">
            Cancelar
          </button>
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import api from "@/services/httpClient";
import { app } from '@/firebase/firebaseClient';
import AdminLayout from "@/layouts/AdminLayout.vue";
import BaseModal from "@/components/modals/BaseModal.vue";
import { ref, onMounted, onUnmounted, computed } from "vue";
import { getFirestore, collection, onSnapshot, doc, updateDoc, query, orderBy } from 'firebase/firestore';

// Estados reativos
const orders = ref([]);
const selectedOrder = ref(null);
const showDetails = ref(false);
const isLoading = ref(true);
const isConnected = ref(false);
const connectionError = ref('');
const lastUpdate = ref('');
const isUpdatingStatus = ref(false);
const newOrderIds = ref(new Set()); // Para controlar quais pedidos são "novos" visualmente (badge)

// Instância do Firestore
const db = getFirestore(app);
let unsubscribe = null;

const statusOptions = ["recebido", "em_preparo", "a_caminho", "entregue", "cancelado", "em processamento"];

// Função auxiliar para extrair timestamp para ordenação
function getTimestamp(ts) {
  if (!ts) return 0;
  if (ts && typeof ts.toDate === 'function') {
    return ts.toDate().getTime();
  }
  if (ts && typeof ts._seconds !== 'undefined') {
    return ts._seconds * 1000;
  }
  if (ts instanceof Date) {
    return ts.getTime();
  }
  if (typeof ts === 'string') {
    return new Date(ts).getTime();
  }
  if (typeof ts === 'number') {
    return ts > 1000000000000 ? ts : ts * 1000;
  }
  return 0;
}

// --- Computed Properties para as Colunas ---
const newOrders = computed(() => {
  return orders.value
    .filter(order => ['recebido', 'em processamento'].includes(order.status) && order.payment_status !== 'cancelled')
    .sort((a, b) => getTimestamp(b.created_at) - getTimestamp(a.created_at)); // Mais recentes primeiro
});

const preparingOrders = computed(() => {
  return orders.value
    .filter(order => order.status === 'em_preparo')
    .sort((a, b) => getTimestamp(b.created_at) - getTimestamp(a.created_at));
});

const onTheWayOrders = computed(() => {
  return orders.value
    .filter(order => order.status === 'a_caminho')
    .sort((a, b) => getTimestamp(b.created_at) - getTimestamp(a.created_at));
});

const finishedOrders = computed(() => {
  return orders.value
    .filter(order => ['entregue', 'cancelado'].includes(order.status))
    .sort((a, b) => getTimestamp(b.created_at) - getTimestamp(a.created_at));
});
// --- Fim das Computed Properties para Colunas ---

function formatText(text) {
  let formattedText = text.replace(/_/g, ' ');
  formattedText = formattedText.charAt(0).toUpperCase() + formattedText.slice(1);
  return formattedText;
}

function formatDate(ts) {
  if (!ts) return "";
  // Se é um timestamp do Firestore
  if (ts && typeof ts.toDate === 'function') {
    return ts.toDate().toLocaleString('pt-BR');
  }

  return "";
}

const getPaymentType = (type) => {
  switch (type) {
    case 'credit_card': return 'Cartão de Crédito';
    case 'debit_card': return 'Cartão de Débito';
    case 'bank_transfer':
    case 'pix': return 'Pix';
    case 'cash': return 'Dinheiro';
    default: return 'Outro';
  }
};

const getStatusPayment = (status) => {
  switch (status) {
    case 'paid':
    case 'approved': return 'Aprovado';
    case 'pending': return 'Pendente';
    case 'failed': return 'Falhou';
    case 'refunded': return 'Reembolsado';
    case 'cancelled': return 'Cancelado';
    default: return 'Desconhecido';
  }
};

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'em processamento':
      return 'rounded-full px-2 py-0.5 text-xs font-medium bg-orange-50 text-orange-600 dark:bg-orange-500/15 dark:text-orange-500';
    case 'recebido':
      return 'rounded-full px-2 py-0.5 text-xs font-medium bg-yellow-50 text-yellow-600 dark:bg-yellow-500/15 dark:text-yellow-500';
    case 'em_preparo':
      return 'rounded-full px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-500';
    case 'finalizado':
    case 'entregue':
      return 'rounded-full px-2 py-0.5 text-xs font-medium bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-500';
    case 'a_caminho': // Adicionado para a legenda
      return 'rounded-full px-2 py-0.5 text-xs font-medium bg-purple-50 text-purple-600 dark:bg-purple-500/15 dark:text-purple-500';
    case 'cancelado':
      return 'rounded-full px-2 py-0.5 text-xs font-medium bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-500';
    default:
      return 'rounded-full px-2 py-0.5 text-xs font-medium bg-gray-50 text-gray-600 dark:bg-gray-500/15 dark:text-gray-500';
  }
};

function view(order) {
  if (!order) {
    console.warn("Tentativa de visualizar pedido nulo");
    return;
  }

  if (!order.id) {
    console.warn("Pedido sem ID:", order);
    connectionError.value = "Erro: Pedido sem ID válido";
    return;
  }

  console.log("Visualizando pedido:", order.id);
  selectedOrder.value = JSON.parse(JSON.stringify(order));
  showDetails.value = true;

  // Remove o badge "novo" quando o pedido é visualizado
  if (newOrderIds.value.has(order.id)) {
    newOrderIds.value.delete(order.id);
  }
}

function closeModal() {
  selectedOrder.value = null;
  showDetails.value = false;
  isUpdatingStatus.value = false; // Garante que o estado seja resetado

  // Limpa erros relacionados à atualização quando fechar
  if (connectionError.value.includes('Erro ao atualizar pedido')) {
    connectionError.value = '';
  }
}

async function updateStatus() {
  // Validações mais robustas
  if (!selectedOrder.value) {
    console.warn("Nenhum pedido selecionado");
    return;
  }

  if (!selectedOrder.value.id) {
    console.warn("ID do pedido não encontrado");
    connectionError.value = "Erro: ID do pedido não encontrado";
    return;
  }

  if (!selectedOrder.value.status) {
    console.warn("Status do pedido não definido");
    connectionError.value = "Erro: Status do pedido não definido";
    return;
  }

  try {
    isUpdatingStatus.value = true;
    connectionError.value = ''; // Limpa erros anteriores

    const orderId = selectedOrder.value.id;
    const newStatus = selectedOrder.value.status;

    console.log(`Atualizando pedido ${orderId} para status: ${newStatus}`);

    // Atualiza no Firestore
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      status: newStatus,
      updated_at: new Date()
    });

    console.log("Status atualizado no Firestore com sucesso");

    // Também atualiza via API se necessário (fallback)
    try {
      await api.put(`/orders/${orderId}`, {
        status: newStatus,
      });
      console.log("Status atualizado na API com sucesso");
    } catch (apiError) {
      console.warn("Erro ao atualizar via API (mas Firestore foi atualizado):", apiError);
      // Não é um erro crítico, continua o fluxo
    }

    // A atualização local será tratada pelo listener do Firestore
    // que detectará a modificação e atualizará `orders.value`

    closeModal();
    console.log(`Status do pedido ${orderId} atualizado para: ${newStatus}`);

  } catch (error) {
    console.error("Erro ao atualizar status do pedido:", error);

    // Mensagem de erro mais específica
    let errorMessage = "Erro desconhecido";
    if (error.code === 'permission-denied') {
      errorMessage = "Sem permissão para atualizar este pedido";
    } else if (error.code === 'not-found') {
      errorMessage = "Pedido não encontrado no banco de dados";
    } else if (error.code === 'unavailable') {
      errorMessage = "Serviço temporariamente indisponível";
    } else if (error.message) {
      errorMessage = error.message;
    }

    connectionError.value = `Erro ao atualizar pedido: ${errorMessage}`;
  } finally {
    isUpdatingStatus.value = false;
  }
}

function setupRealtimeListener() {
  try {
    const ordersQuery = query(
      collection(db, 'orders'),
      orderBy('created_at', 'desc')
    );

    unsubscribe = onSnapshot(
      ordersQuery,
      (snapshot) => {
        const currentOrderIds = new Set(orders.value.map(o => o.id)); // IDs que já estão no array orders.value

        snapshot.docChanges().forEach((change) => {
          const orderData = { id: change.doc.id, ...change.doc.data() };
          const isNewStatus = ['recebido', 'em processamento'].includes(orderData.status);

          if (change.type === 'added') {
            // Se o pedido NÃO está na lista local (verdadeiramente novo para esta sessão)
            if (!currentOrderIds.has(orderData.id)) {
              if (isNewStatus) { // E se o status dele for "novo"
                newOrderIds.value.add(orderData.id); // Adiciona ao Set de IDs "novos" para o badge visual
              }
              orders.value.unshift(orderData); // Adiciona o pedido à lista principal

              // Notificação sonora ou visual APENAS se for um novo pedido E com status "novo"
              if (isNewStatus && 'Notification' in window && Notification.permission === 'granted') {
                new Notification('Novo Pedido!', {
                  body: `Pedido #${orderData.id} de ${orderData.client}`,
                  icon: '/assets/image/logo.png'
                });
              }
            } else {
              // Caso o pedido já exista na lista (ex: listener reconectou), 
              // garantir que o newOrderIds reflita o status atual
              if (isNewStatus) {
                newOrderIds.value.add(orderData.id);
              } else {
                newOrderIds.value.delete(orderData.id); // Remove de "novo" se o status mudou
              }
              // Atualiza o item existente caso tenha sido 'added' mas já esteja na lista
              const index = orders.value.findIndex(o => o.id === orderData.id);
              if (index !== -1) {
                orders.value[index] = { ...orders.value[index], ...orderData };
              }
            }
          } else if (change.type === 'modified') {
            const index = orders.value.findIndex(o => o.id === orderData.id);
            if (index !== -1) {
              orders.value[index] = { ...orders.value[index], ...orderData }; // Atualiza dados

              // Reavalia o estado "novo" com base no status atualizado
              if (isNewStatus) {
                newOrderIds.value.add(orderData.id);
              } else {
                newOrderIds.value.delete(orderData.id); // Remove de "novo" se o status mudou
              }
            }
          } else if (change.type === 'removed') {
            const index = orders.value.findIndex(o => o.id === orderData.id);
            if (index !== -1) {
              orders.value.splice(index, 1);
            }
            newOrderIds.value.delete(orderData.id); // Garante que seja removido do set de IDs "novos"
          }
        });

        isConnected.value = true;
        connectionError.value = '';
        lastUpdate.value = new Date().toLocaleTimeString();
        isLoading.value = false;
      },
      (error) => {
        console.error("Erro no listener Firestore:", error);
        connectionError.value = `Erro de conexão: ${error.message}`;
        isConnected.value = false;
        isLoading.value = false;

        setTimeout(() => {
          if (!isConnected.value) {
            reconnect();
          }
        }, 5000);
      }
    );

  } catch (error) {
    console.error("Erro ao configurar listener:", error);
    connectionError.value = `Erro ao conectar: ${error.message}`;
    isLoading.value = false;
  }
}

function reconnect() {
  console.log("Tentando reconectar...");
  connectionError.value = '';
  isLoading.value = true;

  if (unsubscribe) {
    unsubscribe();
  }

  setupRealtimeListener();
}

async function loadOrdersFromAPI() {
  try {
    const res = await api.get('/orders');
    orders.value = Array.isArray(res.data) ? res.data : [];
    console.log("Pedidos carregados via API como fallback");
  } catch (error) {
    console.error("Erro ao carregar pedidos via API:", error);
  }
}

onMounted(async () => {
  console.log("Iniciando conexão em tempo real com Firestore...");

  if ('Notification' in window && Notification.permission === 'default') {
    await Notification.requestPermission();
  }

  setupRealtimeListener();

  setTimeout(() => {
    if (!isConnected.value && orders.value.length === 0) {
      console.warn("Firestore não conectou, usando API como fallback");
      loadOrdersFromAPI();
      isLoading.value = false;
    }
  }, 10000);
});

onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe();
    console.log("Listener Firestore removido");
  }
});
</script>