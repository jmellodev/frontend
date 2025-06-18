<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
    <div v-if="chartDataPaymentType.labels.length > 0" class="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
      <h4 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">Vendas por tipo de pagamento</h4>
      <div class="h-64">
        <BarChart :data="chartDataPaymentType" :options="chartOptions" />
      </div>
    </div>

    <div v-if="chartDataDeliveryType.labels.length > 0" class="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
      <h4 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">Vendas por tipo de entrega</h4>
      <div class="h-64">
        <PieChart :data="chartDataDeliveryType" :options="chartOptions" />
      </div>
    </div>

    <div v-if="selectedReportType === 'weekly' && chartDataByDay.labels.length > 0"
      class="mt-6 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
      <h4 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">Vendas por dia da semana:</h4>
      <div class="h-64">
        <BarChart :data="chartDataByDay" :options="chartOptions" />
      </div>
    </div>

    <div v-if="selectedReportType === 'monthly' && chartDataByDayOfMonth.labels.length > 0"
      class="mt-6 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
      <h4 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">Vendas por dia do mês:</h4>
      <div class="h-64">
        <LineChart :data="chartDataByDayOfMonth" :options="chartOptions" />
      </div>
    </div>

    <div v-if="selectedReportType === 'yearly' && chartDataByMonth.labels.length > 0"
      class="mt-6 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
      <h4 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">Vendas por mês:</h4>
      <div class="h-64">
        <LineChart :data="chartDataByMonth" :options="chartOptions" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
// Importar as funções de formatação do utilitário
import { formatPrice, displayPaymentType } from '@/utils/formatters';

// Importações do Chart.js e vue-chartjs
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement, LineElement, PointElement } from 'chart.js';
import { Bar as BarChart, Pie as PieChart, Line as LineChart } from 'vue-chartjs';

// Registrar os componentes necessários do Chart.js
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement, LineElement, PointElement);

const props = defineProps({
  reportData: {
    type: Object,
    default: null
  },
  selectedReportType: {
    type: String,
    required: true
  },
  yearlyYear: { // Necessário para a formatação do mês no gráfico anual
    type: Number,
    default: new Date().getFullYear()
  }
});

// Opções de gráfico padrão
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {

    tooltip: {
      callbacks: {
        label: function (context) {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed.y !== null) {
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
        color: '#d1d5db',
      },
      grid: {
        color: 'rgba(209, 213, 219, 0.1)',
      }
    },
    y: {
      ticks: {
        color: '#d1d5db',
        callback: function (value) {
          return formatPrice(value);
        }
      },
      grid: {
        color: 'rgba(209, 213, 219, 0.1)',
      }
    }
  }
};

// Funções para preparar dados do gráfico usando computed properties
const chartDataPaymentType = computed(() => {
  if (!props.reportData || !props.reportData.details?.byPaymentType) {
    return { labels: [], datasets: [{ data: [] }] };
  }

  const rawLabels = Object.keys(props.reportData.details.byPaymentType);
  const labels = rawLabels.map(type => displayPaymentType(type)); // Aplica a formatação aqui
  const data = Object.values(props.reportData.details.byPaymentType);

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
  if (!props.reportData || !props.reportData.details?.byDeliveryType) {
    return { labels: [], datasets: [{ data: [] }] };
  }
  const labels = Object.keys(props.reportData.details.byDeliveryType);
  const data = Object.values(props.reportData.details.byDeliveryType);

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
  if (!props.reportData || !props.reportData.details?.byDay) {
    return { labels: [], datasets: [{ data: [] }] };
  }
  const orderedDays = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
  const labels = orderedDays.filter(day => props.reportData.details.byDay[day] !== undefined);
  const data = labels.map(day => props.reportData.details.byDay[day]);

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
  if (!props.reportData || !props.reportData.details?.byDayOfMonth) {
    return { labels: [], datasets: [{ data: [] }] };
  }
  const labels = Object.keys(props.reportData.details.byDayOfMonth).sort((a, b) => parseInt(a) - parseInt(b));
  const data = labels.map(day => props.reportData.details.byDayOfMonth[day]);

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
  if (!props.reportData || !props.reportData.details?.byMonth) {
    return { labels: [], datasets: [{ data: [] }] };
  }
  const monthOrder = [
    'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
  ];
  // Filtra e mapeia para incluir apenas meses com dados presentes, e capitaliza
  const labels = monthOrder.filter(month => {
    const key = `${month.charAt(0).toUpperCase() + month.slice(1)} ${props.yearlyYear}`;
    return props.reportData.details.byMonth[key] !== undefined;
  }).map(label => label.charAt(0).toUpperCase() + label.slice(1));

  // Mapeia os dados na mesma ordem dos labels filtrados e capitalizados
  const data = labels.map(monthLabel => {
    const originalMonth = monthLabel.toLowerCase(); // Volta para minúsculo para buscar a chave original
    const key = `${originalMonth.charAt(0).toUpperCase() + originalMonth.slice(1)} ${props.yearlyYear}`;
    return props.reportData.details.byMonth[key];
  });

  return {
    labels: labels,
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
</script>
