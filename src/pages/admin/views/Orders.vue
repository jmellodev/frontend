<template>
  <div>
    <AdminLayout>
      <div class="space-y-6 p-4 md:p-8 bg-white dark:bg-gray-800 h-screen rounded-lg shadow-xl">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
              Pedidos
              <span v-if="isConnected" class="inline-flex items-center ml-2">
                <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span class="text-xs text-green-600 dark:text-green-400 ml-1">Tempo Real</span>
              </span>
              <span v-else class="inline-flex items-center ml-2">
                <div class="w-2 h-2 bg-red-500 rounded-full"></div>
                <span class="text-xs text-red-600 dark:text-red-400 ml-1">Desconectado</span>
              </span>
            </h2>
            <p class="text-gray-600 dark:text-gray-400 text-xs font-normal">
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

        <div v-else class="grid grid-cols-1 lg:grid-cols-4 gap-2">
          <div v-for="order in sortedOrders" :key="order.id" @click="view(order)" :class="[
            'p-2 rounded-md border border-gray-200/40 dark:border-gray-700/40 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white text-sm flex items-end justify-between shadow-md cursor-pointer hover:shadow-lg transition-all duration-300',
            order.isNew ? 'ring-2 ring-green-500 bg-green-50 dark:bg-green-900/20' : ''
          ]">
            <div class="flex-shrink-0 mr-4 space-y-1">
              <div class="flex items-center gap-2">
                <p class="font-semibold">Pedido: <span class="font-light">{{ order.id }}</span></p>
                <span v-if="order.isNew"
                  class="px-1 py-0.5 bg-green-500 text-white text-xs rounded-full animate-bounce">
                  NOVO
                </span>
              </div>
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

        <!-- Notificação de erro de conexão -->
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

// Estados reativo
const orders = ref([]);
const selectedOrder = ref(null);
const showDetails = ref(false);
const isLoading = ref(true);
const isConnected = ref(false);
const connectionError = ref('');
const lastUpdate = ref('');
const isUpdatingStatus = ref(false);
const newOrderIds = ref(new Set());

// Instância do Firestore
const db = getFirestore(app);
let unsubscribe = null;

const statusOptions = ["recebido", "em_preparo", "finalizado", "a_caminho", "entregue", "cancelado", "em processamento"];

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

// Computed para ordenar pedidos (novos primeiro, depois por data)
const sortedOrders = computed(() => {
  return [...orders.value].sort((a, b) => {
    // Primeiro, pedidos novos
    if (a.isNew && !b.isNew) return -1;
    if (!a.isNew && b.isNew) return 1;

    // Depois por data (mais recentes primeiro)
    const dateA = getTimestamp(a.created_at);
    const dateB = getTimestamp(b.created_at);
    return dateB - dateA;
  });
});

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
  // Se tem a propriedade _seconds (formato antigo)
  if (ts && typeof ts._seconds !== 'undefined') {
    return new Date(ts._seconds * 1000).toLocaleString('pt-BR');
  }
  // Se é uma data JavaScript
  if (ts instanceof Date) {
    return ts.toLocaleString('pt-BR');
  }
  // Se é uma string de data
  if (typeof ts === 'string') {
    return new Date(ts).toLocaleString('pt-BR');
  }
  // Se é um timestamp em segundos
  if (typeof ts === 'number' && ts > 1000000000) {
    // Se é em milissegundos
    if (ts > 1000000000000) {
      return new Date(ts).toLocaleString('pt-BR');
    }
    // Se é em segundos
    return new Date(ts * 1000).toLocaleString('pt-BR');
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
    case 'approved': return 'Pago';
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
  if (order.isNew) {
    order.isNew = false;
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

    // Atualiza localmente também para feedback imediato
    const localIndex = orders.value.findIndex(o => o.id === orderId);
    if (localIndex !== -1) {
      orders.value[localIndex].status = newStatus;
    }

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
    // Cria query ordenada por data de criação
    const ordersQuery = query(
      collection(db, 'orders'),
      orderBy('created_at', 'desc')
    );

    // Configura listener em tempo real
    unsubscribe = onSnapshot(
      ordersQuery,
      (snapshot) => {
        const currentOrderIds = new Set(orders.value.map(o => o.id));

        snapshot.docChanges().forEach((change) => {
          const orderData = { id: change.doc.id, ...change.doc.data() };

          if (change.type === 'added') {
            // Novo pedido
            if (!currentOrderIds.has(orderData.id)) {
              orderData.isNew = true;
              newOrderIds.value.add(orderData.id);
              orders.value.unshift(orderData);

              // Notificação sonora ou visual para novo pedido
              if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('Novo Pedido!', {
                  body: `Pedido #${orderData.id} de ${orderData.client}`,
                  icon: '/favicon.ico'
                });
              }
            }
          } else if (change.type === 'modified') {
            // Pedido modificado
            const index = orders.value.findIndex(o => o.id === orderData.id);
            if (index !== -1) {
              orders.value[index] = { ...orders.value[index], ...orderData };
            }
          } else if (change.type === 'removed') {
            // Pedido removido
            const index = orders.value.findIndex(o => o.id === orderData.id);
            if (index !== -1) {
              orders.value.splice(index, 1);
            }
            newOrderIds.value.delete(orderData.id);
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

        // Tentar reconectar após 5 segundos
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

  // Remove listener existente se houver
  if (unsubscribe) {
    unsubscribe();
  }

  // Configura novo listener
  setupRealtimeListener();
}

// Fallback: carrega pedidos via API se Firestore falhar
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

  // Solicita permissão para notificações
  if ('Notification' in window && Notification.permission === 'default') {
    await Notification.requestPermission();
  }

  // Configura listener do Firestore
  setupRealtimeListener();

  // Fallback: se não conectar em 10 segundos, usa API
  setTimeout(() => {
    if (!isConnected.value && orders.value.length === 0) {
      console.warn("Firestore não conectou, usando API como fallback");
      loadOrdersFromAPI();
      isLoading.value = false;
    }
  }, 10000);
});

onUnmounted(() => {
  // Remove listener quando componente é desmontado
  if (unsubscribe) {
    unsubscribe();
    console.log("Listener Firestore removido");
  }
});
</script>