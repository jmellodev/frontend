// src/utils/formatters.js

/**
 * Formata um valor numérico para o formato de moeda BRL (Real Brasileiro).
 * @param {number} value - O valor a ser formatado.
 * @returns {string} O valor formatado como moeda.
 */
export function formatPrice(value) {
  if (typeof value !== 'number') return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Formata strings de status removendo underscores e capitalizando a primeira letra.
 * @param {string} text - O texto a ser formatado (ex: "em_preparo").
 * @returns {string} O texto formatado (ex: "Em preparo").
 */
export function formatText(text) {
  if (!text) return '';
  let formattedText = String(text).replace(/_/g, ' ');
  return formattedText.charAt(0).toUpperCase() + formattedText.slice(1);
}

/**
 * Formata um timestamp do Firestore ou objeto Date para uma string de data/hora local.
 * @param {object|Date|string} ts - O timestamp do Firestore, objeto Date ou string de data.
 * @returns {string} A data/hora formatada.
 */
export function formatDate(ts) {
  if (!ts) return "";
  if (ts && typeof ts.toDate === 'function') { // Se é um Timestamp do Firestore
    return ts.toDate().toLocaleString('pt-BR');
  }
  if (ts instanceof Date) { // Se já é um objeto Date
    return ts.toLocaleString('pt-BR');
  }
  try { // Tenta converter de string
    return new Date(ts).toLocaleString('pt-BR');
  } catch (e) {
    return "";
  }
}

/**
 * Traduz o tipo de pagamento para exibição amigável.
 * @param {string} type - O tipo de pagamento do banco de dados (ex: "bank_transfer").
 * @returns {string} O nome do tipo de pagamento formatado (ex: "Pix").
 */
export function displayPaymentType(type) {
  switch (type) {
    case 'bank_transfer':
      return 'Pix';
    case 'credit_card':
      return 'Cartão';
    case 'debit_card':
      return 'Cartão de Débito';
    case 'cash':
      return 'Dinheiro';
    default:
      return formatText(type); // Usa formatText para outros casos não mapeados
  }
}

/**
 * Retorna uma string de status de pagamento amigável.
 * @param {string} status - O status de pagamento do banco de dados.
 * @returns {string} O status de pagamento formatado.
 */
export function getStatusPayment(status) {
  switch (status) {
    case 'paid':
    case 'approved': return 'Aprovado';
    case 'pending': return 'Pendente';
    case 'failed': return 'Falhou';
    case 'refunded': return 'Reembolsado';
    case 'cancelled': return 'Cancelado';
    default: return formatText(status); // Para outros, apenas formata
  }
}

/**
 * Retorna as classes CSS para o badge de status do pedido.
 * @param {string} status - O status do pedido (ex: "em_preparo").
 * @returns {string} Classes Tailwind CSS para o badge.
 */
export function getStatusBadgeClass(status) {
  switch (status) {
    case 'em processamento':
      return 'px-2 py-0.5 text-xs font-medium rounded-full bg-orange-50 text-orange-600 dark:bg-orange-500/15 dark:text-orange-500';
    case 'recebido':
      return 'px-2 py-0.5 text-xs font-medium rounded-full bg-yellow-50 text-yellow-600 dark:bg-yellow-500/15 dark:text-yellow-500';
    case 'em_preparo':
      return 'px-2 py-0.5 text-xs font-medium rounded-full bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-500';
    case 'finalizado':
    case 'entregue':
      return 'px-2 py-0.5 text-xs font-medium rounded-full bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-500';
    case 'a_caminho':
    case 'assigned': // Adicionado para lidar com o status de entrega do entregador
      return 'px-2 py-0.5 text-xs font-medium rounded-full bg-purple-50 text-purple-600 dark:bg-purple-500/15 dark:text-purple-500';
    case 'cancelled': // Note: seu template usa 'cancelado', mas o BD usa 'cancelled'
    case 'cancelado':
      return 'px-2 py-0.5 text-xs font-medium bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-500';
    case 'pending': // Status inicial de entrega
      return 'px-2 py-0.5 text-xs font-medium rounded-full bg-gray-50 text-gray-600 dark:bg-gray-500/15 dark:text-gray-500';
    default:
      return 'px-2 py-0.5 text-xs font-medium rounded-full bg-gray-50 text-gray-600 dark:bg-gray-500/15 dark:text-gray-500';
  }
}

/**
 * Função auxiliar para extrair timestamp para ordenação de objetos de pedidos.
 * Suporta Timestamps do Firestore, objetos Date, strings e números (segundos ou milissegundos).
 * @param {*} ts - O valor do timestamp.
 * @returns {number} O timestamp em milissegundos.
 */
export function getTimestamp(ts) {
  if (!ts) return 0;
  if (ts && typeof ts.toDate === 'function') {
    return ts.toDate().getTime();
  }
  if (ts && typeof ts._seconds !== 'undefined') {
    return ts._seconds * 1000;
  }
  if (ts instanceof Date) {
    return ts.getTime();
  }
  if (typeof ts === 'string') {
    return new Date(ts).getTime();
  }
  if (typeof ts === 'number') {
    return ts > 1000000000000 ? ts : ts * 1000; // Assume que números grandes são ms, pequenos são segundos
  }
  return 0;
}
