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
          <div class="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-x-4 flex-grow">
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
                <OrderCard v-for="order in newOrders" :key="order.id" :order="order" :newOrderIds="newOrderIds"
                  @view-order="openDetailsModal" @assign-order="openAssignModal"
                  @complete-delivery="openCompleteModal" />
                <p v-if="newOrders.length === 0" class="text-center text-gray-500 dark:text-gray-400 py-4">Nenhum pedido
                  novo.</p>
              </div>
            </div>
            <div class="bg-sky-700/10 rounded-lg">
              <h3
                class="text-white rounded-t-md mb-4 border-b p-2 border-gray-300 dark:border-gray-700 bg-sky-700 bg-linear from-sky-800 via-sky-700 to-sky-500">
                Em preparo
                <span
                  class="ml-2 px-2 py-1 text-xs rounded-full bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200">{{
                    preparingOrders.length }}</span>
              </h3>
              <div class="space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
                <OrderCard v-for="order in preparingOrders" :key="order.id" :order="order" :newOrderIds="newOrderIds"
                  @view-order="openDetailsModal" @assign-order="openAssignModal"
                  @complete-delivery="openCompleteModal" />
                <p v-if="preparingOrders.length === 0" class="text-center text-gray-500 dark:text-gray-400 py-4">Nenhum
                  pedido em preparo.</p>
              </div>
            </div>
            <div class="bg-purple-700/10 rounded-lg">
              <h3
                class="bg-purple-700 bg-linear from-purple-800 via-purple-700 to-purple-500 p-2 mb-4 rounded-t-md text-white">
                A caminho
                <span
                  class="ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-purple-200 text-purple-800 dark:bg-purple-800 dark:text-purple-200">{{
                    onTheWayOrders.length }}</span>
              </h3>
              <div class="space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
                <OrderCard v-for="order in onTheWayOrders" :key="order.id" :order="order" :newOrderIds="newOrderIds"
                  @view-order="openDetailsModal" @assign-order="openAssignModal"
                  @complete-delivery="openCompleteModal" />
                <p v-if="onTheWayOrders.length === 0" class="text-center text-gray-500 dark:text-gray-400 py-4">Nenhum
                  pedido a caminho.</p>
              </div>
            </div>
          </div>
          <div class="lg:w-52 bg-gray-200 dark:bg-gray-900 p-4 rounded-lg flex-shrink-0">
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
            <OrderCard v-for="order in finishedOrders" :key="order.id" :order="order" :newOrderIds="newOrderIds"
              @view-order="openDetailsModal" @assign-order="openAssignModal" @complete-delivery="openCompleteModal" />
          </div>
        </div>
        <div v-else-if="!isLoading && orders.length > 0" class="mt-8 text-center text-gray-500 dark:text-gray-400 py-4">
          Nenhum pedido finalizado.
        </div>

        <div v-if="connectionError"
          class="bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded relative">
          <strong class="font-bold">Erro de conexão!</strong>
          <span class="block sm:inline"> {{ connectionError }}</span>
          <button @click="reconnect" class="ml-2 underline hover:no-underline">
            Tentar reconectar
          </button>
        </div>
      </div>
    </AdminLayout>

    <OrderDetailsModal :open="showDetails" :order="selectedOrder" :statusOptions="statusOptions"
      :isUpdatingStatus="isUpdatingStatus" @update:open="showDetails = $event" @update-status="handleUpdateStatus"
      @close="closeModals" />

    <AssignDeliveryModal :open="showAssignModal" :order="selectedOrder" :availableDeliveryMen="availableDeliveryMen"
      :assignLoading="assignLoading" :assignError="assignError" @update:open="showAssignModal = $event"
      @assign-confirmed="handleAssignConfirmed" @close="closeModals" />

    <CompleteDeliveryModal :open="showCompleteModal" :order="selectedOrder" :completeLoading="completeLoading"
      :completeError="completeError" @update:open="showCompleteModal = $event"
      @complete-confirmed="handleCompleteConfirmed" @close="closeModals" />

    <div v-if="successMessage"
      class="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg transition-all duration-300 ease-in-out transform"
      :class="{ 'translate-x-0 opacity-100': successMessage, 'translate-x-full opacity-0': !successMessage }">
      {{ successMessage }}
    </div>
  </div>
</template>

<script setup>
import api from "@/services/httpClient";
// Importe 'app' como um objeto diretamente do seu firebaseClient
import { app } from '@/firebase/firebaseClient';
import AdminLayout from "@/layouts/AdminLayout.vue";
// Importar os novos componentes (se você os moveu)
import OrderCard from '@/components/orders/OrderCard.vue';
import OrderDetailsModal from '@/components/orders/OrderDetailsModal.vue';
import AssignDeliveryModal from '@/components/orders/AssignDeliveryModal.vue';
import CompleteDeliveryModal from '@/components/orders/CompleteDeliveryModal.vue';

// Importar todas as funções de utilidade do formatters.js
import { formatText, getStatusBadgeClass, getTimestamp } from '@/utils/formatters';

import { ref, onMounted, onUnmounted, computed } from "vue";
import { getFirestore, collection, onSnapshot, doc, updateDoc, query, orderBy } from 'firebase/firestore';

// --- Estados Reativos Principais ---
const orders = ref([]);
const selectedOrder = ref(null);
const showDetails = ref(false); // Para o modal de detalhes do pedido
const isLoading = ref(true);
const isConnected = ref(false);
const connectionError = ref('');
const lastUpdate = ref('');
const isUpdatingStatus = ref(false);
const newOrderIds = ref(new Set()); // Para controlar quais pedidos são "novos" visualmente (badge)

// --- Estados para Gerenciamento de Entregadores ---
const availableDeliveryMen = ref([]); // Lista de entregadores disponíveis para o modal de atribuição
const deliveryMenMap = ref(new Map()); // Mapa para buscar nomes de entregadores por ID rapidamente
const showAssignModal = ref(false);
const showCompleteModal = ref(false);
const assignLoading = ref(false);
const assignError = ref(null);
const completeLoading = ref(false);
const completeError = ref(null);
const successMessage = ref(null);


// Instância do Firestore
// CORREÇÃO AQUI: Certifique-se de que 'app' está definido quando getFirestore é chamado.
// Isso geralmente significa que firebaseClient.js deve exportar a instância 'app'
// e ela deve ser importada aqui.
const db = getFirestore(app); // 'app' deve ser a instância inicializada do Firebase app
let unsubscribe = null;

const statusOptions = ["recebido", "em_preparo", "a_caminho", "entregue", "cancelado", "em processamento"];

// --- Computed Properties para Filtragem e Ordenação de Pedidos ---
const newOrders = computed(() => {
  return orders.value
    .filter(order => ['recebido', 'em processamento'].includes(order.status) && order.payment_status !== 'cancelled' && order.payment_status !== 'pending')
    .sort((a, b) => getTimestamp(b.created_at) - getTimestamp(a.created_at));
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

// --- Funções de Abertura/Fechamento de Modais ---

const openDetailsModal = (order) => {
  if (!order || !order.id) {
    console.warn("Tentativa de visualizar pedido nulo ou sem ID.");
    connectionError.value = "Erro: Pedido sem ID válido para visualização.";
    return;
  }
  selectedOrder.value = JSON.parse(JSON.stringify(order)); // Cópia para edição local
  showDetails.value = true;
  if (newOrderIds.value.has(order.id)) {
    newOrderIds.value.delete(order.id); // Remove o badge "novo" ao visualizar
  }
};

const openAssignModal = (order) => {
  selectedOrder.value = order; // Usa a referência direta do pedido para a atribuição
  showAssignModal.value = true;
};

const openCompleteModal = (order) => {
  selectedOrder.value = order; // Usa a referência direta do pedido
  showCompleteModal.value = true;
};

const closeModals = () => {
  selectedOrder.value = null;
  showDetails.value = false;
  showAssignModal.value = false;
  showCompleteModal.value = false;
  assignError.value = null;
  completeError.value = null;
  isUpdatingStatus.value = false;
  if (connectionError.value.includes('Erro ao atualizar pedido')) {
    connectionError.value = '';
  }
};

// --- Funções de Ação de Pedidos (chamadas pelos modais) ---

const handleUpdateStatus = async (orderId, newStatus) => {
  if (!orderId || !newStatus) {
    console.warn("Dados incompletos para atualizar status.");
    connectionError.value = "Erro: ID do pedido ou novo status ausente.";
    return;
  }
  isUpdatingStatus.value = true;
  connectionError.value = '';
  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      status: newStatus,
      updated_at: new Date()
    });

    try {
      await api.put(`/orders/${orderId}`, { status: newStatus });
    } catch (apiError) {
      console.warn("Erro ao atualizar via API (Firestore foi atualizado):", apiError);
    }

    showSuccessMessage(`Status do pedido ${orderId} atualizado para: ${formatText(newStatus)}`);
    closeModals();
  } catch (error) {
    console.error("Erro ao atualizar status do pedido:", error);
    connectionError.value = `Erro ao atualizar pedido: ${error.message}`;
  } finally {
    isUpdatingStatus.value = false;
  }
};

const handleAssignConfirmed = async (orderId, deliveryManId) => {
  if (!orderId || !deliveryManId) {
    assignError.value = 'Por favor, selecione um pedido e um entregador.';
    return;
  }
  assignLoading.value = true;
  assignError.value = null;
  try {
    await api.post(`/delivery-men/${deliveryManId}/assign-order`, { orderId });
    showSuccessMessage('Pedido atribuído com sucesso!');
    closeModals();
  } catch (err) {
    assignError.value = 'Falha ao atribuir pedido. ' + (err.response?.data?.error || err.message);
    console.error('Erro ao atribuir pedido:', err);
  } finally {
    assignLoading.value = false;
  }
};

const handleCompleteConfirmed = async (deliveryManId, orderId) => {
  if (!orderId || !deliveryManId) {
    completeError.value = 'Nenhum pedido ou entregador selecionado para finalizar.';
    return;
  }
  completeLoading.value = true;
  completeError.value = null;
  try {
    await api.post(`/delivery-men/${deliveryManId}/complete-delivery`, { orderId });
    showSuccessMessage('Entrega finalizada com sucesso!');
    closeModals();
  } catch (err) {
    completeError.value = 'Falha ao finalizar entrega. ' + (err.response?.data?.error || err.message);
    console.error('Erro ao finalizar entrega:', err);
  } finally {
    completeLoading.value = false;
  }
};

// --- Funções Auxiliares ---
const showSuccessMessage = (message) => {
  successMessage.value = message;
  setTimeout(() => {
    successMessage.value = null;
  }, 3000);
};

// Função para buscar todos os entregadores (para o mapa de nomes)
const fetchAllDeliveryMen = async () => {
  try {
    const response = await api.get('/delivery-men');
    deliveryMenMap.value.clear();
    response.data.forEach(dm => {
      deliveryMenMap.value.set(dm.id, dm.name);
    });
  } catch (err) {
    console.error('Erro ao buscar todos os entregadores para o mapa:', err);
  }
};

// Função para buscar apenas os entregadores disponíveis (para o dropdown)
const fetchAvailableDeliveryMen = async () => {
  try {
    const response = await api.get('/delivery-men?available=true');
    availableDeliveryMen.value = response.data;
  } catch (err) {
    console.error('Erro ao buscar entregadores disponíveis:', err);
  }
};


// --- Listener de Tempo Real do Firestore ---
function setupRealtimeListener() {
  try {
    const ordersQuery = query(
      collection(db, 'orders'),
      orderBy('created_at', 'desc')
    );

    unsubscribe = onSnapshot(
      ordersQuery,
      async (snapshot) => {
        const currentOrderIdsInView = new Set(orders.value.map(o => o.id));

        const updatedOrders = [];
        for (const change of snapshot.docChanges()) {
          let orderData = { id: change.doc.id, ...change.doc.data() };

          if (orderData.assigned_delivery_man_id && !orderData.assigned_delivery_man_name) {
            orderData.assigned_delivery_man_name = deliveryMenMap.value.get(orderData.assigned_delivery_man_id) || 'Carregando...';
            if (orderData.assigned_delivery_man_name === 'Carregando...') {
              try {
                const dmResponse = await api.get(`/delivery-men/${orderData.assigned_delivery_man_id}`);
                deliveryMenMap.value.set(orderData.assigned_delivery_man_id, dmResponse.data.name);
                orderData.assigned_delivery_man_name = dmResponse.data.name;
              } catch (dmError) {
                console.error(`Falha ao buscar nome do entregador ${orderData.assigned_delivery_man_id}:`, dmError);
                orderData.assigned_delivery_man_name = 'Entregador desconhecido';
              }
            }
          }

          if (change.type === 'added') {
            const isNewStatus = ['recebido', 'em processamento'].includes(orderData.status) && orderData.payment_status !== 'cancelled' && orderData.payment_status !== 'pending';
            if (!currentOrderIdsInView.has(orderData.id)) {
              if (isNewStatus) {
                newOrderIds.value.add(orderData.id);
                if ('Notification' in window && Notification.permission === 'granted') {
                  new Notification('Novo Pedido!', {
                    body: `Pedido #${orderData.id} de ${orderData.client}`,
                    icon: '/assets/image/old_nonna.png'
                  });
                }
              }
              updatedOrders.unshift(orderData);
            } else {
              const existingIndex = orders.value.findIndex(o => o.id === orderData.id);
              if (existingIndex !== -1) {
                orders.value[existingIndex] = orderData;
              }
            }
          } else if (change.type === 'modified') {
            const index = orders.value.findIndex(o => o.id === orderData.id);
            if (index !== -1) {
              orders.value[index] = orderData;
              const isNewStatus = ['recebido', 'em processamento'].includes(orderData.status) && orderData.payment_status !== 'cancelled' && orderData.payment_status !== 'pending';
              if (isNewStatus) {
                newOrderIds.value.add(orderData.id);
              } else {
                newOrderIds.value.delete(orderData.id);
              }
            }
          } else if (change.type === 'removed') {
            const index = orders.value.findIndex(o => o.id === orderData.id);
            if (index !== -1) {
              orders.value.splice(index, 1);
            }
            newOrderIds.value.delete(orderData.id);
          }
        }

        if (updatedOrders.length > 0) {
          orders.value = [...updatedOrders, ...orders.value.filter(o => !updatedOrders.some(uo => uo.id === o.id))];
          orders.value.sort((a, b) => getTimestamp(b.created_at) - getTimestamp(a.created_at));
        }

        isConnected.value = true;
        connectionError.value = '';
        lastUpdate.value = new Date().toLocaleTimeString();
        isLoading.value = false;

        await fetchAvailableDeliveryMen();
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

    orders.value = await Promise.all(orders.value.map(async order => {
      if (order.assigned_delivery_man_id) {
        let dmName = deliveryMenMap.value.get(order.assigned_delivery_man_id);
        if (!dmName) {
          try {
            const dmResponse = await api.get(`/delivery-men/${order.assigned_delivery_man_id}`);
            dmName = dmResponse.data.name;
            deliveryMenMap.value.set(order.assigned_delivery_man_id, dmName);
          } catch (dmError) {
            console.error(`Erro ao buscar nome do entregador ${order.assigned_delivery_man_id} no fallback API:`, dmError);
            dmName = 'Entregador desconhecido';
          }
        }
        order.assigned_delivery_man_name = dmName;
      }
      return order;
    }));

  } catch (error) {
    console.error("Erro ao carregar pedidos via API:", error);
  }
}

// --- Ciclo de Vida ---
onMounted(async () => {
  console.log("Iniciando conexão em tempo real com Firestore...");

  if ('Notification' in window && Notification.permission === 'default') {
    await Notification.requestPermission();
  }

  await fetchAllDeliveryMen();
  await fetchAvailableDeliveryMen();

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