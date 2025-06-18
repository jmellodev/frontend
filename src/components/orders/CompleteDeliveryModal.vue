<template>
  <BaseModal :open="open" @update:open="$emit('update:open', $event)">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-sm p-6 text-center">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">Confirmar Entrega</h2>
      <p class="text-gray-700 mb-6">Tem certeza que deseja marcar o pedido <span class="font-semibold">{{ order?.id
          }}</span> como entregue?</p>
      <div class="flex justify-center space-x-3">
        <button @click="$emit('close')"
          class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out">
          Cancelar
        </button>
        <button @click="$emit('complete-confirmed', order?.assigned_delivery_man_id, order?.id)"
          :disabled="completeLoading"
          class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed">
          {{ completeLoading ? 'Finalizando...' : 'Confirmar Entrega' }}
        </button>
      </div>
      <div v-if="completeError" class="text-red-500 text-sm mt-4">{{ completeError }}</div>
    </div>
  </BaseModal>
</template>

<script setup>
import BaseModal from '@/components/modals/BaseModal.vue';

const props = defineProps({
  open: {
    type: Boolean,
    required: true
  },
  order: {
    type: Object,
    default: null
  },
  completeLoading: {
    type: Boolean,
    default: false
  },
  completeError: {
    type: String,
    default: null
  }
});

const emit = defineEmits(['update:open', 'complete-confirmed', 'close']);
</script>
