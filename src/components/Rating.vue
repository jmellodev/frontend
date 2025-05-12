<template>
  <div class="flex items-baseline gap-1 text-amber-300 text-xs">
    <template v-for="n in 5" :key="n">
      <i v-if="n <= fullStars" class="fas fa-star" />
      <i v-else-if="n === fullStars + 1 && hasHalfStar" class="fas fa-star-half-alt" />
      <i v-else class="far fa-star text-gray-400 dark:text-gray-500" />
    </template>
    <span v-if="showTextRating" class="dark:text-gray-200 text-gray-500"
      >| {{ Number(ratingText).toFixed(1) }}</span
    >
  </div>
</template>

<script setup>
import { computed } from "vue";

// Props
const props = defineProps({
  rating: {
    type: Number,
    required: true,
    default: 0,
  },
  showTextRating: {
    type: Boolean,
    required: false,
    default: false,
  },
  ratingText: {
    type: Number,
    required: false,
    default: 0,
  },
});

const fullStars = computed(() => Math.floor(props.rating));
const hasHalfStar = computed(() => props.rating % 1 >= 0.5);
</script>
