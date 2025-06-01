<template>
  <div class="flex flex-col h-screen bg-gray-200 dark:bg-gray-900 dark:text-white">
    <header
      class="md:hidden fixed top-0 left-0 right-0 bg-gray-200 dark:bg-gray-800 p-4 flex justify-between items-center z-40 shadow-md">
      <button @click="toggleMobileMenu" class="text-gray-600 dark:text-white text-2xl">
        <i class="fa-duotone fa-bars"></i> </button>
      <h1 class="text-xl font-bold">Painel Administrativo</h1>
      <ThemeToggle />
      <button @click="logout" class="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-md text-sm">Sair</button>
    </header>

    <div
      class="hidden sticky top-0 z-50 md:flex justify-between items-center bg-gray-100 dark:bg-gray-800 p-4 shadow-md">
      <h1 class="text-xl font-bold">Painel Administrativo</h1>
      <div class="flex items-center space-x-4">
        <ThemeToggle />
        <button @click="logout" class="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-md text-sm">Sair</button>
      </div>
    </div>

    <div class="flex flex-1 pt-0 md:pt-0">
      <Sidebar :mobile-menu-open="mobileMenuOpen" @toggle-mobile-menu="toggleMobileMenu" />

      <main class="flex-1 overflow-y-auto p-4 pt-20 md:pt-5 md:ml-64 bg-gray-200 dark:bg-gray-900">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Sidebar from '@/components/admin/Sidebar.vue'; // Certifique-se do caminho correto
import ThemeToggle from '@/components/ThemeToggle.vue';
// import { useRouter } from 'vue-router'; // Descomente se for usar router.push
// import { getAuth, signOut } from 'firebase/auth'; // Descomente se for usar Firebase Auth para logout

const mobileMenuOpen = ref(false);
// const router = useRouter(); // Descomente
// const auth = getAuth(); // Descomente

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const logout = async () => {
  // TODO: Implementar sua lógica de logout aqui
  console.log('Botão de Sair clicado. Implemente sua lógica de logout.');
  // Exemplo com Firebase Auth:
  // try {
  //   await signOut(auth);
  //   router.push('/login'); // Redireciona para a página de login
  // } catch (error) {
  //   console.error('Erro ao fazer logout:', error);
  // }
};
</script>

<style scoped>
/* Estilos específicos para o layout, se necessário */
</style>
