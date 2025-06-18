<template>
  <BaseModal :open="open" @update:open="$emit('update:open', $event)">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">Atribuir Entregador ao Pedido {{ order?.id }}</h2>
      <div v-if="availableDeliveryMen.length">
        <label for="deliveryManSelect" class="block text-gray-700 text-sm font-bold mb-2">
          Selecione um Entregador Disponível:
        </label>
        <select id="deliveryManSelect" v-model="selectedDeliveryManIdLocal"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
          <option value="">-- Selecione --</option>
          <option v-for="dm in availableDeliveryMen" :key="dm.id" :value="dm.id">
            {{ dm.name }} ({{ dm.vehicle_type ? formatText(dm.vehicle_type) : 'N/A' }})
          </option>
        </select>
      </div>
      <div v-else class="text-red-600 text-center py-4">
        Nenhum entregador disponível no momento.
      </div>
      <div class="flex justify-end mt-6 space-x-3">
        <button @click="$emit('close')"
          class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out">
          Cancelar
        </button>
        <button @click="$emit('assign-confirmed', order.id, selectedDeliveryManIdLocal)"
          :disabled="!selectedDeliveryManIdLocal || assignLoading"
          class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed">
          {{ assignLoading ? 'Atribuindo...' : 'Atribuir Pedido' }}
        </button>
      </div>
      <div v-if="assignError" class="text-red-500 text-sm mt-4">{{ assignError }}</div>
    </div>
  </BaseModal>
</template>

<script setup>
import { ref, watch } from 'vue';
import BaseModal from '@/components/modals/BaseModal.vue';
import { formatText } from '@/utils/formatters';

const props = defineProps({
  open: {
    type: Boolean,
    required: true
  },
  order: {
    type: Object,
    default: null
  },
  availableDeliveryMen: {
    type: Array,
    default: () => []
  },
  assignLoading: {
    type: Boolean,
    default: false
  },
  assignError: {
    type: String,
    default: null
  }
});

const emit = defineEmits(['update:open', 'assign-confirmed', 'close']);

const selectedDeliveryManIdLocal = ref('');

// Reseta a seleção quando o modal é aberto
watch(() => props.open, (isOpen) => {
  if (isOpen) {
    selectedDeliveryManIdLocal.value = '';
  }
});
</script>
