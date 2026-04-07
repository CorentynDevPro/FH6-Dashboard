<template>
  <div :class="['bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm', hoverClass, paddingClass, $attrs.class]">
    <div v-if="title || $slots.header" class="flex items-center justify-between mb-4">
      <h3 v-if="title" class="text-base font-semibold text-gray-900 dark:text-gray-100">{{ title }}</h3>
      <slot name="header" />
    </div>
    <slot />
    <div v-if="$slots.footer" class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
      <slot name="footer" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AppCard',
  inheritAttrs: false,
  props: {
    title: {
      type: String,
      default: '',
    },
    hoverable: {
      type: Boolean,
      default: false,
    },
    padding: {
      type: String as () => 'sm' | 'md' | 'lg' | 'none',
      default: 'md',
    },
  },
  computed: {
    hoverClass(): string {
      return this.hoverable ? 'transition-shadow hover:shadow-md cursor-pointer' : '';
    },
    paddingClass(): string {
      const paddings: Record<string, string> = {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      };
      return paddings[this.padding] || paddings.md;
    },
  },
});
</script>
