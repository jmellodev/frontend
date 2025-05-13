import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from '@/App.vue'
import router from '@/router'
import { formatPrice } from '@/utils/formatPrice'

const app = createApp(App)

app.config.globalProperties.$formatPrice = formatPrice

app.use(createPinia())
app.use(router)

app.mount('#app')