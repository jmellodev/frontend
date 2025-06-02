<template>
  <div v-if="toast.show" :class="[
    'fixed bottom-4 right-4 p-4 rounded-lg shadow-lg text-white max-w-xs z-[1000]',
    toast.type === 'success' ? 'bg-green-500' :
      toast.type === 'error' ? 'bg-red-500' :
        'bg-blue-500'
  ]" role="alert">
    <div class="flex items-center">
      <div class="mr-2">
        <i v-if="toast.type === 'success'" class="fas fa-check-circle"></i>
        <i v-else-if="toast.type === 'error'" class="fas fa-times-circle"></i>
        <i v-else class="fas fa-info-circle"></i>
      </div>
      <div>
        <p class="font-semibold">{{ toast.title }}</p>
        <p class="text-sm">{{ toast.message }}</p>
      </div>
      <button @click="toastStore.hideToast()" class="ml-auto text-white opacity-75 hover:opacity-100">
        &times;
      </button>
    </div>
  </div>
</template>

<script setup>
import { useToastStore } from '@/stores/toast';
import { computed } from 'vue';

const toastStore = useToastStore();
const toast = computed(() => toastStore.toast);
</script>

<style scoped>
/* Transições para o toast (opcional) */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
