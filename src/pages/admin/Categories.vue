<template>
  <AdminLayout>
    <div class="space-y-6">
      <h2 class="text-3xl font-bold text-white">Pedidos</h2>
      <p class="text-gray-400">Gerencie todos os pedidos recebidos.</p>

      <div class="overflow-auto mt-4">
        <table class="min-w-full table-auto bg-gray-800 rounded-lg">
          <thead>
            <tr class="bg-gray-700">
              <th class="px-4 py-2 text-left text-gray-300">#</th>
              <th class="px-4 py-2 text-left text-gray-300">Cliente</th>
              <th class="px-4 py-2 text-left text-gray-300">Total</th>
              <th class="px-4 py-2 text-left text-gray-300">Status</th>
              <th class="px-4 py-2 text-left text-gray-300">Data</th>
              <th class="px-4 py-2 text-left text-gray-300">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order.id" class="border-b border-gray-700">
              <td class="px-4 py-2 text-gray-200">{{ order.id }}</td>
              <td class="px-4 py-2 text-gray-200">{{ order.client }}</td>
              <td class="px-4 py-2 text-gray-200">R$ {{ order.total }}</td>
              <td class="px-4 py-2 text-gray-200">{{ order.status }}</td>
              <td class="px-4 py-2 text-gray-200">{{ formatDate(order.timestamp) }}</td>
              <td class="px-4 py-2 text-gray-200">
                <button @click="view(order.id)" class="px-3 py-1 bg-blue-600 rounded">
                  Ver
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de Detalhes do Pedido -->
    <BaseModal v-if="showDetails" @close="showDetails = false">
      <div v-if="selectedOrder" class="p-4 space-y-4 text-white">
        <h3 class="text-xl font-bold">Detalhes do Pedido</h3>
        <div><span class="font-semibold">Cliente:</span> {{ selectedOrder.client }}</div>
        <div><span class="font-semibold">Total:</span> R$ {{ selectedOrder.total }}</div>
        <div>
          <span class="font-semibold">Status:</span>
          <select v-model="selectedOrder.status" class="p-2 bg-gray-700 rounded">
            <option v-for="status in statusOptions" :key="status" :value="status">
              {{ status }}
            </option>
          </select>
        </div>
        <div class="mt-4 flex justify-end space-x-4">
          <button @click="updateStatus" class="px-4 py-2 bg-green-600 rounded">
            Salvar
          </button>
          <button @click="closeModal" class="px-4 py-2 bg-gray-600 rounded">
            Cancelar
          </button>
        </div>
      </div>
    </BaseModal>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "@/services/httpClient";
import AdminLayout from "@/layouts/AdminLayout.vue";
import BaseModal from "@/components/BaseModal.vue";

const orders = ref([]);
const showDetails = ref(false); // Controle para mostrar o modal
const selectedOrder = ref(null); // Pedido selecionado para exibir no modal
const statusOptions = ["Pendente", "Em preparo", "Finalizado", "Cancelado"];

function formatDate(ts) {
  if (!ts) return "";
  return new Date(ts.seconds * 1000).toLocaleString();
}

function view(id) {
  const order = orders.value.find((o) => o.id === id);
  if (order) {
    selectedOrder.value = { ...order }; // Define o pedido selecionado
    showDetails.value = true; // Abre o modal
  }
}

function closeModal() {
  selectedOrder.value = null; // Limpa o pedido selecionado
  showDetails.value = false; // Fecha o modal
}

async function updateStatus() {
  if (selectedOrder.value) {
    try {
      await api.put(`/orders/${selectedOrder.value.id}`, selectedOrder.value); // Atualiza o pedido na API
      // Atualiza a lista de pedidos
      const res = await api.get("/orders");
      orders.value = res.data;
      closeModal(); // Fecha o modal após a atualização
    } catch (err) {
      console.error("Erro ao atualizar status", err);
    }
  }
}

onMounted(async () => {
  try {
    const res = await api.get("/orders");
    orders.value = res.data;
  } catch (err) {
    console.error("Erro ao carregar pedidos", err);
  }
});
</script>
