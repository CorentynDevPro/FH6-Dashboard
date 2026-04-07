<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[baseClasses, variantClasses, sizeClasses]"
    v-bind="$attrs"
  >
    <span v-if="loading" class="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
    <slot v-else-if="$slots.icon" name="icon" />
    <span v-if="$slots.default"><slot /></span>
  </button>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  name: 'AppButton',
  inheritAttrs: false,
  props: {
    variant: {
      type: String as PropType<'primary' | 'secondary' | 'danger' | 'ghost' | 'outline'>,
      default: 'primary',
    },
    size: {
      type: String as PropType<'xs' | 'sm' | 'md' | 'lg'>,
      default: 'md',
    },
    type: {
      type: String as PropType<'button' | 'submit' | 'reset'>,
      default: 'button',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    baseClasses(): string {
      return 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    },
    variantClasses(): string {
      const variants: Record<string, string> = {
        primary: 'bg-brand-500 hover:bg-brand-600 text-white focus:ring-brand-500',
        secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100 focus:ring-gray-500',
        danger: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500',
        ghost: 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 focus:ring-gray-500',
        outline: 'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 focus:ring-gray-500',
      };
      return variants[this.variant] || variants.primary;
    },
    sizeClasses(): string {
      const sizes: Record<string, string> = {
        xs: 'text-xs px-2.5 py-1',
        sm: 'text-sm px-3 py-1.5',
        md: 'text-sm px-4 py-2',
        lg: 'text-base px-6 py-3',
      };
      return sizes[this.size] || sizes.md;
    },
  },
});
</script>
