import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from '@/App.vue'
import router from '@/router'
import { formatPrice } from '@/utils/formatPrice'

// Registra o Service Worker (se você não estiver usando um plugin PWA que faça isso)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('firebase-messaging-sw.js')
      .then(registration => {
        console.log('Service Worker registrado com sucesso:', registration);
      })
      .catch(error => {
        console.error('Falha no registro do Service Worker:', error);
      });
  });
}

const app = createApp(App)

app.config.globalProperties.$formatPrice = formatPrice

app.use(createPinia())
app.use(router)

app.mount('#app')