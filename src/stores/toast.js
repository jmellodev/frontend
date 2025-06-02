// src/stores/toast.js
import { defineStore } from 'pinia';

export const useToastStore = defineStore('toast', {
  state: () => ({
    toast: {
      show: false,
      title: '',
      message: '',
      type: 'info', // 'success', 'error', 'info'
      timeoutId: null,
    },
  }),
  actions: {
    showToast(title, message, type = 'info', duration = 3000) {
      // Limpa qualquer toast anterior para evitar sobreposição
      if (this.toast.timeoutId) {
        clearTimeout(this.toast.timeoutId);
      }

      this.toast.show = true;
      this.toast.title = title;
      this.toast.message = message;
      this.toast.type = type;

      this.toast.timeoutId = setTimeout(() => {
        this.hideToast();
      }, duration);
    },
    hideToast() {
      this.toast.show = false;
      this.toast.title = '';
      this.toast.message = '';
      this.toast.type = 'info';
      if (this.toast.timeoutId) {
        clearTimeout(this.toast.timeoutId);
        this.toast.timeoutId = null;
      }
    },
  },
});
