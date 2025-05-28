<template>
  <AppLayout top-nav-title="Perfil - Configurações de Notificação">
    <div class="container mx-auto p-4 max-w-md bg-white shadow-lg rounded-lg mt-8">
      <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">Configurações de Notificação</h2>

      <div class="mb-6">
        <p class="text-gray-700 mb-2">Status das Notificações:</p>
        <div :class="statusClass" class="p-3 rounded-md text-sm font-medium flex items-center justify-between">
          <span>{{ notificationStatus }}</span>
          <svg v-if="notificationStatus.includes('Concedida')" class="w-5 h-5 text-green-700" fill="currentColor"
            viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd"></path>
          </svg>
          <svg v-else-if="notificationStatus.includes('Negada')" class="w-5 h-5 text-red-700" fill="currentColor"
            viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd"></path>
          </svg>
          <svg v-else class="w-5 h-5 text-blue-700 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004 12c0 2.21.894 4.204 2.342 5.658M18 18v-5h-.582m-15.356-2A8.001 8.001 0 0020 12c0-2.21-.894-4.204-2.342-5.658">
            </path>
          </svg>
        </div>
      </div>

      <div class="mb-6">
        <p class="text-gray-700 mb-2">Seu Token FCM:</p>
        <input type="text" :value="fcmToken || 'Gerando...'" readonly
          class="w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 text-sm font-mono"
          @click="copyToken" />
        <p v-if="copySuccess" class="text-green-600 text-xs mt-1">Copiado!</p>
      </div>

      <button @click="handleNotificationRequest" :disabled="permissionRequested || !isFCMSupported"
        class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed">
        <span v-if="!isFCMSupported">Notificações não suportadas</span>
        <span v-else-if="permissionRequested">Permissão Solicitada</span>
        <span v-else>Solicitar Permissão de Notificação</span>
      </button>

      <p class="text-gray-500 text-xs mt-4 text-center">
        Ative as notificações para receber atualizações sobre seus pedidos e promoções.
      </p>
    </div>
  </AppLayout>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import {
  requestNotificationPermissionAndGetToken,
  setupForegroundNotifications,
  initializeMessaging // Importa a nova função
} from '@/firebase/firebaseClient'; // Certifique-se do caminho correto
import { getAuth } from 'firebase/auth'; // Importa getAuth para obter o userId
import { initializeApp } from 'firebase/app'; // Para inicializar o app se não estiver global
import AppLayout from '@/layouts/AppLayout.vue';

// Suas credenciais de configuração do Firebase para o CLIENTE (Web App)
const firebaseConfig = {
  apiKey: "AIzaSyCqcgvxcgWwG4LmYkSL66x4GYi1KLxuHts",
  authDomain: "chat-bot-pizzaria.firebaseapp.com",
  projectId: "chat-bot-pizzaria",
  storageBucket: "chat-bot-pizzaria.firebasestorage.app",
  messagingSenderId: "1090893949199",
  appId: "1:1090893949199:web:cc9724c44f5ef76ea9f67a",
  measurementId: "G-TQ6E8YLYHD"
};

// Inicializa o Firebase Auth aqui ou garanta que o app já foi inicializado globalmente
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


const notificationStatus = ref('Carregando status...');
const fcmToken = ref(null);
const permissionRequested = ref(false);
const copySuccess = ref(false);
const isFCMSupported = ref(true); // Assume que é suportado até que initializeMessaging diga o contrário

// Obtenha o userId dinamicamente.
const userId = ref('loading_user_id'); // Placeholder inicial

auth.onAuthStateChanged((user) => {
  if (user) {
    userId.value = user.uid;
    console.log('User ID from Firebase Auth:', userId.value);
  } else {
    // Se não houver usuário logado, você pode gerar um ID temporário
    // ou usar um ID de sessão para usuários não autenticados.
    let guestId = localStorage.getItem('guestUserId');
    if (!guestId) {
      guestId = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem('guestUserId', guestId);
    }
    userId.value = guestId;
    console.log('Guest User ID:', userId.value);
  }
});


const statusClass = computed(() => {
  if (notificationStatus.value.includes('Concedida')) {
    return 'bg-green-100 text-green-800';
  } else if (notificationStatus.value.includes('Negada')) {
    return 'bg-red-100 text-red-800';
  } else if (notificationStatus.value.includes('Erro') || notificationStatus.value.includes('não suportadas')) {
    return 'bg-yellow-100 text-yellow-800';
  }
  return 'bg-blue-100 text-blue-800';
});

const handleNotificationRequest = async () => {
  permissionRequested.value = true;
  try {
    const token = await requestNotificationPermissionAndGetToken(userId.value);
    if (token) {
      fcmToken.value = token;
      notificationStatus.value = 'Permissão de notificação Concedida!';
    } else {
      notificationStatus.value = 'Permissão de notificação Negada ou token não obtido.';
    }
  } catch (error) {
    console.error('Erro geral ao lidar com a solicitação de notificação:', error);
    notificationStatus.value = `Erro: ${error.message}`;
  } finally {
    permissionRequested.value = false;
  }
};

const copyToken = () => {
  if (fcmToken.value) {
    navigator.clipboard.writeText(fcmToken.value).then(() => {
      copySuccess.value = true;
      setTimeout(() => {
        copySuccess.value = false;
      }, 2000);
    }).catch(err => {
      console.error('Falha ao copiar o token:', err);
    });
  }
};

onMounted(async () => {
  // Primeiro, inicializa o Messaging e verifica o suporte
  const messaging = await initializeMessaging();
  if (!messaging) {
    isFCMSupported.value = false;
    notificationStatus.value = 'Notificações não suportadas neste navegador.';
    return; // Sai se o FCM não for suportado
  }

  // Se o FCM for suportado, registre o Service Worker e configure as notificações
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      console.log('Service Worker registrado com sucesso:', registration);
      // Não precisamos mais chamar messaging.useServiceWorker(registration) aqui,
      // pois initializeMessaging já cuidou disso internamente ao obter a instância.
      // Apenas certifique-se que o SW está ativo.
    } catch (error) {
      console.error('Falha ao registrar o Service Worker:', error);
      notificationStatus.value = `Erro ao registrar Service Worker: ${error.message}`;
      isFCMSupported.value = false; // Se o SW falhar, o FCM também falhará
      return;
    }
  } else {
    notificationStatus.value = 'Navegador não suporta Service Workers.';
    isFCMSupported.value = false;
    return;
  }

  // Configura o listener para mensagens em primeiro plano
  setupForegroundNotifications();

  // Verifica o status da permissão na montagem
  const currentPermission = Notification.permission;
  if (currentPermission === 'granted') {
    notificationStatus.value = 'Permissão de notificação Concedida.';
    // Tenta obter o token se a permissão já foi concedida
    try {
      const token = await requestNotificationPermissionAndGetToken(userId.value);
      if (token) {
        fcmToken.value = token;
      }
    } catch (error) {
      console.error('Erro ao obter token na montagem:', error);
      notificationStatus.value = `Erro ao obter token: ${error.message}`;
    }
  } else if (currentPermission === 'denied') {
    notificationStatus.value = 'Permissão de notificação Negada.';
  } else {
    notificationStatus.value = 'Aguardando permissão...';
  }
});
</script>

<style scoped>
/* Adicione estilos Tailwind ou CSS personalizado aqui */
</style>
