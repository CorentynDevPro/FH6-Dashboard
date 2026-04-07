<template>
  <div class="flex items-center justify-center" :class="wrapperClass">
    <div
      :class="[
        'animate-spin rounded-full border-2 border-current border-t-transparent',
        sizeClass,
        colorClass,
      ]"
    />
    <span v-if="label" class="ml-2 text-sm text-gray-500 dark:text-gray-400">{{ label }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'LoadingSpinner',
  props: {
    size: {
      type: String as () => 'xs' | 'sm' | 'md' | 'lg',
      default: 'md',
    },
    color: {
      type: String,
      default: 'brand',
    },
    label: {
      type: String,
      default: '',
    },
    wrapperClass: {
      type: String,
      default: '',
    },
  },
  computed: {
    sizeClass(): string {
      const sizes: Record<string, string> = {
        xs: 'h-4 w-4',
        sm: 'h-5 w-5',
        md: 'h-8 w-8',
        lg: 'h-12 w-12',
      };
      return sizes[this.size] || sizes.md;
    },
    colorClass(): string {
      const colors: Record<string, string> = {
        brand: 'text-brand-500',
        white: 'text-white',
        gray: 'text-gray-400',
      };
      return colors[this.color] || colors.brand;
    },
  },
});
</script>
