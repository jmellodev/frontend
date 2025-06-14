<template>
  <AdminLayout>
    <div class="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">Relatórios de Vendas</h2>

      <div class="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label for="reportType" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo de
            relatório:</label>
          <select id="reportType" v-model="selectedReportType" @change="resetDateInputs"
            class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
            <option value="daily">Diário</option>
            <option value="weekly">Semanal</option>
            <option value="monthly">Mensal</option>
            <option value="yearly">Anual</option>
          </select>
        </div>

        <div v-if="selectedReportType === 'daily'">
          <label for="dailyDate" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Selecione o
            Dia:</label>
          <input type="date" id="dailyDate" v-model="dailyDate"
            class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600" />
        </div>

        <div v-if="selectedReportType === 'weekly'">
          <label for="weeklyStartDate" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Data de
            Início da Semana:</label>
          <input type="date" id="weeklyStartDate" v-model="weeklyStartDate"
            class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600" />
        </div>

        <div v-if="selectedReportType === 'monthly'">
          <label for="monthlyYear" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ano:</label>
          <input type="number" id="monthlyYear" v-model="monthlyYear" placeholder="Ex: 2024"
            class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600" />
        </div>
        <div v-if="selectedReportType === 'monthly'">
          <label for="monthlyMonth" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mês:</label>
          <input type="number" id="monthlyMonth" v-model="monthlyMonth" placeholder="Ex: 6 (Junho)" min="1" max="12"
            class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600" />
        </div>

        <div v-if="selectedReportType === 'yearly'">
          <label for="yearlyYear" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ano:</label>
          <input type="number" id="yearlyYear" v-model="yearlyYear" placeholder="Ex: 2024"
            class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600" />
        </div>

        <div class="col-span-full md:col-span-1 flex items-end">
          <button @click="fetchReport" :disabled="loading"
            class="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50">
            {{ loading ? 'Carregando...' : 'Gerar Relatório' }}
          </button>
        </div>
      </div>

      <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
        role="alert">
        <strong class="font-bold">Erro!</strong>
        <span class="block sm:inline"> {{ error }}</span>
      </div>
      <div v-if="!loading && reportData && Object.keys(reportData).length === 0"
        class="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative mb-4" role="alert">
        <strong class="font-bold">Aviso!</strong>
        <span class="block sm:inline"> Nenhum dado encontrado para o período selecionado.</span>
      </div>

      <div v-if="reportData && Object.keys(reportData).length > 0 && !loading" class="mt-8">
        <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">Resumo do Relatório: <span
            class="font-normal">{{ reportData.period }}</span></h3>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div class="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
            <p class="text-gray-600 dark:text-gray-400 text-sm">Vendas Totais</p>
            <p class="text-2xl font-bold text-orange-600 dark:text-orange-400">{{ formatPrice(reportData.totalSales)
              }}
            </p>
          </div>
          <div v-if="reportData.salesCount !== undefined" class="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
            <p class="text-gray-600 dark:text-gray-400 text-sm">Quantidade de Pedidos</p>
            <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ reportData.salesCount }}</p>
          </div>
        </div>

        <div v-if="showCharts" class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div v-if="chartDataPaymentType.labels.length > 0"
            class="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
            <h4 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">Vendas por Tipo de Pagamento</h4>
            <div class="h-64">
              <BarChart :data="chartDataPaymentType" :options="chartOptions" :key="reportData.period + '-payment'" />
            </div>
          </div>

          <div v-if="chartDataDeliveryType.labels.length > 0"
            class="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
            <h4 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">Vendas por Tipo de Entrega</h4>
            <div class="h-64">
              <PieChart :data="chartDataDeliveryType" :options="chartOptions" :key="reportData.period + '-delivery'" />
            </div>
          </div>

          <div v-if="selectedReportType === 'weekly' && chartDataByDay.labels.length > 0"
            class="mt-6 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
            <h4 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">Vendas por Dia da Semana:</h4>
            <div class="h-64">
              <BarChart :data="chartDataByDay" :options="chartOptions" :key="reportData.period + '-day'" />
            </div>
          </div>

          <div v-if="selectedReportType === 'monthly' && chartDataByDayOfMonth.labels.length > 0"
            class="mt-6 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
            <h4 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">Vendas por Dia do Mês:</h4>
            <div class="h-64">
              <LineChart :data="chartDataByDayOfMonth" :options="chartOptions" :key="reportData.period + '-daymonth'" />
            </div>
          </div>

          <div v-if="selectedReportType === 'yearly' && chartDataByMonth.labels.length > 0"
            class="mt-6 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
            <h4 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">Vendas por Mês:</h4>
            <div class="h-64">
              <LineChart :data="chartDataByMonth" :options="chartOptions" :key="reportData.period + '-month'" />
            </div>
          </div>
        </div>
        <div v-if="selectedReportType === 'daily' && reportData.details?.orders?.length">
          <h4 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">Pedidos Detalhados:</h4>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    ID do Pedido
                  </th>
                  <th scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Valor Total
                  </th>
                  <th scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Pagamento
                  </th>
                  <th scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Entrega
                  </th>
                  <th scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Data/Hora
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="order in reportData.details.orders" :key="order.orderId">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                    {{ order.orderId }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                    {{ order.customerName }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                    {{ formatPrice(order.totalValue) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200 capitalize">
                    {{ order.paymentMethod }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200 capitalize">
                    {{ order.deliveryType }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                    {{ order.created_at }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-if="reportData.details?.byPaymentType && Object.keys(reportData.details.byPaymentType).length > 0"
          class="mt-6">
          <h4 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">Vendas por tipo de pagamento:</h4>
          <ul class="list-disc pl-5 text-gray-900 dark:text-gray-200">
            <li v-for="(value, type) in reportData.details.byPaymentType" :key="type">
              {{ type }}: <span class="font-medium">{{ formatPrice(value) }}</span>
            </li>
          </ul>
        </div>

        <div v-if="reportData.details?.byDeliveryType && Object.keys(reportData.details.byDeliveryType).length > 0"
          class="mt-6">
          <h4 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">Vendas por tipo de entrega:</h4>
          <ul class="list-disc pl-5 text-gray-900 dark:text-gray-200">
            <li v-for="(value, type) in reportData.details.byDeliveryType" :key="type">
              {{ type }}: <span class="font-medium">{{ formatPrice(value) }}</span>
            </li>
          </ul>
        </div>

        <div
          v-if="selectedReportType === 'weekly' && reportData.details?.byDay && Object.keys(reportData.details.byDay).length > 0"
          class="mt-6">
          <h4 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">Vendas por Dia da Semana:</h4>
          <ul class="list-disc pl-5 text-gray-900 dark:text-gray-200">
            <li v-for="(value, day) in reportData.details.byDay" :key="day">
              {{ day }}: <span class="font-medium">{{ formatPrice(value) }}</span>
            </li>
          </ul>
        </div>

        <div
          v-if="selectedReportType === 'monthly' && reportData.details?.byDayOfMonth && Object.keys(reportData.details.byDayOfMonth).length > 0"
          class="mt-6">
          <h4 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">Vendas por Dia do Mês:</h4>
          <ul class="list-disc pl-5 text-gray-900 dark:text-gray-200">
            <li v-for="(value, day) in reportData.details.byDayOfMonth" :key="day">
              Dia {{ day }}: <span class="font-medium">{{ formatPrice(value) }}</span>
            </li>
          </ul>
        </div>

        <div
          v-if="selectedReportType === 'yearly' && reportData.details?.byMonth && Object.keys(reportData.details.byMonth).length > 0"
          class="mt-6">
          <h4 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">Vendas por Mês:</h4>
          <ul class="list-disc pl-5 text-gray-900 dark:text-gray-200">
            <li v-for="(value, month) in reportData.details.byMonth" :key="month">
              {{ month }}: <span class="font-medium">{{ formatPrice(value) }}</span>
            </li>
          </ul>
        </div>

      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted, watch, computed, nextTick } from 'vue';
import api from '@/services/httpClient';
import AdminLayout from '@/layouts/AdminLayout.vue';

// Importações do Chart.js e vue-chartjs
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement, LineElement, PointElement } from 'chart.js';
import { Bar as BarChart, Pie as PieChart, Line as LineChart } from 'vue-chartjs';

// Registrar os componentes necessários do Chart.js
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement, LineElement, PointElement);

// Função formatPrice definida localmente no componente
function formatPrice(value) {
  if (typeof value !== 'number') return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

const selectedReportType = ref('daily');
const dailyDate = ref('');
const weeklyStartDate = ref('');
const monthlyYear = ref(new Date().getFullYear());
const monthlyMonth = ref(new Date().getMonth() + 1); // Mês atual, 1-indexed
const yearlyYear = ref(new Date().getFullYear());

const reportData = ref(null);
const loading = ref(false);
const error = ref(null);

const showCharts = ref(false); // Flag para controlar a visibilidade dos gráficos

// Opções de gráfico padrão
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false, // Mantido como false para que a altura do contêiner 'h-64' seja respeitada
  plugins: {
    legend: {
      labels: {
        color: '#d1d5db', // Cor do texto da legenda (gray-300)
      },
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed.y !== null) {
            // Usando a função formatPrice local
            label += formatPrice(context.parsed.y);
          }
          return label;
        }
      }
    }
  },
  scales: {
    x: {
      ticks: {
        color: '#d1d5db', // Cor do texto do eixo X
      },
      grid: {
        color: 'rgba(209, 213, 219, 0.1)', // Cor das linhas de grade do eixo X (gray-300 com opacidade)
      }
    },
    y: {
      ticks: {
        color: '#d1d5db', // Cor do texto do eixo Y
        callback: function (value) {
          // Usando a função formatPrice local
          return formatPrice(value);
        }
      },
      grid: {
        color: 'rgba(209, 213, 219, 0.1)', // Cor das linhas de grade do eixo Y
      }
    }
  }
};

// Funções para preparar dados do gráfico usando computed properties
const chartDataPaymentType = computed(() => {
  if (!reportData.value || !reportData.value.details?.byPaymentType) {
    return { labels: [], datasets: [{ data: [] }] };
  }
  const labels = Object.keys(reportData.value.details.byPaymentType);
  const data = Object.values(reportData.value.details.byPaymentType);

  const colors = [
    '#F97316', // orange-500
    '#22C55E', // green-500
    '#3B82F6', // blue-500
    '#EF4444', // red-500
    '#8B5CF6', // purple-500
    '#EC4899', // pink-500
  ];

  return {
    labels: labels,
    datasets: [{
      label: 'Vendas',
      backgroundColor: colors.slice(0, labels.length),
      data: data,
    }],
  };
});

const chartDataDeliveryType = computed(() => {
  if (!reportData.value || !reportData.value.details?.byDeliveryType) {
    return { labels: [], datasets: [{ data: [] }] };
  }
  const labels = Object.keys(reportData.value.details.byDeliveryType);
  const data = Object.values(reportData.value.details.byDeliveryType);

  const colors = [
    '#A855F7', // purple-500
    '#F43F5E', // rose-500
    '#10B981', // emerald-500
    '#EAB308', // yellow-500
    '#6366F1', // indigo-500
  ];

  return {
    labels: labels,
    datasets: [{
      label: 'Vendas',
      backgroundColor: colors.slice(0, labels.length),
      data: data,
    }],
  };
});

const chartDataByDay = computed(() => {
  if (!reportData.value || !reportData.value.details?.byDay) {
    return { labels: [], datasets: [{ data: [] }] };
  }
  const orderedDays = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
  const labels = orderedDays.filter(day => reportData.value.details.byDay[day] !== undefined);
  const data = labels.map(day => reportData.value.details.byDay[day]);

  return {
    labels: labels,
    datasets: [{
      label: 'Vendas por dia',
      backgroundColor: '#F97316', // orange-500
      borderColor: '#F97316',
      data: data,
    }],
  };
});

const chartDataByDayOfMonth = computed(() => {
  if (!reportData.value || !reportData.value.details?.byDayOfMonth) {
    return { labels: [], datasets: [{ data: [] }] };
  }
  const labels = Object.keys(reportData.value.details.byDayOfMonth).sort((a, b) => parseInt(a) - parseInt(b));
  const data = labels.map(day => reportData.value.details.byDayOfMonth[day]);

  return {
    labels: labels.map(day => `Dia ${day}`),
    datasets: [{
      label: 'Vendas por dia do mês',
      backgroundColor: 'rgba(59, 130, 246, 0.5)', // blue-500 com opacidade
      borderColor: '#3B82F6', // blue-500
      data: data,
      fill: false,
      tension: 0.1
    }],
  };
});

const chartDataByMonth = computed(() => {
  if (!reportData.value || !reportData.value.details?.byMonth) {
    return { labels: [], datasets: [{ data: [] }] };
  }
  const monthOrder = [
    'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
  ];
  const labels = monthOrder.filter(month => reportData.value.details.byMonth[`${month.charAt(0).toUpperCase() + month.slice(1)} ${yearlyYear.value}`] !== undefined);
  const data = labels.map(month => reportData.value.details.byMonth[`${month.charAt(0).toUpperCase() + month.slice(1)} ${yearlyYear.value}`]);


  return {
    labels: labels.map(label => label.charAt(0).toUpperCase() + label.slice(1)), // Capitaliza o nome do mês
    datasets: [{
      label: 'Vendas por mês',
      backgroundColor: 'rgba(139, 92, 246, 0.5)', // purple-500 com opacidade
      borderColor: '#8B5CF6', // purple-500
      data: data,
      fill: false,
      tension: 0.1
    }],
  };
});


// Formata a data para ISO (YYYY-MM-DD)
const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Define as datas padrão ao carregar o componente
onMounted(() => {
  dailyDate.value = formatDate(new Date());
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  weeklyStartDate.value = formatDate(startOfWeek);
  fetchReport(); // Dispara o relatório diário inicial
});

// Watch para resetar os inputs de data e carregar o relatório automaticamente ao mudar o tipo
watch(selectedReportType, () => {
  resetDateInputs();
});

// Watch para reportData para controlar a renderização dos gráficos com nextTick
watch(reportData, (newValue) => {
  if (newValue && Object.keys(newValue).length > 0) {
    showCharts.value = false; // Esconde os gráficos imediatamente para garantir que a DOM seja limpa
    nextTick(() => {
      showCharts.value = true; // Re-exibe os gráficos após o Vue atualizar a DOM
    });
  } else {
    showCharts.value = false; // Se reportData é nulo ou vazio, esconde os gráficos
  }
}, { immediate: true, deep: true }); // Executa o watch imediatamente na montagem e monitora mudanças internas

const resetDateInputs = () => {
  error.value = null;
  reportData.value = null;
  showCharts.value = false; // Esconde os gráficos ao resetar
};

const fetchReport = async () => {
  loading.value = true;
  error.value = null;
  reportData.value = null; // Limpa dados anteriores
  showCharts.value = false; // Garante que os gráficos estejam escondidos durante o carregamento

  let url = '';
  let params = {};

  try {
    switch (selectedReportType.value) {
      case 'daily':
        if (!dailyDate.value) {
          throw new Error('Por favor, selecione uma data para o relatório diário.');
        }
        url = '/admin/reports/sales/daily';
        params = { date: dailyDate.value };
        break;
      case 'weekly':
        url = '/admin/reports/sales/weekly';
        if (weeklyStartDate.value) {
          params = { startDate: weeklyStartDate.value };
        }
        break;
      case 'monthly':
        if (!monthlyYear.value || !monthlyMonth.value) {
          throw new Error('Por favor, insira o ano e o mês para o relatório mensal.');
        }
        url = '/admin/reports/sales/monthly';
        params = { year: monthlyYear.value, month: monthlyMonth.value };
        break;
      case 'yearly':
        if (!yearlyYear.value) {
          throw new Error('Por favor, insira o ano para o relatório anual.');
        }
        url = '/admin/reports/sales/yearly';
        params = { year: yearlyYear.value };
        break;
      default:
        throw new Error('Tipo de relatório inválido selecionado.');
    }

    const response = await api.get(url, { params });
    reportData.value = response.data;

  } catch (err) {
    if (err.response && err.response.data && err.response.data.message) {
      error.value = err.response.data.message;
    } else {
      error.value = err.message || 'Ocorreu um erro ao buscar o relatório.';
    }
    console.error('Erro ao buscar relatório:', err);
  } finally {
    loading.value = false;
  }
};
</script>