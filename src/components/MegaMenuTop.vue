<template>
  <div class="flex md:justify-center items-center relative">
    <ul class="md:flex flex-wrap p-1 hidden md:p-2 text-sm md:text-base">
      <!-- Botão Todos -->
      <li @click="selectCategory(null)" class="mx-1 px-1 py-2 group mb-1 md:mb-0">
        <span
          :class="[
            'cursor-pointer whitespace-nowrap text-gray-600 group-hover:text-gray-800 group-hover:border-b group',
            selectedCategoryIds === null ? 'text-gray-800 border-b' : '',
          ]"
          ><i class="fa fa-home"></i> Home</span
        >
      </li>

      <li
        v-for="parent in parentCategories"
        :key="parent.id"
        class="relative mx-1 px-1 py-2 group mb-1 md:mb-0"
      >
        <span
          @click="selectCategory(parent.id, true)"
          :class="[
            'cursor-pointer whitespace-nowrap group',
            isSelected([
              parent.id,
              ...(childCategories[parent.id]?.map((c) => c.id) || []),
            ])
              ? 'text-black font-bold border-b'
              : 'text-gray-600 group-hover:text-gray-800 group-hover:border-b',
          ]"
        >
          <i :class="parent.icon"></i> {{ parent.name }}
        </span>
        <ul
          v-if="childCategories[parent.id]?.length > 0"
          class="absolute left-0 top-0 mt-10 p-2 shadow-lg shadow-gray-800/50 bg-white z-10 hidden group-hover:block rounded-md"
        >
          <li
            v-for="child in childCategories[parent.id]"
            :key="child.id"
            @click="selectCategory(child.id)"
            :class="[
              'cursor-pointer p-1 whitespace-nowrap rounded-md',
              selectedCategoryIds?.includes(child.id)
                ? 'text-black font-bold bg-gray-200'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-300',
            ]"
          >
            <div class="px-2 py-1">
              <span><i :class="child.icon"></i> {{ child.name }}</span>
            </div>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { useCategories } from "@/composables/useCategories";
import { ref } from "vue";

const props = defineProps({ selectedCategoryIds: Array });
const emit = defineEmits(["categorySelected"]);

const selectedCategoryIdsRef = ref(props.selectedCategoryIds); // se quiser reatividade
const { parentCategories, childCategories, selectCategory, isSelected } = useCategories(
  emit,
  selectedCategoryIdsRef
);
</script>
