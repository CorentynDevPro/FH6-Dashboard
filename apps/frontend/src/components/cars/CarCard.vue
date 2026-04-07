<template>
  <div
    class="card overflow-hidden cursor-pointer group transition-all hover:shadow-md hover:-translate-y-0.5"
    @click="$emit('click', car)"
  >
    <!-- Car image -->
    <div class="relative h-44 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 overflow-hidden">
      <img
        v-if="car.imageUrl"
        :src="car.imageUrl"
        :alt="`${car.make} ${car.model}`"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        @error="(e) => ((e.target as HTMLImageElement).style.display = 'none')"
      />
      <div v-else class="flex items-center justify-center h-full">
        <span class="text-5xl">🚗</span>
      </div>
      <!-- Class badge -->
      <div class="absolute top-2 right-2">
        <span :class="['inline-flex items-center justify-center w-8 h-8 rounded-lg text-white text-xs font-bold shadow', classColor]">
          {{ car.carClass }}
        </span>
      </div>
      <!-- Rarity stars -->
      <div class="absolute bottom-2 left-2 flex gap-0.5">
        <span
          v-for="i in car.rarity"
          :key="i"
          class="text-yellow-400 text-xs"
        >★</span>
      </div>
    </div>

    <!-- Car info -->
    <div class="p-4">
      <div class="flex items-start justify-between gap-2">
        <div>
          <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">{{ car.make }}</p>
          <h3 class="text-sm font-bold text-gray-900 dark:text-white leading-tight">{{ car.model }}</h3>
          <p class="text-xs text-gray-400 dark:text-gray-500">{{ car.year }}</p>
        </div>
        <AppBadge :variant="categoryVariant">{{ car.category }}</AppBadge>
      </div>

      <!-- Stats mini bar -->
      <div v-if="car.stats" class="mt-3 grid grid-cols-3 gap-2">
        <div v-for="stat in quickStats" :key="stat.key" class="text-center">
          <div class="text-xs text-gray-400 dark:text-gray-500">{{ stat.label }}</div>
          <div class="text-sm font-semibold text-gray-900 dark:text-white">{{ stat.value }}</div>
        </div>
      </div>

      <!-- PI Rating -->
      <div v-if="car.stats" class="mt-3 flex items-center gap-2">
        <div class="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            class="h-full bg-brand-500 rounded-full transition-all"
            :style="{ width: `${(car.stats.piRating / 999) * 100}%` }"
          />
        </div>
        <span class="text-xs font-bold text-brand-600 dark:text-brand-400 tabular-nums">{{ car.stats?.piRating }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import type { Car } from '@fh6/types';
import AppBadge from '@/components/common/AppBadge.vue';

export default defineComponent({
  name: 'CarCard',
  components: { AppBadge },
  props: {
    car: {
      type: Object as PropType<Car>,
      required: true,
    },
  },
  emits: ['click'],
  computed: {
    classColor(): string {
      const colors: Record<string, string> = {
        D: 'bg-gray-500',
        C: 'bg-blue-500',
        B: 'bg-yellow-500',
        A: 'bg-orange-500',
        S1: 'bg-purple-500',
        S2: 'bg-red-500',
        X: 'bg-pink-600',
      };
      return colors[this.car.carClass] || 'bg-gray-400';
    },
    categoryVariant(): 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' {
      const variants: Record<string, 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'> = {
        HYPERCAR: 'danger',
        SPORT: 'primary',
        MUSCLE: 'warning',
        OFFROAD: 'success',
        SUV: 'info',
        TRUCK: 'default',
        CLASSIC: 'default',
        BUGGY: 'success',
      };
      return variants[this.car.category] || 'default';
    },
    quickStats() {
      if (!this.car.stats) return [];
      return [
        { key: 'speed', label: 'Spd', value: this.car.stats.speed.toFixed(1) },
        { key: 'handling', label: 'Hdl', value: this.car.stats.handling.toFixed(1) },
        { key: 'acceleration', label: 'Acc', value: this.car.stats.acceleration.toFixed(1) },
      ];
    },
  },
});
</script>
