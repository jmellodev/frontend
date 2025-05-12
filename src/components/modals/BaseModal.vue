<template>
  <div
    class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
  >
    <transition name="scale-fade" appear>
      <div
        v-show="visible"
        class="bg-white rounded-2xl shadow-lg w-full max-w-md max-h-[100vh] overflow-y-auto p-6 relative transform transition-all duration-300"
      >
        <slot />
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
const props = defineProps(["modelValue"]);
const emit = defineEmits(["close"]);

const visible = ref(false);

onMounted(() => {
  visible.value = true;
});

function closeModal() {
  visible.value = false;
  setTimeout(() => {
    emit("close");
  }, 300);
}
defineExpose({ closeModal });
</script>

<style scoped>
.scale-fade-enter-active,
.scale-fade-leave-active {
  transition: all 0.3s ease;
}
.scale-fade-enter-from,
.scale-fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
