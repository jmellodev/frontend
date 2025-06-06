// public/firebase-messaging-sw.js
// Importa o SDK do Firebase para o Service Worker
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

// Seu objeto de configuração do Firebase que você copiou do console
// Certifique-se de que os valores de API Key, Project ID, etc., estão corretos.
const firebaseConfig = {
  apiKey: "AIzaSyCqcgvxcgWwG4LmYkSL66x4GYi1KLxuHts",
  authDomain: "chat-bot-pizzaria.firebaseapp.com",
  projectId: "chat-bot-pizzaria",
  storageBucket: "chat-bot-pizzaria.firebasestorage.app",
  messagingSenderId: "1090893949199",
  appId: "1:1090893949199:web:cc9724c44f5ef76ea9f67a",
  measurementId: "G-TQ6E8YLYHD"
};

// Inicializa o Firebase no Service Worker
firebase.initializeApp(firebaseConfig);

// Obtém a instância de Messaging
const messaging = firebase.messaging();

// Evento para quando uma mensagem é recebida em segundo plano
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  // Personalize a exibição da notificação aqui
  const notificationTitle = payload.notification.title || 'Nova Notificação';
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/img/icons/android-chrome-192x192.png', // Caminho para um ícone no seu PWA
    data: payload.data, // Adicione dados personalizados para a notificação
    actions: [ // Opcional: botões na notificação
      { action: 'open_url', title: 'Abrir' }
    ]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Opcional: Lidar com o clique na notificação
self.addEventListener('notificationclick', (event) => {
  event.notification.close(); // Fecha a notificação

  if (event.action === 'open_url' && event.notification.data && event.notification.data.url) {
    clients.openWindow(event.notification.data.url); // Abre a URL se fornecida
  } else {
    // Abre a página principal do seu PWA
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
        if (windowClients.length > 0) {
          const appClient = windowClients[0];
          appClient.focus();
        } else {
          clients.openWindow('/'); // Abre uma nova janela se nenhuma estiver aberta
        }
      })
    );
  }
});