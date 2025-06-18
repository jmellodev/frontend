<template>
  <BaseModal :open="open" @update:open="$emit('update:open', $event)">
    <div class="text-gray-900 dark:text-white relative p-4">
      <button @click="$emit('close')"
        class="absolute -top-3 -right-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-xl">
        &times;
      </button>
      <h3 class="md:text-2xl font-bold mb-4 border-b border-gray-300 dark:border-gray-900 pb-2">
        Detalhes do Pedido <span class="text-orange-500 italic font-normal">#{{ order?.id }}</span>
      </h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 text-gray-700 dark:text-gray-300 text-md">
        <div><span class="font-semibold text-gray-600 dark:text-gray-400">Cliente:</span> {{ order?.client }}</div>
        <div><span class="font-semibold text-gray-600 dark:text-gray-400">Telefone:</span> {{ order?.telefone ||
          order?.phone }}</div>
        <div><span class="font-semibold text-gray-600 dark:text-gray-400">Total:</span> {{ formatPrice(order?.total) }}
        </div>
        <div><span class="font-semibold text-gray-600 dark:text-gray-400">Subtotal:</span> {{
          formatPrice(order?.subtotal) }}</div>
        <div><span class="font-semibold text-gray-600 dark:text-gray-400">Taxa de Entrega:</span> {{
          formatPrice(order?.taxaEntrega || order?.fee) }}</div>
        <div><span class="font-semibold text-gray-600 dark:text-gray-400">Tipo de Entrega:</span> {{ order?.tipoEntrega
          || order?.delivery_type }}</div>
        <div><span class="font-semibold text-gray-600 dark:text-gray-400">Método de Pagamento:</span> {{
          displayPaymentType(order?.metodoPagamento || order?.payment_method) }}</div>
        <div><span class="font-semibold text-gray-600 dark:text-gray-400">Status do Pagamento:</span> {{
          getStatusPayment(order?.payment_status) }}</div>
        <div><span class="font-semibold text-gray-600 dark:text-gray-400">Data do Pedido:</span> {{
          formatDate(order?.created_at) }}</div>

        <div><span class="font-semibold text-gray-600 dark:text-gray-400">Entregador:</span>
          {{ order?.assigned_delivery_man_name || (order?.assigned_delivery_man_id ?
            order?.assigned_delivery_man_id.substring(0, 8) + '...' : 'Não atribuído') }}
        </div>
        <div><span class="font-semibold text-gray-600 dark:text-gray-400">Status Entrega:</span>
          <span :class="getStatusBadgeClass(order?.delivery_status)">
            {{ formatText(order?.delivery_status || 'pendente') }}
          </span>
        </div>
      </div>

      <div class="col-span-full mt-4">
        <span class="font-semibold text-gray-600 dark:text-gray-400">Endereço:</span>
        <div v-if="order?.address && order.address.length > 0">
          <p v-for="(addr, idx) in order.address" :key="idx">
            {{ addr.street }}, {{ addr.neighborhood }}
            <span v-if="addr.reference"> (Ref: {{ addr.reference }})</span>
          </p>
        </div>
        <div v-else>Nenhum endereço fornecido.</div>
      </div>

      <div class="col-span-full mt-4">
        <span class="font-semibold text-gray-600 dark:text-gray-400">Status do Pedido:</span>
        <select v-model="orderStatusLocal"
          class="p-2 bg-gray-200 dark:bg-gray-700 border border-gray-400 dark:border-gray-600 rounded-md text-gray-800 dark:text-white focus:ring-blue-500 focus:border-blue-500 ml-2 mt-2">
          <option v-for="status in statusOptions" :key="status" :value="status">
            {{ formatText(status) }}
          </option>
        </select>
      </div>

      <div v-if="order?.itens && order.itens.length">
        <h4
          class="font-semibold mt-6 mb-2 text-gray-700 dark:text-gray-300 border-t border-gray-300 dark:border-gray-900 pt-4">
          Itens do Pedido:
        </h4>
        <ul class="text-sm space-y-1">
          <li v-for="(item, idx) in order.itens" :key="idx" class="text-gray-700 dark:text-gray-300">
            <p class="font-semibold">{{ item.item?.replaceAll('r$', 'R$') }}</p>
            <p v-if="item.adicionais" class="text-xs text-gray-600 dark:text-gray-400">
              <span class="italic">Adicionais:</span> {{ item.adicionais?.replaceAll('r$', 'R$') }}
            </p>
          </li>
        </ul>
      </div>

      <div class="mt-6 flex justify-end space-x-4 border-t border-gray-300 dark:border-gray-900 pt-4">
        <button @click="$emit('update-status', order?.id, orderStatusLocal)"
          :disabled="isUpdatingStatus || !order?.id || !orderStatusLocal"
          class="px-5 py-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed text-white text-md rounded-md transition-colors duration-200">
          {{ isUpdatingStatus ? 'Salvando...' : 'Salvar' }}
        </button>
        <button @click="$emit('close')"
          class="px-5 py-1 bg-red-600 hover:bg-red-800 text-white text-md rounded-md transition-colors duration-200">
          Cancelar
        </button>
      </div>
    </div>
  </BaseModal>
</template>

<script setup>
import { ref, watch } from 'vue';
import BaseModal from '@/components/modals/BaseModal.vue';
import { formatPrice, formatText, formatDate, displayPaymentType, getStatusPayment, getStatusBadgeClass } from '@/utils/formatters';

const props = defineProps({
  open: {
    type: Boolean,
    required: true
  },
  order: {
    type: Object,
    default: null
  },
  statusOptions: {
    type: Array,
    default: () => []
  },
  isUpdatingStatus: { // Passado como prop do pai
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:open', 'update-status', 'close']);

// Usar uma variável reativa local para o v-model do select
const orderStatusLocal = ref('');

// Sincroniza o status local com a prop quando o modal é aberto ou o pedido muda
watch(() => props.order?.status, (newStatus) => {
  if (newStatus) {
    orderStatusLocal.value = newStatus;
  }
}, { immediate: true });
</script>
