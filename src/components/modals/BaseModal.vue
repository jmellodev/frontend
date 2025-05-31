<template>
  <div v-if="open" class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    @click.self="closeModal">
    <transition name="scale-fade" appear>
      <div v-show="open" class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg w-full
               max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl
               max-h-[95vh] overflow-y-auto p-6 relative
               transform transition-all duration-300 ease-out" role="dialog" aria-modal="true">
        <slot />
      </div>
    </transition>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

// Define as props que o componente pode receber
const props = defineProps({
  // modelValue é o nome padrão para v-model, mas 'open' é mais descritivo
  open: {
    type: Boolean,
    default: false,
  },
});

// Define os eventos que o componente pode emitir
const emit = defineEmits(["update:open"]); // Evento para atualizar o v-model

// Função para fechar o modal
function closeModal() {
  // Emite o evento para o componente pai para atualizar a prop 'open' para false
  emit("update:open", false);
}

// Não é mais necessário expor closeModal, pois o v-model gerencia a abertura/fechamento
// defineExpose({ closeModal });
</script>

<style scoped>
/* Estilos para a animação de escala e fade */
.scale-fade-enter-active,
.scale-fade-leave-active {
  transition: all 0.3s ease-in-out;
}

.scale-fade-enter-from,
.scale-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
  /* Pequena escala para efeito de entrada/saída */
}
</style>
