<template>
  <BaseModal v-model:open="internalOpen">
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
  'fa-duotone fa-solid fa-pizza-slice', 'fa-duotone fa-solid fa-hamburger', 'fa-duotone fa-solid fa-ice-cream', 'fa-duotone fa-solid fa-mug-hot',
  'fa-duotone fa-solid fa-coffee', 'fa-duotone fa-solid fa-beer', 'fa-duotone fa-solid fa-apple-alt', 'fa-duotone fa-solid fa-carrot',
  'fa-duotone fa-solid fa-cheese', 'fa-duotone fa-solid fa-bread-slice', 'fa-duotone fa-solid fa-cookie-bite', 'fa-duotone fa-solid fa-egg',
  'fa-duotone fa-solid fa-fish', 'fa-duotone fa-solid fa-hotdog', 'fa-duotone fa-solid fa-bacon', 'fa-duotone fa-solid fa-drumstick-bite',
  'fa-duotone fa-solid fa-utensils', 'fa-duotone fa-solid fa-shopping-basket', 'fa-duotone fa-solid fa-star', 'fa-duotone fa-solid fa-heart',
  'fa-duotone fa-solid fa-user', 'fa-duotone fa-solid fa-cog', 'fa-duotone fa-solid fa-home', 'fa-duotone fa-solid fa-info-circle',
  'fa-duotone fa-solid fa-question-circle', 'fa-duotone fa-solid fa-exclamation-triangle', 'fa-duotone fa-solid fa-check-circle',
  'fa-duotone fa-solid fa-times-circle', 'fa-duotone fa-solid fa-bell', 'fa-duotone fa-solid fa-envelope', 'fa-duotone fa-solid fa-map-marker-alt',
  'fa-duotone fa-solid fa-phone', 'fa-duotone fa-solid fa-mobile-alt', 'fa-duotone fa-solid fa-credit-card', 'fa-duotone fa-solid fa-money-bill-alt',
  'fa-duotone fa-solid fa-truck', 'fa-duotone fa-solid fa-motorcycle', 'fa-duotone fa-solid fa-car', 'fa-duotone fa-solid fa-store',
  'fa-duotone fa-solid fa-calendar-alt', 'fa-duotone fa-solid fa-clock', 'fa-duotone fa-solid fa-fire', 'fa-duotone fa-solid fa-leaf',
  'fa-duotone fa-solid fa-cloud', 'fa-duotone fa-solid fa-sun', 'fa-duotone fa-solid fa-moon', 'fa-duotone fa-solid fa-umbrella',
  'fa-duotone fa-solid fa-gift', 'fa-duotone fa-solid fa-percent', 'fa-duotone fa-solid fa-tag', 'fa-duotone fa-solid fa-qrcode',
  'fa-duotone fa-solid fa-wifi', 'fa-duotone fa-solid fa-lock', 'fa-duotone fa-solid fa-unlock', 'fa-duotone fa-solid fa-plus', 'fa-duotone fa-solid fa-minus',
  'fa-duotone fa-solid fa-edit', 'fa-duotone fa-solid fa-trash', 'fa-duotone fa-solid fa-search', 'fa-duotone fa-solid fa-filter',
  'fa-duotone fa-solid fa-sort', 'fa-duotone fa-solid fa-chart-line', 'fa-duotone fa-solid fa-receipt', 'fa-duotone fa-solid fa-box-open',
  'fa-duotone fa-solid fa-tags', 'fa-duotone fa-solid fa-tools', 'fab fa-whatsapp', 'fa-duotone fa-solid fa-chart-bar', 'fa-duotone fa-solid fa-candy'
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
