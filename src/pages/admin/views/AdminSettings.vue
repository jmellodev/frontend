<template>
  <AdminLayout>
    <div class="space-y-6 p-4 md:p-8 bg-gray-900 rounded-lg shadow-xl">
      <h2 class="text-3xl font-bold text-white">Configurações do Administrador</h2>
      <p class="text-gray-400">Ajuste as configurações gerais da sua plataforma.</p>

      <div class="bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 class="text-xl font-semibold text-white mb-4 border-b border-gray-700 pb-2">Configurações Gerais</h3>
        <div class="space-y-4">
          <div>
            <label for="appName" class="block text-sm font-medium text-gray-300 mb-1">Nome do Aplicativo:</label>
            <input type="text" id="appName" v-model="settings.appName"
              class="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nome da Pizzaria" />
          </div>
          <div>
            <label for="contactEmail" class="block text-sm font-medium text-gray-300 mb-1">Email de Contato:</label>
            <input type="email" id="contactEmail" v-model="settings.contactEmail"
              class="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="contato@pizzaria.com" />
          </div>
          <div>
            <label for="whatsappNumber" class="block text-sm font-medium text-gray-300 mb-1">Número de WhatsApp (para
              pedidos):</label>
            <input type="text" id="whatsappNumber" v-model="settings.whatsappNumber"
              class="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="+55 11 91234-5678" />
          </div>
        </div>
      </div>

      <div class="bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 class="text-xl font-semibold text-white mb-4 border-b border-gray-700 pb-2">Notificações FCM</h3>
        <p class="text-gray-400 mb-4">Gerencie as configurações de notificação push do Firebase Cloud Messaging.</p>
        <div class="space-y-4">
          <div>
            <label for="notificationTopic" class="block text-sm font-medium text-gray-300 mb-1">Tópico Padrão para
              Notificações:</label>
            <input type="text" id="notificationTopic" v-model="settings.notificationTopic"
              class="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="geral_promocoes" />
            <p class="text-xs text-gray-500 mt-1">Este tópico será usado para enviar notificações em massa.</p>
          </div>
          <div class="flex items-center">
            <input type="checkbox" id="enableOrderNotifications" v-model="settings.enableOrderNotifications"
              class="h-5 w-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500" />
            <label for="enableOrderNotifications" class="ml-2 block text-sm text-gray-300">
              Habilitar notificações de atualização de pedido
            </label>
          </div>
        </div>
      </div>

      <div class="flex justify-end mt-6">
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