<template>
  <AdminLayout>
    <div class="space-y-6">
      <h2 class="text-md md:text-2xl font-bold text-gray-900 dark:text-white">Configurações do Administrador
        <p class="text-gray-600 dark:text-gray-400 italic text-xs font-normal">Ajuste as configurações gerais da sua
          plataforma.</p>
      </h2>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div class="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-300 dark:border-gray-700">
          <h3
            class="text-xl font-semibold text-gray-900 dark:text-white mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
            Configurações Gerais</h3>
          <div class="space-y-4">
            <div>
              <label for="appName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome do
                Aplicativo:</label>
              <input type="text" id="appName" v-model="settings.appName"
                class="w-full p-3 bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nome da Pizzaria" />
            </div>
            <div>
              <label for="contactEmail" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email de
                Contato:</label>
              <input type="email" id="contactEmail" v-model="settings.contactEmail"
                class="w-full p-3 bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="contato@pizzaria.com" />
            </div>
            <div>
              <label for="whatsappNumber" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Número
                de WhatsApp (para
                pedidos):</label>
              <input type="text" id="whatsappNumber" v-model="settings.whatsappNumber"
                class="w-full p-3 bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+55 11 91234-5678" />
            </div>
          </div>
        </div>

        <div class="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-300 dark:border-gray-700">
          <h3
            class="text-xl font-semibold text-gray-900 dark:text-white mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
            Notificações FCM</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">Gerencie as configurações de notificação push do Firebase
            Cloud
            Messaging.</p>
          <div class="space-y-4">
            <div>
              <label for="notificationTopic"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tópico Padrão para
                Notificações:</label>
              <input type="text" id="notificationTopic" v-model="settings.notificationTopic"
                class="w-full p-3 bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="geral_promocoes" />
              <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">Este tópico será usado para enviar notificações
                em
                massa.</p>
            </div>
            <div class="flex items-center">
              <input type="checkbox" id="enableOrderNotifications" v-model="settings.enableOrderNotifications"
                class="h-5 w-5 text-blue-600 bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500" />
              <label for="enableOrderNotifications" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Habilitar notificações de atualização de pedido
              </label>
            </div>
          </div>
        </div>

        <div class="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-300 dark:border-gray-700">
          <h3
            class="text-xl font-semibold text-gray-900 dark:text-white mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
            Outros</h3>
          <div class="space-y-4">

            <p class="text-xs text-gray-500 dark:text-gray-500 mt-1 flex items-center justify-between">
              Tema Light/Dark
              <ThemeToggle />
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-500 mt-1 flex items-center justify-between">
              <label for="xota" class="animate-xota">Ativar notificações de pedidos</label>
              <input id="xota" type="checkbox" value="anal69"
                class="w-4 h-4 appearance-none dark:bg-gray-900 checked:bg-green-200 checked:rounded-full checked:outline-2 outline-2 rounded-full not-checked:outline-orange-800 checked:animate-rubberBand checked:outline-orange-500">

            </p>
          </div>
        </div>
      </div>
      <div class=" flex justify-end mt-6">
        <button @click="saveSettings" :disabled="isSaving"
          class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
          <span v-if="isSaving">Salvando...</span>
          <span v-else>Salvar Configurações</span>
        </button>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AdminLayout from '@/layouts/AdminLayout.vue';
import api from '@/services/httpClient'; // Seu cliente Axios
import ThemeToggle from '@/components/ThemeToggle.vue';

const settings = ref({
  appName: '',
  contactEmail: '',
  whatsappNumber: '',
  notificationTopic: 'geral_promocoes', // Valor padrão
  enableOrderNotifications: true, // Valor padrão
  // Adicione outras configurações conforme necessário
});

const isSaving = ref(false);
const isLoading = ref(true); // Para carregar as configurações existentes

// Função para carregar as configurações do backend
async function loadSettings() {
  isLoading.value = true;
  try {
    // Assumindo que você terá um endpoint no backend como /api/admin/settings
    const response = await api.get('/admin/settings');
    if (response.data) {
      // Mescla as configurações existentes com os valores padrão para garantir que todos os campos estejam presentes
      settings.value = { ...settings.value, ...response.data };
    }
  } catch (error) {
    console.error('Erro ao carregar configurações:', error);
    // TODO: Exibir uma mensagem de erro para o usuário
  } finally {
    isLoading.value = false;
  }
}

// Função para salvar as configurações no backend
async function saveSettings() {
  isSaving.value = true;
  try {
    // Assumindo que você terá um endpoint no backend como /api/admin/settings
    // E que ele pode ser um POST para criar ou PUT para atualizar
    await api.post('/admin/settings', settings.value); // Ou PUT se for sempre atualização
    console.log('Configurações salvas com sucesso!');
    // TODO: Exibir uma mensagem de sucesso para o usuário (ex: toast)
  } catch (error) {
    console.error('Erro ao salvar configurações:', error);
    // TODO: Exibir uma mensagem de erro para o usuário
  } finally {
    isSaving.value = false;
  }
}

onMounted(() => {
  loadSettings();
});
</script>