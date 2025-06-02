<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
    <div class="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
      <h2 class="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">Login Admin</h2>

      <div v-if="authStore.error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
        role="alert">
        <span class="block sm:inline">{{ authStore.error }}</span>
      </div>

      <form @submit.prevent="handleEmailLogin" class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
          <input type="email" id="email" v-model="email" required class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm
                   bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="seu@email.com" />
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Senha</label>
          <input type="password" id="password" v-model="password" required class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm
                   bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="********" />
        </div>
        <button type="submit" :disabled="authStore.loading" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                 dark:bg-blue-700 dark:hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed">
          <span v-if="authStore.loading" class="flex items-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
              viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
            Entrando...
          </span>
          <span v-else>Entrar com Email</span>
        </button>
      </form>

      <div class="relative my-6">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-300 dark:border-gray-600"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">Ou</span>
        </div>
      </div>

      <div>
        <button @click="handleGoogleLogin" :disabled="authStore.loading"
          class="w-full flex justify-center items-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google logo"
            class="w-5 h-5 mr-2">
          <span v-if="authStore.loading" class="flex items-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700 dark:text-white"
              xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
            Entrando com Google...
          </span>
          <span v-else>Entrar com Google</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth'; // Importa o store de autenticação

const authStore = useAuthStore();

const email = ref('');
const password = ref('');

const handleEmailLogin = async () => {
  await authStore.loginWithEmail(email.value, password.value);
};

const handleGoogleLogin = async () => {
  await authStore.loginWithGoogle();
};
</script>
