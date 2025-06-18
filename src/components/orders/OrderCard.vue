<template>
  <div :class="[
    'p-2 rounded-md border text-gray-800 dark:text-white text-sm flex items-end justify-between shadow-md cursor-pointer hover:shadow-lg transition-all duration-300',
    statusClass
  ]" @click="$emit('view-order', order)">
    <div class="flex-shrink-0 space-y-1 text-xs">
      <p class="font-semibold">Pedido: <span class="font-light">{{ order.id }}</span></p>
      <p><i class="fa-solid fa-user"></i> <span class="font-light">{{ order.client }}</span></p>
      <div class="flex items-center justify-between space-x-4">
        <div>
          <i class="fa-solid fa-money-bill-wave mr-2"></i>
          <span class="font-light">
            {{ formatPrice(order.total) }}
          </span>
        </div>
        <div>Pagamento: {{ getStatusPayment(order.payment_status) }}</div>
      </div>
      <p class="font-semibold hidden">Status:
        <span class="font-light" :class="getStatusBadgeClass(order.status)">
          {{ formatText(order.status) }}
        </span>
      </p>
      <p class="font-semibold"><i class="fa-solid fa-calendar-days"></i> <span class="font-light">{{
        formatDate(order.created_at) }}</span></p>

      <!-- Novo: Exibe o entregador designado -->
      <p v-if="order.assigned_delivery_man_name" class="font-semibold">Entregador:
        <span class="font-light">{{ order.assigned_delivery_man_name }}</span>
      </p>
      <p v-else class="font-semibold text-orange-500">
        <span class="font-light">Sem entregador</span>
      </p>
    </div>

    <!-- Botões de Ação para Gerenciamento de Entrega -->
    <div class="flex items-center justify-center space-x-2 flex-col">
      <button v-if="['pending', 'recebido', 'em processamento'].includes(order.delivery_status || order.status)"
        @click.stop="$emit('assign-order', order)" :disabled="order.assigned_delivery_man_id !== null"
        class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full text-xs transition duration-300 ease-in-out focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed mb-1">
        Atribuir
      </button>
      <button v-if="order.assigned_delivery_man_id && order.delivery_status !== 'delivered'"
        @click.stop="$emit('complete-delivery', order)" :disabled="order.delivery_status === 'delivered'"
        class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full text-xs transition duration-300 ease-in-out focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed">
        Entregue
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { formatPrice, formatText, formatDate, getStatusPayment, getStatusBadgeClass } from '@/utils/formatters';

const props = defineProps({
  order: {
    type: Object,
    required: true
  },
  newOrderIds: {
    type: Set,
    default: () => new Set()
  }
});

const emit = defineEmits(['view-order', 'assign-order', 'complete-delivery']);

const statusClass = computed(() => {
  if (props.newOrderIds.has(props.order.id)) {
    return 'bg-green-50 dark:bg-green-900/20 border border-green-200/40 dark:border-green-700/40';
  }
  // Cores de fundo diferentes para outros status que não sejam "novo"
  // Você pode ajustar isso para refletir o status de entrega (delivery_status)
  switch (props.order.delivery_status || props.order.status) { // Prioriza delivery_status
    case 'em_preparo':
      return 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200/40 dark:border-blue-700/40';
    case 'a_caminho':
      return 'bg-purple-50 dark:bg-purple-900/20 border border-purple-200/40 dark:border-purple-700/40';
    case 'assigned':
      return 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200/40 dark:border-yellow-700/40';
    default:
      return 'bg-gray-100 dark:bg-gray-800 border border-gray-200/40 dark:border-gray-700/40';
  }
});
</script>
