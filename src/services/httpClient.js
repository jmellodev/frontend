import axios from 'axios'
import router from '@/router'
import { auth } from '@/firebase/firebaseClient'; // Importa a instância de auth do Firebase Client SDK

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'ngrok-skip-browser-warning': 'true',
  },
})

// Interceptor de Requisição: Adiciona o token de autenticação (ID Token)
api.interceptors.request.use(async config => {
  // Verifica se a requisição é para uma rota que precisa de autenticação admin
  // Assumimos que todas as rotas que começam com '/admin/' precisam do ID Token
  const isAdminRoute = config.url.includes('/admin/');
  const isAuthRoute = config.url.includes('/auth/'); // Rotas de login/google não devem ter token

  if (isAdminRoute && auth.currentUser) {
    try {
      // Obtém o ID Token mais recente do usuário Firebase autenticado.
      // O 'true' força a atualização do token se ele estiver prestes a expirar.
      const idToken = await auth.currentUser.getIdToken(true);
      config.headers.Authorization = `Bearer ${idToken}`;
      console.log('httpClient: ID Token anexado à requisição admin.');
    } catch (error) {
      console.error('httpClient: Erro ao obter ID Token para requisição admin:', error);
      // Se houver um erro ao obter o ID Token (ex: usuário deslogado, token expirado no cliente),
      // o token não será anexado, e a requisição provavelmente resultará em 401 no backend.
      // O interceptor de resposta lidará com isso.
      delete config.headers.Authorization; // Garante que não envie um token inválido
    }
  } else if (!isAdminRoute && !isAuthRoute) {
    // Para rotas que não são admin e não são auth, podemos limpar o header Authorization
    // para evitar enviar tokens desnecessariamente ou para rotas públicas.
    delete config.headers.Authorization;
  }

  return config;
}, error => {
  // Lida com erros antes da requisição ser enviada (ex: erro de rede)
  return Promise.reject(error);
});


// Interceptor de Resposta: Lida com erros de autenticação (401, 403)
api.interceptors.response.use(
  response => response, // Se a resposta for bem-sucedida, apenas a retorna
  async error => { // Se houver um erro na resposta
    const status = error.response?.status; // Obtém o status HTTP do erro

    // Se o status for 401 (Não Autorizado) ou 403 (Acesso Negado)
    if (status === 401 || status === 403) {
      console.warn('Sessão expirada ou acesso negado. Redirecionando para login admin.');

      // Limpa todos os tokens e informações de usuário do localStorage
      localStorage.removeItem('adminAuthToken');
      localStorage.removeItem('adminUser');

      // Desloga o usuário do Firebase Authentication no cliente
      if (auth.currentUser) {
        await auth.signOut(); // Usa await para garantir que o logout seja concluído
      }

      // Redireciona para a página de login admin, se já não estiver nela
      if (router.currentRoute.value.path !== '/admin/login') {
        router.push('/admin/login');
      }
    } else {
      // Para outros tipos de erro, apenas loga e rejeita a promessa
      console.error('Erro na requisição:', error.response?.data || error.message);
    }

    return Promise.reject(error); // Rejeita a promessa para que o componente que fez a requisição possa lidar com o erro
  }
);

export default api;
