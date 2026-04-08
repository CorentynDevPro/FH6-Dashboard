<template>
  <div
    :class="[
      'card overflow-hidden cursor-pointer group transition-all hover:shadow-md hover:-translate-y-0.5',
      car.isForzaEdition ? 'forza-edition-card' : '',
    ]"
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
      <!-- Rarity badge -->
      <div class="absolute bottom-2 left-2">
        <span :class="['inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold shadow', rarityClass]">
          {{ rarityLabel }}
        </span>
      </div>
      <!-- Forza Edition label -->
      <div v-if="car.isForzaEdition" class="absolute bottom-2 right-2">
        <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold forza-badge shadow">
          ✦ Forza Edition
        </span>
      </div>
      <!-- Collection toggle -->
      <button
        v-if="isLoggedIn"
        :class="[
          'absolute top-2 left-2 w-8 h-8 rounded-lg flex items-center justify-center shadow transition-colors',
          inCollection
            ? 'bg-brand-500 text-white'
            : 'bg-white/80 dark:bg-gray-800/80 text-gray-500 dark:text-gray-400 hover:text-brand-500',
        ]"
        :title="inCollection ? 'Remove from collection' : 'Add to collection'"
        @click.stop="toggleCollection"
      >
        {{ inCollection ? '♥' : '♡' }}
      </button>
    </div>

    <!-- Car info -->
    <div class="p-4">
      <div class="flex items-start justify-between gap-2">
        <div>
          <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">{{ car.make }}</p>
          <h3 class="text-sm font-bold text-gray-900 dark:text-white leading-tight">{{ car.model }}</h3>
          <p class="text-xs text-gray-400 dark:text-gray-500">{{ car.year }}</p>
        </div>
        <AppBadge :variant="categoryVariant">{{ categoryLabel }}</AppBadge>
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
import { useCarsStore } from '@/stores/cars.store';
import { useAuthStore } from '@/stores/auth.store';

const CATEGORY_LABELS: Record<string, string> = {
  SPORT: 'Sport',
  SUV: 'SUV',
  TRUCK: 'Truck',
  CLASSIC: 'Classic',
  OFFROAD: 'Offroad',
  HYPERCAR: 'Hypercar',
  MUSCLE: 'Muscle',
  BUGGY: 'Buggy',
  SUPERCAR: 'Supercar',
  TRACK_TOY: 'Track Toy',
  HOT_HATCH: 'Hot Hatch',
  RALLY: 'Rally',
  ELECTRIC: 'Electric',
  DRIFT: 'Drift',
};

const RARITY_CONFIG: Record<string, { label: string; classes: string }> = {
  COMMON:     { label: 'Common',     classes: 'bg-sky-100 text-sky-600 dark:bg-sky-900/40 dark:text-sky-300' },
  RARE:       { label: 'Rare',       classes: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' },
  ULTRA_RARE: { label: 'Ultra Rare', classes: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' },
  EPIC:       { label: 'Epic',       classes: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300' },
  LEGENDARY:  { label: 'Legendary',  classes: 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300' },
};

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
    isLoggedIn(): boolean { return useAuthStore().isLoggedIn; },
    inCollection(): boolean { return useCarsStore().isInCollection(this.car.id); },
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
    rarityLabel(): string {
      return RARITY_CONFIG[this.car.rarity]?.label ?? String(this.car.rarity);
    },
    rarityClass(): string {
      return RARITY_CONFIG[this.car.rarity]?.classes ?? 'bg-gray-100 text-gray-600';
    },
    categoryLabel(): string {
      return CATEGORY_LABELS[this.car.category] || this.car.category;
    },
    categoryVariant(): 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' {
      const variants: Record<string, 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'> = {
        HYPERCAR: 'danger',
        SUPERCAR: 'danger',
        SPORT: 'primary',
        MUSCLE: 'warning',
        OFFROAD: 'success',
        RALLY: 'success',
        SUV: 'info',
        TRUCK: 'default',
        CLASSIC: 'default',
        BUGGY: 'success',
        TRACK_TOY: 'primary',
        HOT_HATCH: 'primary',
        ELECTRIC: 'info',
        DRIFT: 'warning',
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
  methods: {
    async toggleCollection() {
      const store = useCarsStore();
      if (this.inCollection) {
        await store.removeFromCollection(this.car.id);
      } else {
        await store.addToCollection(this.car.id);
      }
    },
  },
});
</script>

<style scoped>
/* Forza Edition holographic shimmer card */
.forza-edition-card {
  position: relative;
  border: 2px solid transparent;
  background-clip: padding-box;
}
.forza-edition-card::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: inherit;
  padding: 2px;
  background: linear-gradient(
    135deg,
    #f59e0b 0%,
    #ef4444 20%,
    #a855f7 40%,
    #3b82f6 60%,
    #10b981 80%,
    #f59e0b 100%
  );
  background-size: 300% 300%;
  animation: forza-shimmer 3s linear infinite;
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
  z-index: 0;
}
@keyframes forza-shimmer {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Forza Edition badge */
.forza-badge {
  background: linear-gradient(135deg, #f59e0b, #ef4444);
  color: #fff;
  text-shadow: 0 1px 2px rgba(0,0,0,0.4);
}
</style>

