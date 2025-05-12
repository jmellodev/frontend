import axios from 'axios'
import router from '@/router'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'ngrok-skip-browser-warning': 'true',
  },
})

// Adiciona token Authorization (se houver)
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Tratamento de erros globais
api.interceptors.response.use(
  response => response,
  error => {
    const status = error.response?.status

    if (status === 401 || status === 403) {
      // Redireciona para login
      console.warn('Sessão expirada ou acesso negado. Redirecionando para login.')
      localStorage.removeItem('token')
      router.push('/login')
    } else {
      console.error('Erro na requisição:', error.response?.data || error.message)
    }

    return Promise.reject(error)
  }
)

export default api
