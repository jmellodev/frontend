<template>
  <AdminLayout>
    <div class="space-y-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-700 dark:text-white">
            Gerenciar Entregadores
          </h2>
          <p class="text-gray-600 dark:text-gray-400 text-xs font-normal italic">
            Visualize, aprove e gerencie o cadastro de entregadores.
          </p>
        </div>
        <button @click="openAddModal"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200">
          <i class="fa-solid fa-plus mr-2"></i> Adicionar Entregador
        </button>
      </div>

      <div v-if="isLoading" class="text-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-400 dark:border-gray-600 mx-auto"></div>
        <p class="text-gray-600 dark:text-gray-400 mt-4">Carregando entregadores...</p>
      </div>

      <div v-else-if="deliveryMen.length === 0" class="text-center py-8">
        <p class="text-gray-600 dark:text-gray-400 text-lg">Nenhum entregador encontrado.</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Foto</th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Nome</th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Email</th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Telefone</th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status</th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Veículo</th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Ações</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="dm in deliveryMen" :key="dm.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <img :src="dm.photo_url || '/assets/image/placeholder-user.png'"
                  class="h-10 w-10 rounded-full object-cover border border-gray-300 dark:border-gray-600"
                  alt="Foto Entregador">
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{{ dm.name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{{ dm.email }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{{ dm.phone || 'N/A' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusBadgeClass(dm.status)">
                  {{ formatText(dm.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{{ dm.vehicle_type ||
                'N/A' }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button @click="openEditModal(dm)"
                  class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-600 mr-3"
                  title="Editar">
                  <i class="fa-solid fa-edit"></i>
                </button>
                <button v-if="dm.status !== 'approved'" @click="approveDeliveryMan(dm.id)"
                  class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-600 mr-3"
                  title="Aprovar">
                  <i class="fa-solid fa-check-circle"></i>
                </button>
                <button @click="confirmDelete(dm)"
                  class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-600" title="Excluir">
                  <i class="fa-solid fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="errorMessage"
        class="bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded relative">
        <strong class="font-bold">Erro!</strong>
        <span class="block sm:inline"> {{ errorMessage }}</span>
      </div>
    </div>

    <BaseModal v-if="showModal" v-model:open="showModal">
      <div class="text-gray-900 dark:text-white relative p-4">
        <button @click="closeModal"
          class="absolute -top-3 -right-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-xl">
          &times;
        </button>
        <h3 class="text-2xl font-bold mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
          {{ isEditing ? 'Editar Entregador' : 'Adicionar Entregador' }}
        </h3>

        <form @submit.prevent="isEditing ? updateDeliveryMan() : addDeliveryMan()">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome</label>
              <input type="text" id="name" v-model="currentDeliveryMan.name" required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            </div>
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <input type="email" id="email" v-model="currentDeliveryMan.email" required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            </div>
            <div>
              <label for="phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Telefone</label>
              <input type="tel" id="phone" v-model="currentDeliveryMan.phone"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            </div>
            <div>
              <label for="vehicle_type" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipo de
                Veículo</label>
              <select id="vehicle_type" v-model="currentDeliveryMan.vehicle_type"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <option value="">Selecione</option>
                <option value="moto">Moto</option>
                <option value="carro">Carro</option>
                <option value="bicicleta">Bicicleta</option>
                <option value="a_pe">A Pé</option>
              </select>
            </div>
            <div class="col-span-full">
              <label for="photo_url" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Foto</label>
              <input type="file" id="photo_url" @change="handlePhotoUpload" accept="image/*"
                class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-800 dark:file:text-blue-200 dark:hover:file:bg-blue-700">
              <div v-if="currentDeliveryMan.photo_url" class="mt-2">
                <img :src="currentDeliveryMan.photo_url"
                  class="h-20 w-20 rounded-full object-cover border border-gray-300 dark:border-gray-600"
                  alt="Foto atual">
              </div>
            </div>
            <div v-if="isEditing" class="col-span-full">
              <label for="status" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
              <select id="status" v-model="currentDeliveryMan.status"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <option value="pending">Pendente</option>
                <option value="approved">Aprovado</option>
                <option value="rejected">Rejeitado</option>
                <option value="inactive">Inativo</option>
              </select>
            </div>
          </div>

          <div class="mt-6 flex justify-end space-x-3">
            <button type="button" @click="closeModal"
              class="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors duration-200">
              Cancelar
            </button>
            <button type="submit" :disabled="isSaving"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
              {{ isSaving ? 'Salvando...' : (isEditing ? 'Salvar Alterações' : 'Adicionar Entregador') }}
            </button>
          </div>
        </form>
      </div>
    </BaseModal>

    <BaseModal v-if="showDeleteConfirm" v-model:open="showDeleteConfirm">
      <div class="text-gray-900 dark:text-white relative p-4 text-center">
        <button @click="showDeleteConfirm = false"
          class="absolute -top-3 -right-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-xl">
          &times;
        </button>
        <h3 class="text-xl font-bold mb-4">Confirmar Exclusão</h3>
        <p class="mb-6">Tem certeza que deseja excluir o entregador <span class="font-semibold">{{
          deliveryManToDelete?.name }}</span>?</p>
        <div class="flex justify-center space-x-4">
          <button @click="showDeleteConfirm = false"
            class="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors duration-200">
            Cancelar
          </button>
          <button @click="deleteDeliveryMan()" :disabled="isDeleting"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
            {{ isDeleting ? 'Excluindo...' : 'Excluir' }}
          </button>
        </div>
      </div>
    </BaseModal>

    <div v-if="successMessage"
      class="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg transition-all duration-300 ease-in-out transform"
      :class="{ 'translate-x-0 opacity-100': successMessage, 'translate-x-full opacity-0': !successMessage }">
      {{ successMessage }}
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AdminLayout from '@/layouts/AdminLayout.vue';
import BaseModal from '@/components/modals/BaseModal.vue';
import api from '@/services/httpClient'; // Seu cliente HTTP configurado com interceptor

// Reativos
const deliveryMen = ref([]);
const isLoading = ref(true);
const errorMessage = ref('');
const successMessage = ref('');

const showModal = ref(false);
const isEditing = ref(false);
const currentDeliveryMan = ref({
  id: null,
  name: '',
  email: '',
  phone: '',
  vehicle_type: '',
  photo_url: '',
  status: 'pending' // Default para novos
});
const photoFile = ref(null); // Para o arquivo de foto a ser enviado
const isSaving = ref(false);

const showDeleteConfirm = ref(false);
const deliveryManToDelete = ref(null);
const isDeleting = ref(false);

// Métodos de Formatação/Estilo
const formatText = (text) => {
  if (!text) return '';
  let formattedText = text.replace(/_/g, ' ');
  return formattedText.charAt(0).toUpperCase() + formattedText.slice(1);
};

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'pending':
      return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200';
    case 'approved':
      return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200';
    case 'rejected':
      return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200';
    case 'inactive':
      return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    default:
      return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200';
  }
};

// Funções de Gerenciamento
const fetchDeliveryMen = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  try {
    const response = await api.get('/delivery-men');
    deliveryMen.value = response.data;
  } catch (error) {
    console.error('Erro ao buscar entregadores:', error);
    errorMessage.value = 'Falha ao carregar entregadores. ' + (error.response?.data?.error || error.message);
  } finally {
    isLoading.value = false;
  }
};

const openAddModal = () => {
  isEditing.value = false;
  currentDeliveryMan.value = {
    id: null,
    name: '',
    email: '',
    phone: '',
    vehicle_type: '',
    photo_url: '',
    status: 'pending'
  };
  photoFile.value = null;
  showModal.value = true;
};

const openEditModal = (dm) => {
  isEditing.value = true;
  // Faz uma cópia profunda para não modificar o objeto original diretamente
  currentDeliveryMan.value = JSON.parse(JSON.stringify(dm));
  photoFile.value = null;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  isSaving.value = false; // Resetar estado de salvamento
  errorMessage.value = ''; // Limpar mensagens de erro do modal
};

const handlePhotoUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    photoFile.value = file;
    // Pré-visualização da imagem
    const reader = new FileReader();
    reader.onload = (e) => {
      currentDeliveryMan.value.photo_url = e.target.result;
    };
    reader.readAsDataURL(file);
  } else {
    photoFile.value = null;
    if (!currentDeliveryMan.value.id) { // Se não estiver editando, limpa a URL se nenhum arquivo for selecionado
      currentDeliveryMan.value.photo_url = '';
    }
  }
};

const uploadPhoto = async (deliveryManId) => {
  if (!photoFile.value) {
    return null; // Não há foto para enviar
  }

  const formData = new FormData();
  formData.append('photo', photoFile.value);

  try {
    const response = await api.post(`/delivery-men/${deliveryManId}/upload-photo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.photo_url;
  } catch (error) {
    console.error('Erro ao fazer upload da foto:', error);
    errorMessage.value = 'Falha ao fazer upload da foto. ' + (error.response?.data?.error || error.message);
    return null;
  }
};


const addDeliveryMan = async () => {
  isSaving.value = true;
  errorMessage.value = '';
  try {
    // Primeiro, registra o entregador sem a foto
    const response = await api.post('/delivery-men', {
      name: currentDeliveryMan.value.name,
      email: currentDeliveryMan.value.email,
      phone: currentDeliveryMan.value.phone,
      vehicle_type: currentDeliveryMan.value.vehicle_type,
      status: currentDeliveryMan.value.status,
    });

    const newDeliveryMan = response.data;

    // Se houver uma foto, faz o upload separadamente
    if (photoFile.value) {
      const photoUrl = await uploadPhoto(newDeliveryMan.id);
      if (photoUrl) {
        newDeliveryMan.photo_url = photoUrl;
        // Atualiza o entregador com a URL da foto, se o upload for bem-sucedido
        await api.put(`/delivery-men/${newDeliveryMan.id}`, { photo_url: photoUrl });
      }
    }

    showSuccessMessage('Entregador adicionado com sucesso!');
    closeModal();
    fetchDeliveryMen(); // Recarrega a lista
  } catch (error) {
    console.error('Erro ao adicionar entregador:', error);
    errorMessage.value = 'Falha ao adicionar entregador. ' + (error.response?.data?.error || error.message);
  } finally {
    isSaving.value = false;
  }
};

const updateDeliveryMan = async () => {
  isSaving.value = true;
  errorMessage.value = '';
  try {
    const deliveryManId = currentDeliveryMan.value.id;
    const updateData = {
      name: currentDeliveryMan.value.name,
      email: currentDeliveryMan.value.email,
      phone: currentDeliveryMan.value.phone,
      vehicle_type: currentDeliveryMan.value.vehicle_type,
      status: currentDeliveryMan.value.status,
    };

    // Faz o upload da foto primeiro se houver uma nova
    if (photoFile.value) {
      const photoUrl = await uploadPhoto(deliveryManId);
      if (photoUrl) {
        updateData.photo_url = photoUrl;
      }
    } else if (currentDeliveryMan.value.photo_url === '') {
      // Se a foto foi removida manualmente (URL vazia), define como null
      updateData.photo_url = null;
    }

    await api.put(`/delivery-men/${deliveryManId}`, updateData);

    showSuccessMessage('Entregador atualizado com sucesso!');
    closeModal();
    fetchDeliveryMen(); // Recarrega a lista
  } catch (error) {
    console.error('Erro ao atualizar entregador:', error);
    errorMessage.value = 'Falha ao atualizar entregador. ' + (error.response?.data?.error || error.message);
  } finally {
    isSaving.value = false;
  }
};

const approveDeliveryMan = async (id) => {
  if (!confirm('Tem certeza que deseja aprovar este entregador?')) {
    return;
  }
  errorMessage.value = '';
  try {
    await api.put(`/delivery-men/${id}`, { status: 'approved' });
    showSuccessMessage('Entregador aprovado com sucesso!');
    fetchDeliveryMen(); // Recarrega a lista
  } catch (error) {
    console.error('Erro ao aprovar entregador:', error);
    errorMessage.value = 'Falha ao aprovar entregador. ' + (error.response?.data?.error || error.message);
  }
};

const confirmDelete = (dm) => {
  deliveryManToDelete.value = dm;
  showDeleteConfirm.value = true;
};

const deleteDeliveryMan = async () => {
  if (!deliveryManToDelete.value) return;

  isDeleting.value = true;
  errorMessage.value = '';
  try {
    await api.delete(`/delivery-men/${deliveryManToDelete.value.id}`);
    showSuccessMessage('Entregador excluído com sucesso!');
    showDeleteConfirm.value = false;
    fetchDeliveryMen(); // Recarrega a lista
  } catch (error) {
    console.error('Erro ao excluir entregador:', error);
    errorMessage.value = 'Falha ao excluir entregador. ' + (error.response?.data?.error || error.message);
  } finally {
    isDeleting.value = false;
  }
};

const showSuccessMessage = (message) => {
  successMessage.value = message;
  setTimeout(() => {
    successMessage.value = null;
  }, 3000);
};

onMounted(() => {
  fetchDeliveryMen();
});
</script>

<style scoped>
/* Estilos específicos para o componente, se necessário */
</style>
