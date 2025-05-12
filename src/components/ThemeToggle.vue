<!-- ThemeToggle.vue -->
<template>
  <button @click="toggleTheme" class="ml-4">
    {{ isDark ? "☀️" : "🌙" }}
  </button>
</template>

<script setup>
import { ref, onMounted } from "vue";

const isDark = ref(false);

const setTheme = (dark) => {
  isDark.value = dark;
  const theme = dark ? "dark" : "light";
  document.documentElement.classList.remove("dark", "light");
  document.documentElement.classList.add(theme);
  localStorage.setItem("theme", theme);
};

const toggleTheme = () => {
  setTheme(!isDark.value);
};

onMounted(() => {
  const savedTheme = localStorage.getItem("theme") || "light";
  setTheme(savedTheme === "dark");
});
</script>
