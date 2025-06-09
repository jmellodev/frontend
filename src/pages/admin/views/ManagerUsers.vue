<template>
  <div>
    <AdminLayout>
      <div class="space-y-6 p-4 md:p-4 bg-white dark:bg-gray-900 rounded-lg shadow-xl">
        <h2 class="md:text-2xl font-semibold text-gray-700 dark:text-white">
          <i class="fa-duotone fa-users"></i> Gerenciamento de usuários
          <p class="text-xs font-normal text-gray-600 dark:text-gray-400 text-nowrap">
            Visualize e gerencie as permissões de administrador dos usuários.
          </p>
        </h2>

        <div v-if="!authStore.isAuthenticated || !authStore.isAdmin"
          class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span class="block sm:inline">Você não tem permissão para acessar esta área ou sua sessão expirou.<br />Por
            favor,
            faça login como administrador.</span>
        </div>

        <div v-else-if="isLoading" class="text-center py-8">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-400 dark:border-gray-600 mx-auto">
          </div>
          <p class="text-gray-600 dark:text-gray-400 mt-4">Carregando usuários...</p>
        </div>

        <div v-else-if="users.length === 0" class="text-center py-8">
          <p class="text-gray-600 dark:text-gray-400 text-xs md:text-lg">Nenhum usuário encontrado.</p>
        </div>

        <div v-else
          class="mt-4 dark:border-gray-700 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <div
            class="rounded-lg shadow-md bg-white dark:bg-gray-800 p-4 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            v-for="user in paginatedUsers" :key="user.uid">
            <p class="font-semibold text-gray-800 dark:text-white">{{ user.displayName || 'Nome não informado' }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">{{ user.email }}</p>
            <p class="text-left mb-4">
              <span :class="getAdminStatusBadgeClass(user.isAdmin)">
                {{ user.isAdmin ? 'Administrador' : 'Usuário Comum' }}
              </span>
            </p>
            <div class="flex justify-end space-x-2">
              <button v-if="!user.isAdmin" @click="confirmAction(user, 'promote')"
                class="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm transition-colors duration-200">
                Promover
              </button>
              <button v-else @click="confirmAction(user, 'demote')"
                class="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm transition-colors duration-200">
                Rebaixar
              </button>
            </div>
          </div>
        </div>

        <!-- Nova Paginação Integrada -->
        <div
          class="flex flex-col md:flex-row justify-between items-center mt-6 text-gray-900 dark:text-white p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <span class="mb-4 md:mb-0 text-sm md:text-base">Total de usuários: {{ totalItems }}</span>

          <div class="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <!-- Usuários por página (Topo no mobile) -->
            <div class="flex items-center gap-2 mb-4 md:mb-0 w-full md:w-auto justify-center">
              <label for="pageSize" class="text-xs text-gray-700 dark:text-gray-300">Usuários por página:</label>
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
            </div>

            <!-- Controles de Paginação (Centro no mobile) -->
            <nav aria-label="Page navigation" class="w-full flex justify-center">
              <ul class="inline-flex -space-x-px text-sm rounded-md shadow-sm overflow-hidden">
                <li>
                  <a @click="goToPage(currentPage - 1)" :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
                    class="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white transition-colors duration-200">
                    Anterior
                  </a>
                </li>
                <li v-for="(page, index) in paginationPages" :key="index">
                  <span v-if="page === '...'"
                    class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">
                    ...
                  </span>
                  <a v-else @click="goToPage(page)" :class="{
                    'text-blue-600 border-blue-300 bg-blue-50 hover:bg-blue-100 dark:border-gray-700 dark:bg-gray-700 dark:text-white': page === currentPage,
                    'text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white': page !== currentPage
                  }"
                    class="flex items-center justify-center px-3 h-8 leading-tight border transition-colors duration-200">
                    {{ page }}
                  </a>
                </li>
                <li>
                  <a @click="goToPage(currentPage + 1)"
                    :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
                    class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white transition-colors duration-200">
                    Próximo
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </AdminLayout>

    <!-- Modal de Confirmação -->
    <BaseModal v-model:open="showConfirmModal">
      <div class="bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-6 rounded-lg shadow-xl relative">
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
  </div>
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
const pageSize = ref(2); // Mantendo o padrão em 2 para facilitar o teste de paginação
const totalItems = ref(0);

const toastStore = useToastStore();
const authStore = useAuthStore();

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return users.value.slice(start, start + pageSize.value);
});

const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value));

// Lógica para gerar os números de página visíveis com elipses
const paginationPages = computed(() => {
  const pages = [];
  const maxPagesToShow = 5;
  const half = Math.floor(maxPagesToShow / 2);

  if (totalPages.value <= maxPagesToShow) {
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i);
    }
  } else {
    // Sempre inclui a primeira página
    pages.push(1);

    let start = Math.max(2, currentPage.value - half);
    let end = Math.min(totalPages.value - 1, currentPage.value + half);

    if (currentPage.value - 1 < half) {
      end = maxPagesToShow - 1;
    }
    if (totalPages.value - currentPage.value < half) {
      start = totalPages.value - maxPagesToShow + 2;
    }

    if (start > 2) {
      pages.push('...');
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages.value - 1) {
      pages.push('...');
    }

    if (totalPages.value > 1 && !pages.includes(totalPages.value)) { // Garante que a última página é adicionada se ainda não estiver lá
      pages.push(totalPages.value);
    }
  }
  return [...new Set(pages)]; // Remove duplicatas, embora a lógica já tente evitar
});

const goToPage = (page) => {
  if (page === '...' || page < 1 || page > totalPages.value || page === currentPage.value) {
    return;
  }
  currentPage.value = page;
};

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
    await loadUsers();
  } catch (error) {
    console.error(`Erro ao ${actionType.value} usuário:`, error.response?.data || error.message);
    toastStore.showToast('Erro', `Não foi possível ${actionType.value} o usuário: ${error.response?.data?.error || error.message}`, 'error', 5000);
  } finally {
    isProcessingAction.value = false;
  }
}

async function loadUsers() {
  if (!authStore.isAuthenticated || !authStore.isAdmin) {
    isLoading.value = false;
    console.warn('Não autenticado ou não é admin. Não carregando usuários.');
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

onMounted(async () => {
  if (!authStore.isAuthenticated && !authStore.loading) {
    console.log("ManageUsers: onMounted - authStore não inicializado, chamando initializeAuth...");
    await authStore.initializeAuth();
  }
  console.log("ManageUsers: onMounted - Chamando loadUsers...");
  loadUsers();
});
</script>
