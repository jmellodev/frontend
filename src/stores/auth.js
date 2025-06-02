// src/stores/auth.js
import { defineStore } from 'pinia';
import { auth, googleProvider } from '../firebase/firebaseClient';
import { signInWithPopup, signInWithEmailAndPassword, signOut, signInWithCustomToken } from 'firebase/auth'; // Importa signInWithCustomToken
import api from '../services/httpClient';
import router from '../router';
import { useToastStore } from './toast';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // O objeto 'user' agora conterá informações do usuário, mas 'isAdmin' será
    // populado de forma segura a partir das claims do ID Token.
    user: JSON.parse(localStorage.getItem('adminUser')) || null,
    authToken: localStorage.getItem('adminAuthToken') || null,
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.authToken && !!state.user,
    // O getter isAdmin agora verifica a propriedade 'isAdmin' do objeto 'user',
    // que será populada de forma segura a partir das claims do ID Token.
    isAdmin: (state) => state.user?.isAdmin || false,
  },

  actions: {
    // Função auxiliar para obter e atualizar as informações do usuário, incluindo claims
    async _updateUserInfoFromFirebase(firebaseUser) {
      if (!firebaseUser) {
        this.user = null;
        return;
      }
      // Força a atualização do ID Token para garantir que as claims mais recentes sejam obtidas
      const idTokenResult = await firebaseUser.getIdTokenResult(true);
      this.user = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        // Popula 'isAdmin' diretamente das claims do ID Token
        isAdmin: idTokenResult.claims.admin || false,
      };
      localStorage.setItem('adminUser', JSON.stringify(this.user));
      console.log('User info updated from Firebase ID Token claims:', this.user);
    },

    async loginWithEmail(email, password) {
      const toastStore = useToastStore();
      this.loading = true;
      this.error = null;

      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;
        const idToken = await firebaseUser.getIdToken();

        // Envia o ID Token para o backend para obter o Custom Token
        const response = await api.post(`/auth/login`, { idToken });

        this.authToken = response.data.customToken;
        localStorage.setItem('adminAuthToken', this.authToken);

        // Assina o usuário no Firebase Client SDK com o Custom Token recebido do backend.
        // Isso é crucial para que 'auth.currentUser' seja o usuário correto e suas claims sejam acessíveis.
        await signInWithCustomToken(auth, this.authToken);

        // Atualiza as informações do usuário no store a partir do Firebase (claims seguras)
        await this._updateUserInfoFromFirebase(auth.currentUser);

        toastStore.showToast('Sucesso!', 'Login realizado com sucesso.', 'success');
        router.push('/admin');

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

    async loginWithGoogle() {
      const toastStore = useToastStore();
      this.loading = true;
      this.error = null;

      try {
        const result = await signInWithPopup(auth, googleProvider);
        const firebaseUser = result.user;
        const idToken = await firebaseUser.getIdToken();

        // Envia o ID Token para o backend para obter o Custom Token
        const response = await api.post(`/auth/google`, { idToken });

        this.authToken = response.data.customToken;
        localStorage.setItem('adminAuthToken', this.authToken);

        // Assina o usuário no Firebase Client SDK com o Custom Token recebido do backend.
        await signInWithCustomToken(auth, this.authToken);

        // Atualiza as informações do usuário no store a partir do Firebase (claims seguras)
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

    async logout() {
      const toastStore = useToastStore();
      this.loading = true;
      this.error = null;

      try {
        await signOut(auth); // Desloga do Firebase Client SDK

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

    // Inicializa o estado de autenticação ao carregar a aplicação.
    // Agora, ele também usa o Custom Token para autenticar no Firebase Client SDK
    // e obter as claims de forma segura.
    async initializeAuth() {
      const storedToken = localStorage.getItem('adminAuthToken');
      const storedUser = localStorage.getItem('adminUser'); // Ainda carregamos para o caso de ter info básica

      if (storedToken) {
        this.authToken = storedToken;
        try {
          // Tenta assinar no Firebase Client SDK com o Custom Token salvo.
          // Isso irá popular auth.currentUser.
          await signInWithCustomToken(auth, storedToken);
          // Obtém as informações do usuário e as claims de forma segura
          await this._updateUserInfoFromFirebase(auth.currentUser);
          console.log('Auth Store: Inicializado com token e user do localStorage. isAdmin:', this.user.isAdmin);
        } catch (err) {
          console.error('Erro ao re-autenticar com custom token:', err);
          // Se o token for inválido ou expirado, limpa a sessão.
          this.authToken = null;
          this.user = null;
          localStorage.removeItem('adminAuthToken');
          localStorage.removeItem('adminUser');
          // Opcional: Redirecionar para login se o token salvo for inválido
          // if (router.currentRoute.value.meta.requiresAuth) {
          //   router.push('/admin/login');
          // }
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
