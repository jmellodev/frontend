<template>
  <button @click="toggleTheme" class="ml-4 text-gray-700 dark:text-white"> <i
      :class="isDark ? 'fa-duotone fa-sun' : 'fa-duotone fa-moon'"></i>
    <span class="sr-only">Toggle Theme</span>
  </button>
</template>

<script setup>
import { ref, onMounted } from "vue";

const isDark = ref(false);

const setTheme = (dark) => {
  isDark.value = dark;
  if (dark) {
    document.documentElement.classList.add("dark");
    document.documentElement.classList.remove("light"); // Garante que 'light' seja removido
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.classList.remove("dark"); // Garante que 'dark' seja removido
    document.documentElement.classList.add("light"); // Adiciona 'light' para clareza, embora não seja estritamente necessário para Tailwind
    localStorage.setItem("theme", "light");
  }
};

const toggleTheme = () => {
  setTheme(!isDark.value);
};

onMounted(() => {
  // Ao montar, lê a preferência salva ou a do sistema
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    setTheme(savedTheme === "dark");
  } else {
    // Se não há tema salvo, usa a preferência do sistema
    setTheme(window.matchMedia("(prefers-color-scheme: dark)").matches);
  }
});
</script>
