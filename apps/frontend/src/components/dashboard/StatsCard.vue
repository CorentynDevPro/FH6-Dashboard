<template>
  <div class="card p-5">
    <div class="flex items-center gap-3">
      <div :class="['w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0', iconBg]">
        {{ icon }}
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">{{ label }}</p>
        <div class="flex items-baseline gap-2">
          <span class="text-2xl font-bold text-gray-900 dark:text-white tabular-nums">{{ formattedValue }}</span>
          <span v-if="change !== undefined" :class="['text-xs font-medium', changeColor]">
            {{ change >= 0 ? '+' : '' }}{{ change }}{{ changeUnit }}
          </span>
        </div>
      </div>
    </div>
    <div v-if="subtitle" class="mt-2 text-xs text-gray-400 dark:text-gray-500">{{ subtitle }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'StatsCard',
  props: {
    label: {
      type: String,
      required: true,
    },
    value: {
      type: [Number, String],
      required: true,
    },
    icon: {
      type: String,
      default: '📊',
    },
    iconBg: {
      type: String,
      default: 'bg-brand-50 dark:bg-brand-900/20',
    },
    change: {
      type: Number,
      default: undefined,
    },
    changeUnit: {
      type: String,
      default: '',
    },
    subtitle: {
      type: String,
      default: '',
    },
  },
  computed: {
    formattedValue(): string {
      if (typeof this.value === 'number') {
        return new Intl.NumberFormat().format(this.value);
      }
      return String(this.value);
    },
    changeColor(): string {
      if (this.change === undefined) return '';
      return this.change >= 0
        ? 'text-green-500 dark:text-green-400'
        : 'text-red-500 dark:text-red-400';
    },
  },
});
</script>
