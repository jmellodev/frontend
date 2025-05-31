<template>
  <BaseModal v-model:open="internalOpen">
    <div class="bg-gray-900 p-6 rounded-lg w-full max-w-xl max-h-[95vh] overflow-y-auto text-white relative">
      <button @click="closeModal" class="absolute top-3 right-3 text-gray-400 hover:text-white text-xl">
        &times;
      </button>
      <h3 class="text-2xl font-bold mb-4 border-b border-gray-700 pb-2">Escolher Ícone</h3>

      <div class="mb-4">
        <input type="text" v-model="searchQuery" placeholder="Buscar ícone (ex: pizza, star, user)"
          class="w-full p-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div
        class="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-4 max-h-[calc(95vh-160px)] overflow-y-auto pr-2">
        <div v-for="icon in filteredIcons" :key="icon" @click="selectIcon(icon)"
          class="flex flex-col items-center justify-center p-3 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors duration-200 border border-gray-700">
          <i :class="icon" class="text-3xl mb-2 text-blue-400"></i>
          <span class="text-xs text-center break-words">{{ icon.replace('fas fa-', '').replace('fab fa-', '') }}</span>
        </div>
        <div v-if="filteredIcons.length === 0" class="col-span-full text-center text-gray-400 py-8">
          Nenhum ícone encontrado.
        </div>
      </div>

      <div class="mt-6 flex justify-end border-t border-gray-700 pt-4">
        <button @click="closeModal"
          class="px-5 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-md transition-colors duration-200">
          Fechar
        </button>
      </div>
    </div>
  </BaseModal>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import BaseModal from '@/components/modals/BaseModal.vue';

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:open', 'icon-selected']);

const internalOpen = ref(props.open); // Usado para v-model interno do BaseModal

// Observa a prop 'open' e atualiza 'internalOpen'
watch(() => props.open, (newVal) => {
  internalOpen.value = newVal;
});

// Lista de ícones Font Awesome (apenas uma amostra)
// Em uma aplicação real, você pode carregar uma lista mais completa de um JSON ou API
const allIcons = ref([
  'fas fa-pizza-slice', 'fas fa-hamburger', 'fas fa-ice-cream', 'fas fa-mug-hot',
  'fas fa-coffee', 'fas fa-beer', 'fas fa-apple-alt', 'fas fa-carrot',
  'fas fa-cheese', 'fas fa-bread-slice', 'fas fa-cookie-bite', 'fas fa-egg',
  'fas fa-fish', 'fas fa-hotdog', 'fas fa-bacon', 'fas fa-drumstick-bite',
  'fas fa-utensils', 'fas fa-shopping-basket', 'fas fa-star', 'fas fa-heart',
  'fas fa-user', 'fas fa-cog', 'fas fa-home', 'fas fa-info-circle',
  'fas fa-question-circle', 'fas fa-exclamation-triangle', 'fas fa-check-circle',
  'fas fa-times-circle', 'fas fa-bell', 'fas fa-envelope', 'fas fa-map-marker-alt',
  'fas fa-phone', 'fas fa-mobile-alt', 'fas fa-credit-card', 'fas fa-money-bill-alt',
  'fas fa-truck', 'fas fa-motorcycle', 'fas fa-car', 'fas fa-store',
  'fas fa-calendar-alt', 'fas fa-clock', 'fas fa-fire', 'fas fa-leaf',
  'fas fa-cloud', 'fas fa-sun', 'fas fa-moon', 'fas fa-umbrella',
  'fas fa-gift', 'fas fa-percent', 'fas fa-tag', 'fas fa-qrcode',
  'fas fa-wifi', 'fas fa-lock', 'fas fa-unlock', 'fas fa-plus', 'fas fa-minus',
  'fas fa-edit', 'fas fa-trash', 'fas fa-search', 'fas fa-filter',
  'fas fa-sort', 'fas fa-chart-line', 'fas fa-receipt', 'fas fa-box-open',
  'fas fa-tags', 'fas fa-tools', 'fab fa-whatsapp', 'fas fa-chart-bar'
]);

const searchQuery = ref('');

const filteredIcons = computed(() => {
  if (!searchQuery.value) {
    return allIcons.value;
  }
  const query = searchQuery.value.toLowerCase();
  return allIcons.value.filter(icon => icon.toLowerCase().includes(query));
});

function selectIcon(iconClass) {
  emit('icon-selected', iconClass);
  closeModal();
}

function closeModal() {
  emit('update:open', false);
}
</script>

<style scoped>
/* Nenhum estilo específico necessário além do Tailwind */
</style>
