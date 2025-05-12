<script setup>
import AppLayout from "@/layouts/AppLayout.vue";
</script>

<template>
  <AppLayout :is-header-visible="true" title="Carrinho" :show-back-button="true">
    <div class="bg-gray-800 p-16 dark:bg-red-500">
      <h1>Carrinho</h1>
    </div>
  </AppLayout>
</template>
