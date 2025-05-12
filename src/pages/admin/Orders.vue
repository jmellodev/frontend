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
              <td class="px-4 py-2 text-gray-200">{{ formatDate(order.created_at) }}</td>
              <td class="px-4 py-2 text-gray-200">
                <button @click="view(order)" class="px-3 py-1 bg-blue-600 rounded">
                  Ver
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <BaseModal v-model:open="showDetails">
        <div class="p-4 space-y-4 text-white">
          <h3 class="text-xl font-bold mb-2">
            Detalhes do Pedido #{{ selectedOrder?.id }}
          </h3>
          <p><strong>Cliente:</strong> {{ selectedOrder?.client }}</p>
          <p><strong>Status:</strong> {{ selectedOrder?.status }}</p>
          <p><strong>Total:</strong> R$ {{ selectedOrder?.total }}</p>
          <p><strong>Data:</strong> {{ formatDate(selectedOrder?.created_at) }}</p>
          <div v-if="selectedOrder?.items?.length">
            <h4 class="font-semibold mt-4 mb-2">Itens:</h4>
            <ul class="list-disc list-inside text-sm">
              <li v-for="(item, idx) in selectedOrder.items" :key="idx">
                {{ item.quantity }}x {{ item.name }} - R$ {{ item.price }}
              </li>
            </ul>
          </div>
        </div>
      </BaseModal>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import AdminLayout from "@/layouts/AdminLayout.vue";
import BaseModal from "@/components/modals/BaseModal.vue";

const orders = ref([]);
const selectedOrder = ref(null);
const showDetails = ref(false);

function formatDate(ts) {
  if (!ts) return "";
  return new Date(ts.seconds * 1000).toLocaleString();
}

function view(order) {
  selectedOrder.value = order;
  showDetails.value = true;
}

onMounted(async () => {
  try {
    const res = await axios.get(
      "https://lemming-crucial-smoothly.ngrok-free.app/api/orders",
      {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      }
    );
    orders.value = res.data;
  } catch (err) {
    console.error("Erro ao carregar pedidos", err);
  }
});
</script>
