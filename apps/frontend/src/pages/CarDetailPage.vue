<template>
  <div>
    <div v-if="loading" class="flex justify-center py-20">
      <LoadingSpinner label="Loading car..." size="lg" />
    </div>

    <div v-else-if="!car" class="text-center py-20">
      <p class="text-gray-500 dark:text-gray-400">Car not found</p>
      <AppButton variant="secondary" class="mt-4" @click="$router.back()">Go Back</AppButton>
    </div>

    <template v-else>
      <!-- Header -->
      <div class="flex items-start gap-4 mb-6">
        <button
          class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          @click="$router.back()"
        >
          ← Back
        </button>
        <div>
          <p class="text-sm text-gray-500 dark:text-gray-400">{{ car.make }}</p>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ car.model }}</h1>
          <p class="text-gray-400 dark:text-gray-500">{{ car.year }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left: Car image and quick stats -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Image -->
          <div class="relative h-64 sm:h-80 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-2xl overflow-hidden">
            <img
              v-if="car.imageUrl"
              :src="car.imageUrl"
              :alt="`${car.make} ${car.model}`"
              class="w-full h-full object-cover"
            />
            <div v-else class="flex items-center justify-center h-full">
              <span class="text-8xl">🚗</span>
            </div>
            <div class="absolute top-4 right-4 flex gap-2">
              <span :class="['inline-flex items-center justify-center w-10 h-10 rounded-xl text-white text-sm font-bold shadow', classColor]">
                {{ car.carClass }}
              </span>
            </div>
          </div>

          <!-- Specs -->
          <AppCard title="Specifications">
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div v-for="spec in specs" :key="spec.label" class="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">{{ spec.label }}</div>
                <div class="text-sm font-bold text-gray-900 dark:text-white">{{ spec.value }}</div>
              </div>
            </div>
          </AppCard>

          <!-- Community builds for this car -->
          <div>
            <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Community Builds</h2>
            <div v-if="car.builds && car.builds.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <BuildCard
                v-for="build in car.builds"
                :key="build.id"
                :build="build"
                @like="handleLike"
                @view="viewBuild"
              />
            </div>
            <div v-else class="card p-8 text-center text-gray-400 dark:text-gray-500">
              No builds yet for this car
            </div>
          </div>
        </div>

        <!-- Right: Radar chart -->
        <div class="space-y-6">
          <AppCard title="Performance Stats">
            <CarStatsChart v-if="car.stats" :stats="car.stats" />
            <div v-else class="text-center py-8 text-gray-400">No stats available</div>
          </AppCard>

          <AppCard title="Car Details">
            <dl class="space-y-3">
              <div v-for="detail in carDetails" :key="detail.label" class="flex justify-between text-sm">
                <dt class="text-gray-500 dark:text-gray-400">{{ detail.label }}</dt>
                <dd class="font-medium text-gray-900 dark:text-white">{{ detail.value }}</dd>
              </div>
            </dl>
          </AppCard>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AppCard from '@/components/common/AppCard.vue';
import AppButton from '@/components/common/AppButton.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import CarStatsChart from '@/components/cars/CarStatsChart.vue';
import BuildCard from '@/components/builds/BuildCard.vue';
import { useCarsStore } from '@/stores/cars.store';
import { useBuildsStore } from '@/stores/builds.store';

export default defineComponent({
  name: 'CarDetailPage',
  components: { AppCard, AppButton, LoadingSpinner, CarStatsChart, BuildCard },
  computed: {
    carsStore() { return useCarsStore(); },
    car() { return this.carsStore.currentCar as any; },
    loading() { return this.carsStore.loading; },
    classColor(): string {
      if (!this.car) return '';
      const colors: Record<string, string> = { D: 'bg-gray-500', C: 'bg-blue-500', B: 'bg-yellow-500', A: 'bg-orange-500', S1: 'bg-purple-500', S2: 'bg-red-500', X: 'bg-pink-600' };
      return colors[this.car.carClass] || 'bg-gray-400';
    },
    specs() {
      if (!this.car) return [];
      return [
        { label: 'Horsepower', value: `${this.car.horsepower} hp` },
        { label: 'Torque', value: `${this.car.torque} lb-ft` },
        { label: 'Weight', value: `${this.car.weight.toLocaleString()} kg` },
        { label: 'Engine', value: this.car.engineType },
        { label: 'Displacement', value: `${this.car.displacement}L` },
        { label: 'Drivetrain', value: this.car.drivetrain },
      ];
    },
    carDetails() {
      if (!this.car) return [];
      return [
        { label: 'Category', value: this.car.category },
        { label: 'Class', value: this.car.carClass },
        { label: 'PI Rating', value: this.car.stats?.piRating || 'N/A' },
        { label: 'Rarity', value: '★'.repeat(this.car.rarity) },
        { label: 'Credit Cost', value: this.car.creditCost.toLocaleString() + ' CR' },
      ];
    },
  },
  async mounted() {
    const id = this.$route.params.id as string;
    await this.carsStore.fetchCar(id);
  },
  methods: {
    async handleLike(buildId: string) {
      await useBuildsStore().toggleLike(buildId);
    },
    viewBuild(build: any) {
      this.$router.push({ name: 'community' });
    },
  },
});
</script>
