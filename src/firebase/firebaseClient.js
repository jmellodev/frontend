// src/services/firebaseClient.js
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging'; // Importa isSupported
import api from '@/services/httpClient'; // Seu cliente Axios

// Seu objeto de configuração do Firebase (o mesmo do Service Worker)
const firebaseConfig = {
  apiKey: "AIzaSyCqcgvxcgWwG4LmYkSL66x4GYi1KLxuHts",
  authDomain: "chat-bot-pizzaria.firebaseapp.com",
  projectId: "chat-bot-pizzaria",
  storageBucket: "chat-bot-pizzaria.firebasestorage.app",
  messagingSenderId: "1090893949199",
  appId: "1:1090893949199:web:cc9724c44f5ef76ea9f67a",
  measurementId: "G-TQ6E8YLYHD"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

let messagingInstance = null; // Variável para armazenar a instância de messaging

/**
 * Inicializa a instância de Messaging apenas se for suportado pelo navegador.
 * @returns {Promise<Messaging|null>} A instância de Messaging ou null se não suportado.
 */
async function initializeMessaging() {
  if (await isSupported()) {
    if (!messagingInstance) { // Garante que só inicializa uma vez
      messagingInstance = getMessaging(app);
      console.log('Firebase Messaging suportado e inicializado.');
    }
    return messagingInstance;
  } else {
    console.warn('Firebase Messaging NÃO suportado neste navegador.');
    return null;
  }
}

/**
 * Solicita permissão e obtém o token FCM.
 * @param {string} userId - O ID do usuário para associar o token.
 * @returns {Promise<string|null>} O token FCM ou null se não for possível obtê-lo.
 */
async function requestNotificationPermissionAndGetToken(userId) {
  const messaging = await initializeMessaging();
  if (!messaging) {
    console.warn('Não foi possível obter a instância de Messaging. Abortando solicitação de token.');
    return null;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('Permissão de notificação concedida.');

      // Obtenha o token de registro do dispositivo
      // Substitua 'YOUR_VAPID_PUBLIC_KEY' pela sua chave VAPID real
      const currentToken = await getToken(messaging, { vapidKey: 'BIs0n17mt2gj5vBTzyM5znHMDOgI6lcOiGanKQW2SiPlFcgmSvLpBu-d0txnoNKLivhbsUD0iwHHSBQk_LNgQ0A' }); // Exemplo de VAPID Key

      if (currentToken) {
        console.log('FCM Registration Token:', currentToken);
        // Envie este token para o seu backend para armazenamento
        await api.post('/fcm/save-token', { userId, fcmToken: currentToken }); // Ajustado para o endpoint correto
        console.log('Token enviado para o backend com sucesso.');
        return currentToken;
      } else {
        console.warn('Nenhum token de registro de FCM disponível. Permissão negada ou Service Worker não registrado.');
        return null;
      }
    } else {
      console.warn('Permissão de notificação negada.');
      return null;
    }
  } catch (error) {
    console.error('Erro ao obter token de notificação:', error);
    return null;
  }
}

/**
 * Lida com mensagens quando o aplicativo está em primeiro plano.
 */
async function setupForegroundNotifications() {
  const messaging = await initializeMessaging();
  if (messaging) {
    onMessage(messaging, (payload) => {
      console.log('Mensagem recebida em primeiro plano:', payload);
      // Exiba a notificação na UI do seu aplicativo, se desejar
      // Ex: usando um componente de toast/snackbar
      alert(`Notificação: ${payload.notification.title} - ${payload.notification.body}`);
    });
  } else {
    console.warn('Não foi possível configurar notificações em primeiro plano: Messaging não suportado.');
  }
}

export {
  requestNotificationPermissionAndGetToken,
  setupForegroundNotifications,
  initializeMessaging // Exporta a nova função para inicialização condicional
};
