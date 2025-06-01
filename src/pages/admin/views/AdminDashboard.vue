<template>
  <AdminLayout>
    <div class="space-y-8 p-4 md:p-8 bg-white dark:bg-gray-900 rounded-lg shadow-xl">
      <div class="text-gray-700 dark:text-white flex flex-col items-start space-y-0">
        <span class="text-2xl font-bold">Dashboard Administrativo</span><small
          class="text-gray-500 dark:text-gray-400 text-xs">Visão geral e estatísticas da sua plataforma.</small>
      </div>

      <div v-if="isLoading" class="text-center py-12">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-400 mx-auto"></div>
        <p class="text-gray-400 mt-4 text-lg">Carregando dados do dashboard...</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-gray-700 dark:text-white">
        <div
          class="dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700/20 hover:scale-110 transition-all duration-300">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-semibold ">Visão Geral de Pedidos</h3>
            <i class="fa-duotone fa-receipt text-blue-400 text-3xl"></i>
          </div>
          <div class="space-y-2">
            <p><strong>Total de Pedidos:</strong> <span class="text-lg">{{ dashboardData.totalOrders
            }}</span></p>
            <p><strong>Pedidos Finalizados:</strong> <span class="text-green-400 text-lg">{{
              dashboardData.completedOrders }}</span></p>
            <p><strong>Pedidos Pendentes:</strong> <span class="text-yellow-400 text-lg">{{ dashboardData.pendingOrders
            }}</span></p>
            <p><strong>Receita Total:</strong> <span class=" text-lg">{{
              $formatPrice(dashboardData.totalRevenue) }}</span></p>
          </div>
        </div>

        <div
          class="dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700/20 hover:scale-110 transition-all duration-300">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-semibold ">Resumo de Produtos</h3>
            <i class="fa-duotone fa-box-open text-orange-600 text-3xl"></i>
          </div>
          <div class="space-y-2 ">
            <p><strong>Total de Produtos:</strong> <span class="text-lg">{{ dashboardData.totalProducts
            }}</span></p>
            <p><strong>Total de Categorias:</strong> <span class="text-lg">{{ dashboardData.totalCategories
            }}</span></p>
            <p><strong>Produtos Mais Vendidos:</strong></p>
            <ul class="list-disc list-inside ml-4">
              <li v-for="(product, index) in dashboardData.topSellingProducts" :key="index" class="text-sm">
                {{ product.name }} ({{ product.sales }} vendas)
              </li>
              <li v-if="dashboardData.topSellingProducts.length === 0" class="text-sm italic">Nenhum produto mais
                vendido.</li>
            </ul>
          </div>
        </div>

        <div
          class="dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700/20 hover:scale-110 transition-all duration-300">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-semibold">Resumo de Clientes</h3>
            <i class="fa-duotone fa-users text-pink-400 text-3xl"></i>
          </div>
          <div class="space-y-2">
            <p><strong>Total de Clientes:</strong> <span class="text-lg">{{ dashboardData.totalClients
            }}</span></p>
            <p><strong>Novos Clientes (Últimos 30 dias):</strong> <span class="text-lg">{{
              dashboardData.newClientsLast30Days }}</span></p>
            <p><strong>Clientes Mais Ativos:</strong></p>
            <ul class="list-disc list-inside ml-4">
              <li v-for="(client, index) in dashboardData.mostActiveClients" :key="index" class="text-sm">
                {{ client.name }} ({{ client.orders }} pedidos)
              </li>
              <li v-if="dashboardData.mostActiveClients.length === 0" class="text-sm italic">Nenhum cliente ativo.</li>
            </ul>
          </div>
        </div>

        <div
          class="dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700/20 hover:scale-110 transition-all duration-300">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-semibold">Estatísticas de Entrega</h3>
            <i class="fa-duotone fa-truck text-orange-400 text-3xl"></i>
          </div>
          <div class="space-y-2">
            <p><strong>Pedidos para Delivery:</strong> <span class="text-lg">{{ dashboardData.deliveryOrders
            }}</span></p>
            <p><strong>Pedidos para Retirada:</strong> <span class="text-lg">{{ dashboardData.pickupOrders
            }}</span></p>
            <p><strong>Taxa Média de Entrega:</strong> <span class="text-lg">{{
              $formatPrice(dashboardData.averageDeliveryFee) }}</span></p>
          </div>
        </div>

        <div
          class="dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700/20 hover:scale-110 transition-all duration-300">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-semibold">Resumo de Pagamentos</h3>
            <i class="fa-duotone fa-credit-card text-teal-400 text-3xl"></i>
          </div>
          <div class="space-y-2">
            <p><strong>Pagamentos Pix:</strong> <span class="text-lg">{{
              $formatPrice(dashboardData.pixPayments) }}</span></p>
            <p><strong>Pagamentos Cartão:</strong> <span class="text-lg">{{
              $formatPrice(dashboardData.cardPayments) }}</span></p>
            <p><strong>Pagamentos Dinheiro:</strong> <span class="text-lg">{{
              $formatPrice(dashboardData.cashPayments) }}</span></p>
          </div>
        </div>

      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AdminLayout from '@/layouts/AdminLayout.vue';
import api from '@/services/httpClient';

const isLoading = ref(true);
const dashboardData = ref({
  totalOrders: 0,
  completedOrders: 0,
  pendingOrders: 0,
  totalRevenue: 0,
  totalProducts: 0,
  totalCategories: 0,
  topSellingProducts: [], // Ex: [{ name: 'Pizza Calabresa', sales: 120 }]
  totalClients: 0,
  newClientsLast30Days: 0,
  mostActiveClients: [], // Ex: [{ name: 'João Silva', orders: 15 }]
  deliveryOrders: 0,
  pickupOrders: 0,
  averageDeliveryFee: 0,
  pixPayments: 0,
  cardPayments: 0,
  cashPayments: 0,
});

async function fetchDashboardData() {
  isLoading.value = true;
  try {
    // TODO: Implementar este endpoint no seu backend para retornar os dados do dashboard
    // Exemplo de como a API poderia ser chamada:
    const response = await api.get('/dashboard');

    // Mock de dados para demonstração. Substitua pela lógica real da sua API.
    dashboardData.value = {
      totalOrders: response.data.totalOrders || 1234,
      completedOrders: response.data.completedOrders || 980,
      pendingOrders: response.data.pendingOrders || 150,
      totalRevenue: response.data.totalRevenue || 75000.50,
      totalProducts: response.data.totalProducts || 55,
      totalCategories: response.data.totalCategories || 12,
      topSellingProducts: response.data.topSellingProducts || [
        { name: 'Pizza de Calabresa', sales: 120 },
        { name: 'Coca-Cola 2L', sales: 90 },
        { name: 'Pizza de Chocolate', sales: 75 },
      ],
      totalClients: response.data.totalClients || 800,
      newClientsLast30Days: response.data.newClientsLast30Days || 45,
      mostActiveClients: response.data.mostActiveClients || [
        { name: 'Ana Souza', orders: 15 },
        { name: 'Carlos Lima', orders: 12 },
      ],
      deliveryOrders: response.data.deliveryOrders || 850,
      pickupOrders: response.data.pickupOrders || 384,
      averageDeliveryFee: response.data.averageDeliveryFee || 7.50,
      pixPayments: response.data.pixPayments || 30000.00,
      cardPayments: response.data.cardPayments || 40000.00,
      cashPayments: response.data.cashPayments || 5000.50,
    };

    console.log('Dados do dashboard carregados:', dashboardData.value);

  } catch (error) {
    console.error('Erro ao carregar dados do dashboard:', error.response?.data || error.message);
    // TODO: Exibir uma mensagem de erro amigável para o usuário
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  fetchDashboardData();
});
</script>
