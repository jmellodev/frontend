<template>
  <div v-if="open"
    class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 dark:bg-gray-900/40 rounded-lg w-full text-gray-900 dark:text-white"
    @click.self="closeModal">
    <Transition name="custom-classes" appear enter-active-class="animate__animated animate__zoomIn animate__faster"
      leave-active-class="animate__animated animate__bounceOutRight animate__faster">
      <div v-show="open" class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg w-auto
               max-h-[95vh] overflow-y-auto p-6 relative custom-scrollbar" role="dialog" aria-modal="true">
        <slot />
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:open"]);

function closeModal() {
  emit("update:open", false);
}
</script>

<style scoped>
.bounce-enter-active {
  animation: bounce-in 0.5s;
}

.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }

  50% {
    transform: scale(1.25);
  }

  100% {
    transform: scale(1);
  }
}

/* Estilos para a animação de escala e fade */
.scale-fade-enter-active,
.scale-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.scale-fade-enter-from,
.scale-fade-leave-to {
  transform: translateZ(20px);
  opacity: 0;
}

/* Estilos para a scrollbar personalizada */
.custom-scrollbar::-webkit-scrollbar {
  width: 12px;
  /* Largura da scrollbar */
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  /* Cor do fundo da trilha da scrollbar (tema claro) */
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #888;
  /* Cor do "polegar" da scrollbar (tema claro) */
  border-radius: 10px;
  border: 3px solid #f1f1f1;
  /* Borda para dar um efeito 3D */
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #555;
  /* Cor do "polegar" ao passar o mouse (tema claro) */
}

/* Estilos para o tema escuro */
.dark .custom-scrollbar::-webkit-scrollbar-track {
  background: #333;
  /* Cor do fundo da trilha da scrollbar (tema escuro) */
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #555;
  /* Cor do "polegar" da scrollbar (tema escuro) */
  border: 3px solid #333;
  /* Borda para dar um efeito 3D */
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #777;
  /* Cor do "polegar" ao passar o mouse (tema escuro) */
}
</style>
