<template>
  <div class="relative" ref="multiSelectContainer">
    <div
      class="w-full p-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md flex items-center flex-wrap gap-2 cursor-pointer min-h-[48px]"
      @click.stop="toggleDropdown">
      <span class="text-gray-500 dark:text-gray-400">
        Selecione categorias...
      </span>
      <div v-for="cat in selectedCategories" :key="cat.id"
        class="flex items-center bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
        {{ cat.name }}
        <button @click.stop="removeCategory(cat.id)" class="ml-1 text-white hover:text-blue-100 focus:outline-none">
          &times;
        </button>
      </div>
      <input type="text" v-model="searchQuery" @input="filterOptions" @focus="openDropdown"
        @keydown.down.prevent="highlightNext" @keydown.up.prevent="highlightPrev"
        @keydown.enter.prevent="selectHighlighted" placeholder="Buscar categorias..."
        class="flex-grow p-0 bg-transparent border-none focus:outline-none text-gray-900 dark:text-white"
        :style="{ width: searchQuery.length ? (searchQuery.length * 8 + 20) + 'px' : '150px' }" />
    </div>

    <div v-if="isOpen"
      class="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto custom-scrollbar">
      <ul class="py-1">
        <li v-for="(cat, index) in filteredCategories" :key="cat.id" @click="selectCategory(cat.id)"
          @mouseenter="highlightedIndex = index" :class="{
            'px-4 py-2 cursor-pointer hover:bg-blue-500 hover:text-white': true,
            'bg-blue-500 text-white': highlightedIndex === index,
            'text-gray-900 dark:text-white': highlightedIndex !== index,
            'opacity-50 cursor-not-allowed': isSelected(cat.id)
          }">
          {{ cat.name }}
        </li>
        <li v-if="filteredCategories.length === 0" class="px-4 py-2 text-gray-500 dark:text-gray-400 italic">
          Nenhuma categoria encontrada.
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  modelValue: {
    type: Array, // Array de IDs de categorias selecionadas
    default: () => [],
  },
  categories: {
    type: Array, // Todas as categorias disponíveis (objetos com id, name)
    required: true,
  },
});

const emit = defineEmits(['update:modelValue']);

const searchQuery = ref('');
const isOpen = ref(false);
const highlightedIndex = ref(-1);
const multiSelectContainer = ref(null);

// Categorias selecionadas (objetos completos)
const selectedCategories = computed(() => {
  return props.categories.filter(cat => props.modelValue.includes(cat.id));
});

// Exibição das categorias selecionadas no input
const selectedCategoriesDisplay = computed(() => {
  return selectedCategories.value.map(cat => cat.name).join(' x ');
});

// Categorias filtradas para o dropdown
const filteredCategories = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return props.categories.filter(cat =>
    cat.name.toLowerCase().includes(query) && !isSelected(cat.id)
  );
});

function isSelected(id) {
  return props.modelValue.includes(id);
}

function toggleDropdown() {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    searchQuery.value = ''; // Limpa a busca ao abrir
    highlightedIndex.value = -1; // Reseta o destaque
  }
}

function openDropdown() {
  isOpen.value = true;
  highlightedIndex.value = -1;
}

function closeDropdown() {
  isOpen.value = false;
  searchQuery.value = ''; // Limpa a busca ao fechar
}

function filterOptions() {
  highlightedIndex.value = -1; // Reseta o destaque ao digitar
  isOpen.value = true; // Garante que o dropdown esteja aberto ao digitar
}

function selectCategory(id) {
  if (!isSelected(id)) {
    const newSelection = [...props.modelValue, id];
    emit('update:modelValue', newSelection);
  }
  searchQuery.value = ''; // Limpa a busca após seleção
  // Não fecha o dropdown imediatamente, permite adicionar mais
  // closeDropdown(); // Removido para permitir múltiplas seleções sem reabrir
}

function removeCategory(id) {
  const newSelection = props.modelValue.filter(catId => catId !== id);
  emit('update:modelValue', newSelection);
  // Não fecha o dropdown ao remover, permite continuar adicionando
  openDropdown(); // Reabre o dropdown para continuar selecionando
}

function highlightNext() {
  if (filteredCategories.value.length === 0) {
    highlightedIndex.value = -1;
    return;
  }
  highlightedIndex.value = (highlightedIndex.value + 1) % filteredCategories.value.length;
}

function highlightPrev() {
  if (filteredCategories.value.length === 0) {
    highlightedIndex.value = -1;
    return;
  }
  highlightedIndex.value = (highlightedIndex.value - 1 + filteredCategories.value.length) % filteredCategories.value.length;
}

function selectHighlighted() {
  if (highlightedIndex.value !== -1 && filteredCategories.value[highlightedIndex.value]) {
    selectCategory(filteredCategories.value[highlightedIndex.value].id);
  }
}

// Fechar dropdown ao clicar fora
function handleClickOutside(event) {
  if (multiSelectContainer.value && !multiSelectContainer.value.contains(event.target)) {
    closeDropdown();
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
/* Estilos para a scrollbar personalizada (copiados do BaseModal para consistência) */
.custom-scrollbar::-webkit-scrollbar {
  width: 12px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
  border: 3px solid #f1f1f1;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.dark .custom-scrollbar::-webkit-scrollbar-track {
  background: #333;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #555;
  border: 3px solid #333;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #777;
}
</style>
