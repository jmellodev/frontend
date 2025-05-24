<template>
  <div class="flex items-baseline gap-[2px] text-amber-300 text-[11px]">
    <template v-if="!hasUserVoted && !loadingVote">
      <i v-for="n in 5" :key="n" :class="[
        'fas fa-star cursor-pointer transition-colors duration-200',
        n <= hoverStars ? 'text-amber-500' : 'text-amber-300',
      ]" @mouseover="hoverStars = n" @mouseleave="hoverStars = 0" @click="rateProduct(n)" />
    </template>

    <template v-else>
      <i v-for="n in 5" :key="n" :class="{
        'fas fa-star': n <= currentRatingDisplay,
        'fas fa-star-half-alt': n === Math.floor(currentRatingDisplay) + 1 && currentRatingDisplay % 1 >= 0.5,
        'far fa-star text-gray-400 dark:text-gray-500': n > currentRatingDisplay,
      }" />
    </template>

    <span v-if="showTextRating" class="dark:text-gray-200 text-gray-500">
      ({{ Number(currentRatingDisplay).toFixed(1) }})</span>
    <span v-if="loadingVote" class="ml-2 text-sm text-gray-500">Votando...</span>
    <span v-if="voteError" class="ml-2 text-sm text-red-500">{{ voteError }}</span>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import api from "@/services/httpClient"; // Assumindo que você tem um cliente Axios configurado
import { useRoute } from 'vue-router'; // Para obter o ID do produto da rota, se necessário. Se não for via rota, passamos via prop.

// Props: Ajustadas para incluir o ID do produto para a votação
const props = defineProps({
  productId: { // Novo: ID do produto para enviar para o backend
    type: String,
    required: true,
  },
  rating: { // Classificação inicial do produto
    type: Number,
    required: true,
    default: 0,
  },
  showTextRating: {
    type: Boolean,
    required: false,
    default: false,
  },
  ratingText: { // Se você quiser exibir um texto de classificação específico, além do rating numérico
    type: Number,
    required: false,
    default: 0,
  },
});

// Estado reativo para a classificação atual (pode mudar após o voto)
const currentRatingDisplay = ref(props.rating);
// Estado para rastrear o hover sobre as estrelas
const hoverStars = ref(0);
// Estado para indicar se o usuário já votou neste produto
const hasUserVoted = ref(false);
// Estado para loading da votação
const loadingVote = ref(false);
// Estado para erros de votação
const voteError = ref(null);

const fullStars = computed(() => Math.floor(currentRatingDisplay.value));
const hasHalfStar = computed(() => currentRatingDisplay.value % 1 >= 0.5);

// Chave do LocalStorage para votos
const VOTED_PRODUCTS_KEY = 'voted_products';

// Função para verificar se o usuário já votou neste produto
const checkIfUserVoted = () => {
  const votedProducts = JSON.parse(localStorage.getItem(VOTED_PRODUCTS_KEY) || '[]');
  hasUserVoted.value = votedProducts.includes(props.productId);
};

// Função para registrar o voto no LocalStorage
const recordUserVote = () => {
  let votedProducts = JSON.parse(localStorage.getItem(VOTED_PRODUCTS_KEY) || '[]');
  if (!votedProducts.includes(props.productId)) {
    votedProducts.push(props.productId);
    localStorage.setItem(VOTED_PRODUCTS_KEY, JSON.stringify(votedProducts));
  }
  hasUserVoted.value = true;
};

// Função para enviar a classificação para o backend
const rateProduct = async (stars) => {
  if (hasUserVoted.value || loadingVote.value) return; // Impede múltiplos cliques

  loadingVote.value = true;
  voteError.value = null;

  try {
    const response = await api.put(`/products/${props.productId}/rate`, { stars });
    // Atualiza a classificação exibida com os dados do backend
    currentRatingDisplay.value = response.data.rating;
    recordUserVote(); // Registra que o usuário votou
    console.log('Voto registrado com sucesso:', response.data);
  } catch (error) {
    console.error('Erro ao votar:', error);
    voteError.value = error.response?.data?.error || 'Erro ao registrar voto.';
  } finally {
    loadingVote.value = false;
  }
};

// Ao montar o componente, verifica se o usuário já votou
onMounted(() => {
  checkIfUserVoted();
  // Inicializa currentRatingDisplay com o rating da prop, caso o ratingText seja 0 e rating tenha valor
  if (props.ratingText === 0 && props.rating > 0) {
    currentRatingDisplay.value = props.rating;
  } else if (props.ratingText > 0) {
    currentRatingDisplay.value = props.ratingText; // Se ratingText for a fonte da verdade
  }
});

// Observa mudanças no rating da prop (se o produto for atualizado de fora)
// Não é estritamente necessário para a votação, mas útil para manter o UI sincronizado
// watch(() => props.rating, (newRating) => {
//   currentRatingDisplay.value = newRating;
// });

</script>

<style scoped>
/* Adicione estilos de transição se desejar para o hover */
</style>