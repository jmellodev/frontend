<template>
  <AdminLayout>
    <div class="whatsapp-qr-container p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md text-center">
      <h2 class="text-xl font-semibold mb-4 dark:text-white">Status da Conexão do WhatsApp</h2>

      <div v-if="loading" class="text-gray-600 dark:text-gray-400">
        <i class="fas fa-spinner fa-spin mr-2"></i> Carregando status...
      </div>

      <div v-else>
        <p class="text-lg font-medium mb-2" :class="statusColorClass">
          Status: <span class="capitalize">{{ connectionStatus }}</span>
        </p>

        <div v-if="connectionStatus === 'qr-code'">
          <p class="text-gray-700 dark:text-gray-300 mb-4">Escaneie o QR Code abaixo com seu celular para conectar o
            bot:
          </p>
          <img v-if="qrCode" :src="qrCode" alt="QR Code WhatsApp" class="mx-auto w-64 h-64 border p-2 bg-white" />
          <p v-else class="text-red-500">QR Code não disponível. Tente recarregar a página.</p>
        </div>

        <div v-else-if="connectionStatus === 'connected'" class="text-green-600 dark:text-green-400">
          <i class="fas fa-check-circle mr-2"></i> Bot conectado com sucesso!
          <p class="text-gray-700 dark:text-gray-300 mt-2">Você pode fechar esta página.</p>
        </div>

        <div v-else-if="connectionStatus === 'inchat'" class="text-green-600 dark:text-green-400">
          <i class="fas fa-check-circle mr-2"></i> Bot conectado com sucesso!
          <p class="text-gray-700 dark:text-gray-300 mt-2">Você pode fechar esta página.</p>
        </div>

        <div v-else-if="connectionStatus === 'disconnected' || connectionStatus === 'closed'">
          <p class="text-red-600 dark:text-red-400">Bot desconectado. Aguardando novo QR Code ou tentando reconectar.
          </p>
          <button @click="fetchQrCode" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Tentar novamente
          </button>
        </div>

        <div v-else-if="connectionStatus === 'failed'" class="text-red-600 dark:text-red-400">
          <p>Falha ao iniciar o bot. Verifique os logs do backend.</p>
          <button @click="fetchQrCode" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Tentar novamente
          </button>
        </div>

        <div v-else class="text-gray-500 dark:text-gray-400">
          <p>Status: {{ connectionStatus }}</p>
        </div>

        <button @click="fetchQrCode" :disabled="loading"
          class="mt-6 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-200">
          <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>
          Atualizar Status
        </button>

        <button @click="startBot" :disabled="loading"
          v-if="connectionStatus !== 'inchat' || connectionStatus !== 'connected'"
          class="mt-4 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200">
          <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>
          <i class="fab fa-whatsapp"></i>
          Iniciar Bot WhatsApp
        </button>
      </div>
    </div>
  </AdminLayout>

</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '@/services/httpClient'; // Seu cliente Axios configurado

const qrCode = ref(null);
const connectionStatus = ref('loading');
const loading = ref(true);
const intervalId = ref(null); // Para o polling

const statusColorClass = computed(() => {
  switch (connectionStatus.value) {
    case 'inchat':
    case 'connected': return 'text-green-600 dark:text-green-400';
    case 'qr-code': return 'text-orange-500';
    case 'disconnected':
    case 'closed':
    case 'failed': return 'text-red-600 dark:text-red-400';
    default: return 'text-gray-500 dark:text-gray-400';
  }
});

// ... dentro do <script setup>
const fetchQrCode = async () => {
  loading.value = true;
  try {
    const response = await api.get('/whatsapp/status');
    connectionStatus.value = response.data.status;

    // --- AQUI ESTÁ A CORREÇÃO SIMPLIFICADA ---
    // Atribua diretamente a string recebida.
    // O WPPConnect (ou seu backend) já está fornecendo o prefixo completo.
    qrCode.value = response.data.qrCode;
    // --- FIM DA CORREÇÃO SIMPLIFICADA ---

  } catch (error) {
    console.error('Erro ao buscar status do QR Code:', error);
    connectionStatus.value = 'failed';
    qrCode.value = null;
  } finally {
    loading.value = false;
  }
};

const startBot = async () => {
  loading.value = true;
  try {
    const response = await api.post('/admin/start-bot');
    connectionStatus.value = response.data.status;
    qrCode.value = response.data.qrCode; // Atualiza o QR Code se necessário
    setInterval(fetchQrCode, 15000);
  } catch (error) {
    console.error('Erro ao iniciar o bot:', error);
    connectionStatus.value = 'failed';
    qrCode.value = null;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchQrCode();
  // Poll a cada 5 segundos para atualizar o status do QR Code/conexão
  // intervalId.value = setInterval(fetchQrCode, 15000);
});

// Limpa o intervalo quando o componente é desmontado para evitar vazamentos de memória
import { onUnmounted } from 'vue';
import AdminLayout from '@/layouts/AdminLayout.vue';
onUnmounted(() => {
  if (intervalId.value) {
    clearInterval(intervalId.value);
  }
});
</script>

<style scoped>
.whatsapp-qr-container {
  max-width: 400px;
  margin: 2rem auto;
}
</style>