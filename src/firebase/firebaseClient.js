// src/services/firebaseClient.js
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';
import { getAuth, GoogleAuthProvider, EmailAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // <--- IMPORTAÇÃO SIMPLIFICADA
import api from '@/services/httpClient';

// Configuração do Firebase
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

// --- Instâncias dos serviços ---
const auth = getAuth(app);
const db = getFirestore(app); // <--- INSTÂNCIA DO FIRESTORE
const googleProvider = new GoogleAuthProvider();
const emailProvider = new EmailAuthProvider();

console.log('Firebase inicializado com sucesso');

let messagingInstance = null;

/**
 * Inicializa a instância de Messaging apenas se for suportado pelo navegador.
 * @returns {Promise<Messaging|null>} A instância de Messaging ou null se não suportado.
 */
async function initializeMessaging() {
  if (await isSupported()) {
    if (!messagingInstance) {
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

      const currentToken = await getToken(messaging, {
        vapidKey: 'BIs0n17mt2gj5vBTzyM5znHMDOgI6lcOiGanKQW2SiPlFcgmSvLpBu-d0txnoNKLivhbsUD0iwHHSBQk_LNgQ0A'
      });

      if (currentToken) {
        console.log('FCM Registration Token:', currentToken);
        await api.post('/fcm/save-token', { userId, fcmToken: currentToken });
        console.log('Token enviado para o backend com sucesso.');
        return currentToken;
      } else {
        console.warn('Nenhum token de registro de FCM disponível.');
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

      // Cria notificação mais rica
      if ('Notification' in window && Notification.permission === 'granted') {
        const notification = new Notification(payload.notification.title, {
          body: payload.notification.body,
          icon: payload.notification.icon || '/favicon.ico',
          badge: '/favicon.ico',
          tag: payload.data?.orderId || 'general',
          requireInteraction: true,
          actions: [
            { action: 'view', title: 'Ver Pedido' },
            { action: 'close', title: 'Fechar' }
          ]
        });

        notification.onclick = function () {
          window.focus();
          if (payload.data?.orderId) {
            // Navegar para o pedido específico se necessário
            console.log('Abrindo pedido:', payload.data.orderId);
          }
          notification.close();
        };
      } else {
        // Fallback para alert se notificações não estiverem disponíveis
        alert(`Notificação: ${payload.notification.title} - ${payload.notification.body}`);
      }
    });
  } else {
    console.warn('Não foi possível configurar notificações em primeiro plano: Messaging não suportado.');
  }
}

/**
 * Utilitário para verificar conexão com Firestore
 * @returns {Promise<boolean>} True se conectado, false caso contrário
 */
async function checkFirestoreConnection() {
  try {
    const { doc, getDoc } = await import('firebase/firestore');
    const testDoc = doc(db, 'test', 'connection');
    await getDoc(testDoc);
    return true;
  } catch (error) {
    console.error('Erro ao verificar conexão Firestore:', error);
    return false;
  }
}

export {
  app,
  auth,
  db, // <--- EXPORTA A INSTÂNCIA DO FIRESTORE
  googleProvider,
  emailProvider,
  requestNotificationPermissionAndGetToken,
  setupForegroundNotifications,
  initializeMessaging,
  checkFirestoreConnection // <--- NOVA FUNÇÃO UTILITÁRIA
};