<template>
  <AdminLayout>
    <div class="space-y-6 p-4 md:p-8 bg-white dark:bg-gray-900 rounded-lg shadow-xl">
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white">Gerenciamento de Usuários</h2>
      <p class="text-gray-600 dark:text-gray-400">Visualize e gerencie as permissões de administrador dos usuários.</p>

      <div v-if="isLoading" class="text-center py-8">
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
import api from '@/services/httpClient'; // Seu cliente Axios configurado
import { useToastStore } from '@/stores/toast'; // Para notificações toast

const users = ref([]);
const isLoading = ref(true);
const showConfirmModal = ref(false);
const userToActOn = ref(null); // Usuário selecionado para promover/rebaixar
const actionType = ref(''); // 'promote' ou 'demote'
const isProcessingAction = ref(false); // Estado para o botão do modal de confirmação

// Paginação
const currentPage = ref(1);
const pageSize = ref(10);
const totalItems = ref(0);

const toastStore = useToastStore(); // Instância do store de toast

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return users.value.slice(start, start + pageSize.value);
});

const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value));

// Função para carregar a lista de usuários do backend
async function loadUsers() {
  isLoading.value = true;
  try {
    // Endpoint para listar usuários que você criou no backend
    const response = await api.get('/admin/manage-users/users');
    users.value = response.data;
    totalItems.value = users.value.length;
    // Ajusta a página atual se ela exceder o total de páginas após o carregamento
    if (currentPage.value > totalPages.value && totalPages.value > 0) {
      currentPage.value = totalPages.value;
    } else if (totalPages.value === 0) {
      currentPage.value = 1;
    }
  } catch (error) {
    console.error('Erro ao carregar usuários:', error.response?.data || error.message);
    toastStore.showToast('Erro', 'Não foi possível carregar os usuários.', 'error');
  } finally {
    isLoading.value = false;
  }
}

// Classe dinâmica para o badge de status de admin
const getAdminStatusBadgeClass = (isAdmin) => {
  return isAdmin
    ? 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold dark:bg-green-700 dark:text-green-100'
    : 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-semibold dark:bg-red-700 dark:text-red-100';
};

// Abre o modal de confirmação para promover/rebaixar
function confirmAction(user, type) {
  userToActOn.value = user;
  actionType.value = type;
  showConfirmModal.value = true;
}

// Fecha o modal de confirmação
function closeConfirmModal() {
  userToActOn.value = null;
  actionType.value = '';
  showConfirmModal.value = false;
}

// Executa a ação de promover ou rebaixar após a confirmação
async function executeAction() {
  if (!userToActOn.value || !actionType.value) return;

  isProcessingAction.value = true;
  try {
    const endpoint = actionType.value === 'promote' ? '/admin/manage-users/promote' : '/admin/manage-users/demote';
    const message = actionType.value === 'promote' ? 'promovido' : 'rebaixado';

    await api.post(endpoint, { email: userToActOn.value.email });

    toastStore.showToast('Sucesso!', `Usuário ${userToActOn.value.email} foi ${message} com sucesso.`, 'success');
    closeConfirmModal();
    await loadUsers(); // Recarrega a lista para refletir as mudanças
  } catch (error) {
    console.error(`Erro ao ${actionType.value} usuário:`, error.response?.data || error.message);
    toastStore.showToast('Erro', `Não foi possível ${actionType.value} o usuário.`, 'error');
  } finally {
    isProcessingAction.value = false;
  }
}

// Reseta a página para 1 quando o tamanho da página é alterado
watch(pageSize, () => {
  currentPage.value = 1;
});

onMounted(() => {
  loadUsers();
});
</script>
