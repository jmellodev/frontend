<template>
  <RouterView v-slot="{ Component, route }">
    <transition :enter-active-class="route.meta.enterActiveClass" :leave-active-class="route.meta.leaveActiveClass">
      <component :is="Component" />
    </transition>
  </RouterView>
  <ToastNotification />
</template>
<script setup>
import { RouterView } from "vue-router";
import ToastNotification from "./components/ToastNotification.vue";
</script>