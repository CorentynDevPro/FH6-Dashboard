<template>
  <span :class="['inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold', colorClass]">
    <span v-if="dot" class="w-1.5 h-1.5 rounded-full bg-current" />
    <slot />
  </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';

export default defineComponent({
  name: 'AppBadge',
  props: {
    variant: {
      type: String as PropType<'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'>,
      default: 'default',
    },
    dot: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    colorClass(): string {
      const colors: Record<string, string> = {
        default: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
        primary: 'bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400',
        success: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        warning: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
        danger: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        info: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      };
      return colors[this.variant] || colors.default;
    },
  },
});
</script>
