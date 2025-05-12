<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    <div
      v-for="n in 6"
      :key="n"
      class="animate-pulse bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md"
    >
      <div class="w-full h-40 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
      <div class="h-5 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
      <div class="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
    </div>
  </div>
</template>
