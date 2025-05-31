<template>
  <AdminLayout>
    <div class="space-y-6 p-4 md:p-8 bg-gray-900 rounded-lg shadow-xl">
      <h2 class="text-3xl font-bold text-white">Pedidos</h2>
      <p class="text-gray-400">Gerencie todos os pedidos recebidos.</p>

      <div v-if="isLoading" class="text-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-400 mx-auto"></div>
        <p class="text-gray-400 mt-4">Carregando pedidos...</p>
      </div>

      <div v-else-if="orders.length === 0" class="text-center py-8">
        <p class="text-gray-400 text-lg">Nenhum pedido encontrado.</p>
      </div>

      <div v-else class="overflow-x-auto mt-4 rounded-lg">
        <table class="min-w-full table-auto bg-gray-800">
          <thead>
            <tr class="bg-gray-700 text-gray-300 uppercase text-sm leading-normal">
              <th class="py-3 px-6 text-left">#</th>
              <th class="py-3 px-6 text-left">Cliente</th>
              <th class="py-3 px-6 text-left">Total</th>
              <th class="py-3 px-6 text-left">Status</th>
              <th class="py-3 px-6 text-left">Data</th>
              <th class="py-3 px-6 text-left">Ações</th>
            </tr>
          </thead>
          <tbody class="text-gray-200 text-sm font-light">
            <tr v-for="order in orders" :key="order.id" class="border-b border-gray-700 hover:bg-gray-700">
              <td class="py-3 px-6 text-left whitespace-nowrap">{{ order.id }}</td>
              <td class="py-3 px-6 text-left">{{ order.client }}</td>
              <td class="py-3 px-6 text-left">{{ $formatPrice(order.total) }}</td>
              <td class="py-3 px-6 text-left">
                <span :class="getStatusBadgeClass(order.status)">
                  {{ order.status }}
                </span>
              </td>
              <td class="py-3 px-6 text-left">{{ formatDate(order.created_at) }}</td>
              <td class="py-3 px-6 text-left">
                <button @click="view(order)"
                  class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200">
                  Ver
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <BaseModal v-if="selectedOrder" v-model:open="showDetails">
      <button @click="closeModal" class="absolute top-3 right-3 text-gray-400 hover:text-white text-xl">
        &times;
      </button>
      <h3 class="text-2xl font-bold mb-4 border-b border-gray-700 pb-2">
        Detalhes do Pedido #{{ selectedOrder.id }}
      </h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
        <div><span class="font-semibold text-gray-400">Cliente:</span> {{ selectedOrder.client }}</div>
        <div><span class="font-semibold text-gray-400">Telefone:</span> {{ selectedOrder.telefone }}</div>
        <div><span class="font-semibold text-gray-400">Total:</span> {{ $formatPrice(selectedOrder.total) }}</div>
        <div><span class="font-semibold text-gray-400">Subtotal:</span> {{ $formatPrice(selectedOrder.subtotal) }}
        </div>
        <div><span class="font-semibold text-gray-400">Taxa de Entrega:</span> {{
          $formatPrice(selectedOrder.taxaEntrega) }}</div>
        <div><span class="font-semibold text-gray-400">Tipo de Entrega:</span> {{ selectedOrder.tipoEntrega }}</div>
        <div><span class="font-semibold text-gray-400">Método de Pagamento:</span> {{ selectedOrder.metodoPagamento }}
        </div>
        <div><span class="font-semibold text-gray-400">Status do Pagamento:</span> {{ selectedOrder.payment_status }}
        </div>
        <div><span class="font-semibold text-gray-400">Data do Pedido:</span> {{ formatDate(selectedOrder.created_at)
        }}</div>

        <div class="col-span-full">
          <span class="font-semibold text-gray-400">Endereço:</span>
          <div v-if="selectedOrder.address && selectedOrder.address.length > 0">
            <p v-for="(addr, idx) in selectedOrder.address" :key="idx" class="ml-4">
              {{ addr.street }}, {{ addr.neighborhood }}
              <span v-if="addr.reference"> (Ref: {{ addr.reference }})</span>
            </p>
          </div>
          <div v-else>Nenhum endereço fornecido.</div>
        </div>

        <div class="col-span-full">
          <span class="font-semibold text-gray-400">Status do Pedido:</span>
          <select v-model="selectedOrder.status"
            class="p-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500 ml-2 mt-2">
            <option v-for="status in statusOptions" :key="status" :value="status">
              {{ status }}
            </option>
          </select>
        </div>
      </div>

      <div v-if="selectedOrder.itens && selectedOrder.itens.length">
        <h4 class="font-semibold mt-6 mb-2 text-gray-300 border-t border-gray-700 pt-4">Itens do Pedido:</h4>
        <ul class="italic text-sm space-y-2">
          <li v-for="(item, idx) in selectedOrder.itens" :key="idx" class="text-gray-300">
            <p class="font-semibold">{{ item.item }}</p>
            <p v-if="item.adicionais" class="text-xs text-gray-400">Adicionais: {{ item.adicionais }}</p>
          </li>
        </ul>
      </div>

      <div class="mt-6 flex justify-end space-x-4 border-t border-gray-700 pt-4">
        <button @click="updateStatus"
          class="px-5 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md transition-colors duration-200">
          Salvar Status
        </button>
        <button @click="closeModal"
          class="px-5 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-md transition-colors duration-200">
          Cancelar
        </button>
      </div>
    </BaseModal>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import AdminLayout from "@/layouts/AdminLayout.vue";
import BaseModal from "@/components/modals/BaseModal.vue";
import api from "@/services/httpClient";

const orders = ref([]);
const selectedOrder = ref(null);
const showDetails = ref(false);
const isLoading = ref(true);
const statusOptions = ["Pendente", "Em preparo", "Finalizado", "Entregue", "Cancelado"];

// Função para formatar o timestamp do Firestore
function formatDate(ts) {
  // CORREÇÃO AQUI: Acessa ts._seconds em vez de ts.seconds
  if (!ts || typeof ts._seconds === 'undefined') return "";
  return new Date(ts._seconds * 1000).toLocaleString();
}

// Classe dinâmica para o badge de status
const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'Pendente':
      return 'bg-yellow-500 text-yellow-900 px-2 py-1 rounded-full text-xs font-semibold';
    case 'Em preparo':
      return 'bg-blue-500 text-blue-900 px-2 py-1 rounded-full text-xs font-semibold';
    case 'Finalizado':
    case 'Entregue': // Ambos podem ter a mesma cor de sucesso
      return 'bg-green-500 text-green-900 px-2 py-1 rounded-full text-xs font-semibold';
    case 'Cancelado':
      return 'bg-red-500 text-red-900 px-2 py-1 rounded-full text-xs font-semibold';
    default:
      return 'bg-gray-500 text-gray-900 px-2 py-1 rounded-full text-xs font-semibold';
  }
};

function view(order) {
  // Cria uma cópia profunda do objeto do pedido para evitar mutações diretas
  selectedOrder.value = JSON.parse(JSON.stringify(order));
  showDetails.value = true;
}

function closeModal() {
  selectedOrder.value = null;
  showDetails.value = false;
}

async function updateStatus() {
  if (selectedOrder.value && selectedOrder.value.id) {
    try {
      // Envia apenas o ID e o novo status para a API
      await api.put(`/orders/${selectedOrder.value.id}`, {
        status: selectedOrder.value.status,
      });

      // Atualiza o status do pedido na lista localmente
      const index = orders.value.findIndex((o) => o.id === selectedOrder.value.id);
      if (index !== -1) {
        orders.value[index].status = selectedOrder.value.status;
      }
      closeModal();
      console.log(`Status do pedido ${selectedOrder.value.id} atualizado para: ${selectedOrder.value.status}`);
      // TODO: Adicionar feedback visual de sucesso (ex: toast)
    } catch (err) {
      console.error("Erro ao atualizar status do pedido:", err.response?.data || err.message);
      // TODO: Adicionar feedback visual de erro (ex: toast)
    }
  }
}

onMounted(async () => {
  try {
    isLoading.value = true;
    const res = await api.get(`/orders`);
    orders.value = Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    console.error("Erro ao carregar pedidos:", err.response?.data || err.message);
    // TODO: Adicionar feedback visual de erro (ex: toast)
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
/* Estilos específicos para este componente, se necessário */
</style>
