// src/stores/auth.js
import { defineStore } from 'pinia';
import { auth, googleProvider } from '../firebase/firebaseClient'; // Importa a instância de auth e googleProvider
import { signInWithPopup, signInWithEmailAndPassword, signOut, signInWithCustomToken } from 'firebase/auth'; // Importa signInWithCustomToken
import api from '../services/httpClient'; // Seu cliente HTTP configurado
import router from '../router'; // Importa o roteador para redirecionamentos
import { useToastStore } from './toast'; // Importa o store de toast para feedback visual

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // O objeto 'user' conterá informações básicas do usuário e a flag 'isAdmin'
    // populada de forma segura a partir das claims do ID Token.
    user: JSON.parse(localStorage.getItem('adminUser')) || null,
    // 'authToken' armazena o Custom Token recebido do backend.
    // Ele é usado para re-autenticar o usuário no Firebase Client SDK ao recarregar a página.
    authToken: localStorage.getItem('adminAuthToken') || null,
    loading: false, // Indica se uma operação de autenticação está em andamento
    error: null,    // Armazena mensagens de erro para exibição
  }),

  getters: {
    // Retorna true se há um token E um objeto de usuário, indicando que está autenticado.
    isAuthenticated: (state) => !!state.authToken && !!state.user,
    // O getter isAdmin verifica a propriedade 'isAdmin' do objeto 'user'.
    // Esta propriedade é populada de forma segura a partir das claims do ID Token.
    // Usa optional chaining (`?.`) para evitar erros se 'user' for null, retornando false por padrão.
    isAdmin: (state) => state.user?.isAdmin || false,
  },

  actions: {
    // Função auxiliar para obter e atualizar as informações do usuário, incluindo claims de forma segura.
    // Esta função deve ser chamada APÓS o usuário estar autenticado no Firebase Client SDK (auth.currentUser).
    async _updateUserInfoFromFirebase(firebaseUser) {
      if (!firebaseUser) {
        this.user = null;
        return;
      }
      // Obtém o resultado do ID Token, forçando a atualização ('true') para garantir claims recentes.
      const idTokenResult = await firebaseUser.getIdTokenResult(true);
      this.user = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        // Popula 'isAdmin' diretamente das claims verificadas do ID Token.
        isAdmin: idTokenResult.claims.admin || false,
      };
      // Persiste o objeto de usuário (com isAdmin seguro) no localStorage.
      localStorage.setItem('adminUser', JSON.stringify(this.user));
      console.log('Auth Store: User info updated from Firebase ID Token claims:', this.user);
    },

    // Ação para login com Email e Senha
    async loginWithEmail(email, password) {
      const toastStore = useToastStore();
      this.loading = true;
      this.error = null;

      try {
        // 1. Autentica o usuário no Firebase Client SDK com email e senha.
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;
        // 2. Obtém o ID Token do usuário autenticado. Este token será enviado ao backend.
        const idToken = await firebaseUser.getIdToken();

        // 3. Envia o ID Token para o seu backend para troca por um Custom Token.
        // O backend verifica o ID Token e retorna um Custom Token para re-autenticação no cliente.
        const response = await api.post(`/auth/login`, { idToken });

        this.authToken = response.data.customToken; // Salva o Custom Token
        localStorage.setItem('adminAuthToken', this.authToken); // Persiste o Custom Token

        // 4. Assina o usuário no Firebase Client SDK com o Custom Token recebido do backend.
        // Isso é CRUCIAL para que 'auth.currentUser' seja o usuário correto e suas claims sejam acessíveis.
        await signInWithCustomToken(auth, this.authToken);

        // 5. Atualiza as informações do usuário no store a partir do Firebase (claims seguras).
        await this._updateUserInfoFromFirebase(auth.currentUser);

        toastStore.showToast('Sucesso!', 'Login realizado com sucesso.', 'success');
        router.push('/admin'); // Redireciona para a área administrativa

      } catch (err) {
        console.error('Erro ao fazer login com e-mail:', err);
        let errorMessage = 'Erro ao fazer login. Tente novamente.';

        if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential' || err.code === 'auth/invalid-email') {
          errorMessage = 'Email ou senha inválidos.';
        } else if (err.response && err.response.data && err.response.data.error) {
          errorMessage = err.response.data.error;
        }

        this.error = errorMessage;
        toastStore.showToast('Erro de Login', errorMessage, 'error');

        this.authToken = null;
        this.user = null;
        localStorage.removeItem('adminAuthToken');
        localStorage.removeItem('adminUser');
      } finally {
        this.loading = false;
      }
    },

    // Ação para login com Google
    async loginWithGoogle() {
      const toastStore = useToastStore();
      this.loading = true;
      this.error = null;

      try {
        // 1. Autentica o usuário no Firebase Client SDK via popup do Google.
        const result = await signInWithPopup(auth, googleProvider);
        const firebaseUser = result.user;
        // 2. Obtém o ID Token do usuário autenticado pelo Google.
        const idToken = await firebaseUser.getIdToken();

        // 3. Envia o ID Token para o seu backend para troca por um Custom Token.
        const response = await api.post(`/auth/google`, { idToken });

        this.authToken = response.data.customToken;
        localStorage.setItem('adminAuthToken', this.authToken);

        // 4. Assina o usuário no Firebase Client SDK com o Custom Token recebido do backend.
        await signInWithCustomToken(auth, this.authToken);

        // 5. Atualiza as informações do usuário no store a partir do Firebase (claims seguras).
        await this._updateUserInfoFromFirebase(auth.currentUser);

        toastStore.showToast('Sucesso!', 'Login com Google realizado com sucesso.', 'success');
        router.push('/admin');

      } catch (err) {
        console.error('Erro ao fazer login com Google:', err);
        let errorMessage = 'Erro ao fazer login com Google. Tente novamente.';
        if (err.response && err.response.data && err.response.data.error) {
          errorMessage = err.response.data.error;
        }
        this.error = errorMessage;
        toastStore.showToast('Erro de Login', errorMessage, 'error');

        this.authToken = null;
        this.user = null;
        localStorage.removeItem('adminAuthToken');
        localStorage.removeItem('adminUser');
      } finally {
        this.loading = false;
      }
    },

    // Ação para logout
    async logout() {
      const toastStore = useToastStore();
      this.loading = true;
      this.error = null;

      try {
        await signOut(auth); // Desloga do Firebase Client SDK

        // Limpa o estado de autenticação e o localStorage.
        this.authToken = null;
        this.user = null;
        localStorage.removeItem('adminAuthToken');
        localStorage.removeItem('adminUser');

        toastStore.showToast('Logout', 'Você foi desconectado.', 'info');
        router.push('/admin/login');

      } catch (err) {
        console.error('Erro ao fazer logout:', err);
        this.error = 'Erro ao fazer logout.';
        toastStore.showToast('Erro de Logout', 'Não foi possível desconectar.', 'error');
      } finally {
        this.loading = false;
      }
    },

    // Ação para inicializar o estado de autenticação ao carregar a aplicação.
    // Verifica se há um Custom Token no localStorage e tenta re-autenticar o usuário no Firebase Client SDK.
    async initializeAuth() {
      const storedToken = localStorage.getItem('adminAuthToken');

      if (storedToken) {
        this.authToken = storedToken;
        try {
          // Tenta assinar no Firebase Client SDK com o Custom Token salvo.
          // Isso irá popular 'auth.currentUser' se o token for válido.
          await signInWithCustomToken(auth, storedToken);
          // Obtém as informações do usuário e as claims de forma segura de 'auth.currentUser'.
          await this._updateUserInfoFromFirebase(auth.currentUser);
          console.log('Auth Store: Inicializado com token e user do localStorage. isAdmin:', this.user.isAdmin);
        } catch (err) {
          console.error('Erro ao re-autenticar com custom token:', err);
          // Se o token for inválido ou expirado, limpa a sessão.
          this.authToken = null;
          this.user = null;
          localStorage.removeItem('adminAuthToken');
          localStorage.removeItem('adminUser');
          // O interceptor do httpClient já deve lidar com o redirecionamento se uma rota protegida for acessada
        }
      } else {
        this.authToken = null;
        this.user = null;
        localStorage.removeItem('adminAuthToken');
        localStorage.removeItem('adminUser');
        console.log('Auth Store: Nenhum token/user no localStorage ou inconsistente. Limpando.');
      }
    }
  },
});
