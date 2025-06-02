<template>
  <AdminLayout>
    <div class="space-y-6 p-4 md:p-8 bg-white dark:bg-gray-900 rounded-lg shadow-xl">
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white">Gerenciamento de Usuários</h2>
      <p class="text-gray-600 dark:text-gray-400">Visualize e gerencie as permissões de administrador dos usuários.</p>

      <div v-if="!authStore.isAuthenticated || !authStore.isAdmin"
        class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <span class="block sm:inline">Você não tem permissão para acessar esta área ou sua sessão expirou. Por favor,
          faça login como administrador.</span>
      </div>

      <div v-else-if="isLoading" class="text-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-400 dark:border-gray-600 mx-auto"></div>
        <p class="text-gray-600 dark:text-gray-400 mt-4">Carregando usuários...</p>
      </div>

      <div v-else-if="users.length === 0" class="text-center py-8">
        <p class="text-gray-600 dark:text-gray-400 text-lg">Nenhum usuário encontrado.</p>
      </div>

      <div v-else class="overflow-x-auto mt-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <table class="min-w-full table-auto bg-gray-100 dark:bg-gray-800">
          <thead>
            <tr class="bg-gray-200 dark:bg-gray-700">
              <th class="py-3 px-6 text-left text-gray-700 dark:text-gray-300 uppercase text-sm leading-normal">Email
              </th>
              <th class="py-3 px-6 text-left text-gray-700 dark:text-gray-300 uppercase text-sm leading-normal">Nome
              </th>
              <th class="py-3 px-6 text-left text-gray-700 dark:text-gray-300 uppercase text-sm leading-normal">Admin
              </th>
              <th class="py-3 px-6 text-left text-gray-700 dark:text-gray-300 uppercase text-sm leading-normal">Ações
              </th>
            </tr>
          </thead>
          <tbody class="text-gray-800 dark:text-gray-200 text-sm font-light">
            <tr v-for="user in paginatedUsers" :key="user.uid"
              class="border-b border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700">
              <td class="py-3 px-6 text-left whitespace-nowrap">{{ user.email }}</td>
              <td class="py-3 px-6 text-left">{{ user.displayName || 'N/A' }}</td>
              <td class="py-3 px-6 text-left">
                <span :class="getAdminStatusBadgeClass(user.isAdmin)">
                  {{ user.isAdmin ? 'Sim' : 'Não' }}
                </span>
              </td>
              <td class="py-3 px-6 text-left">
                <button v-if="!user.isAdmin" @click="confirmAction(user, 'promote')"
                  class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors duration-200 mr-2">
                  Promover
                </button>
                <button v-else @click="confirmAction(user, 'demote')"
                  class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-200">
                  Rebaixar
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div
          class="flex flex-col md:flex-row justify-between items-center mt-6 text-gray-900 dark:text-white p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <span class="mb-4 md:mb-0">Total de usuários: {{ totalItems }}</span>

          <div class="flex items-center gap-2">
            <label for="pageSize" class="text-sm text-gray-700 dark:text-gray-300">Usuários por página:</label>
            <div class="relative">
              <select id="pageSize" v-model.number="pageSize"
                class="appearance-none bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-400 dark:border-gray-600 rounded px-3 py-1 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option :value="5">5</option>
                <option :value="10">10</option>
                <option :value="25">25</option>
              </select>
              <div
                class="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-800 dark:text-white">
                ▼
              </div>
            </div>

            <button @click="currentPage--" :disabled="currentPage === 1"
              class="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
              &lt; Anterior
            </button>
            <span class="px-2">Página {{ currentPage }} de {{ totalPages }}</span>
            <button @click="currentPage++" :disabled="currentPage >= totalPages"
              class="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
              Próximo &gt;
            </button>
          </div>
        </div>
      </div>
    </div>

    <BaseModal v-model:open="showConfirmModal">
      <div class="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl text-gray-900 dark:text-white relative">
        <button @click="closeConfirmModal"
          class="absolute top-3 right-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-xl">
          &times;
        </button>
        <p class="text-lg mb-4">
          Tem certeza que deseja {{ actionType === 'promote' ? 'promover' : 'rebaixar' }} o usuário
          <strong
            :class="actionType === 'promote' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
            {{ userToActOn?.email }}
          </strong>?
        </p>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Esta ação exigirá que o usuário faça login novamente para que as alterações de permissão entrem em vigor.
        </p>
        <div class="mt-6 flex justify-end gap-3">
          <button @click="executeAction" :disabled="isProcessingAction"
            :class="actionType === 'promote' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'"
            class="px-5 py-2 text-white font-semibold rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
            <span v-if="isProcessingAction">Processando...</span>
            <span v-else>{{ actionType === 'promote' ? 'Confirmar Promoção' : 'Confirmar Rebaixamento' }}</span>
          </button>
          <button @click="closeConfirmModal" :disabled="isProcessingAction"
            class="px-5 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
            Cancelar
          </button>
        </div>
      </div>
    </BaseModal>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import AdminLayout from '@/layouts/AdminLayout.vue';
import BaseModal from '@/components/modals/BaseModal.vue';
import api from '@/services/httpClient';
import { useToastStore } from '@/stores/toast';
import { useAuthStore } from '@/stores/auth';

const users = ref([]);
const isLoading = ref(true);
const showConfirmModal = ref(false);
const userToActOn = ref(null);
const actionType = ref('');
const isProcessingAction = ref(false);

const currentPage = ref(1);
const pageSize = ref(10);
const totalItems = ref(0);

const toastStore = useToastStore();
const authStore = useAuthStore();

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return users.value.slice(start, start + pageSize.value);
});

const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value));

const getAdminStatusBadgeClass = (isAdmin) => {
  return isAdmin
    ? 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold dark:bg-green-700 dark:text-green-100'
    : 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-semibold dark:bg-red-700 dark:text-red-100';
};

function confirmAction(user, type) {
  userToActOn.value = user;
  actionType.value = type;
  showConfirmModal.value = true;
}

function closeConfirmModal() {
  userToActOn.value = null;
  actionType.value = '';
  showConfirmModal.value = false;
}

async function executeAction() {
  if (!userToActOn.value || !actionType.value) return;

  isProcessingAction.value = true;
  try {
    const endpoint = actionType.value === 'promote' ? '/admin/manage-users/promote' : '/admin/manage-users/demote';
    const message = actionType.value === 'promote' ? 'promovido' : 'rebaixado';

    await api.post(endpoint, { email: userToActOn.value.email });

    toastStore.showToast('Sucesso!', `Usuário ${userToActOn.value.email} foi ${message} com sucesso. Ele precisará fazer login novamente.`, 'success', 5000);
    closeConfirmModal();
    await loadUsers(); // Recarrega a lista para refletir as mudanças
  } catch (error) {
    console.error(`Erro ao ${actionType.value} usuário:`, error.response?.data || error.message);
    toastStore.showToast('Erro', `Não foi possível ${actionType.value} o usuário: ${error.response?.data?.error || error.message}`, 'error', 5000);
  } finally {
    isProcessingAction.value = false;
  }
}

async function loadUsers() {
  // Apenas tenta carregar usuários se o usuário estiver autenticado e for admin
  if (!authStore.isAuthenticated || !authStore.isAdmin) {
    isLoading.value = false;
    console.warn('Não autenticado ou não é admin. Não carregando usuários.');
    // O router.beforeEach já deve redirecionar, mas esta é uma camada extra
    return;
  }

  isLoading.value = true;
  try {
    console.log("Tentando carregar usuários da API...");
    const response = await api.get('/admin/manage-users/users');
    console.log("Usuários recebidos:", response.data);
    users.value = response.data;
    totalItems.value = users.value.length;
    if (currentPage.value > totalPages.value && totalPages.value > 0) {
      currentPage.value = totalPages.value;
    } else if (totalPages.value === 0) {
      currentPage.value = 1;
    }
  } catch (error) {
    console.error('Erro ao carregar usuários:', error.response?.data || error.message);
    // O interceptor do httpClient já lida com 401/403, mas para outros erros, mostramos toast
    if (error.response?.status !== 401 && error.response?.status !== 403) {
      toastStore.showToast('Erro', 'Não foi possível carregar os usuários.', 'error');
    }
  } finally {
    isLoading.value = false;
  }
}

watch(pageSize, () => {
  currentPage.value = 1;
});

// Ao montar, espera que o authStore esteja pronto antes de tentar carregar usuários
onMounted(async () => {
  // Garante que o authStore esteja inicializado e o isAdmin esteja populado
  // Isso é importante porque o onMounted pode ser chamado antes do router.beforeEach
  // ter tido a chance de inicializar completamente o authStore.
  if (!authStore.isAuthenticated && !authStore.loading) {
    console.log("ManageUsers: onMounted - authStore não inicializado, chamando initializeAuth...");
    await authStore.initializeAuth();
  }

  // Agora que o authStore deve estar pronto, tentamos carregar os usuários
  console.log("ManageUsers: onMounted - Chamando loadUsers...");
  loadUsers();
});
</script>

<style scoped>
/* Estilos específicos para este componente, se necessário */
</style>
