<template>
  <div>
    <!-- Hero -->
    <section class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-brand-900 p-8 sm:p-12 mb-8 text-white">
      <div class="relative z-10">
        <div class="inline-flex items-center gap-2 bg-brand-500/20 border border-brand-500/30 rounded-full px-4 py-1.5 text-sm font-medium text-brand-400 mb-4">
          <span>🏎️</span>
          <span>Season: Horizon Rush</span>
        </div>
        <h1 class="text-3xl sm:text-5xl font-black tracking-tight mb-4">
          Your Ultimate<br />
          <span class="text-brand-400">FH6 Companion</span>
        </h1>
        <p class="text-gray-300 max-w-xl text-lg mb-6">
          Track your garage, share builds, climb leaderboards, and conquer challenges in Forza Horizon 6.
        </p>
        <div class="flex flex-wrap gap-3">
          <RouterLink
            :to="{ name: 'garage' }"
            class="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
          >
            🚗 View Garage
          </RouterLink>
          <RouterLink
            :to="{ name: 'community' }"
            class="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-semibold transition-colors backdrop-blur-sm"
          >
            🌐 Community Builds
          </RouterLink>
        </div>
      </div>
      <div class="absolute right-0 top-0 w-1/2 h-full opacity-10 text-[20rem] flex items-center justify-center select-none pointer-events-none">
        🏎️
      </div>
    </section>

    <!-- Stats row -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
      <StatsCard label="Total Cars" value="500+" icon="🚗" icon-bg="bg-blue-50 dark:bg-blue-900/20" />
      <StatsCard label="Community Builds" :value="totalBuilds" icon="🔧" icon-bg="bg-brand-50 dark:bg-brand-900/20" />
      <StatsCard label="Active Players" value="12,450" icon="👥" icon-bg="bg-green-50 dark:bg-green-900/20" />
      <StatsCard label="Challenges" value="5" icon="🎯" icon-bg="bg-purple-50 dark:bg-purple-900/20" />
    </div>

    <!-- Trending Builds -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white">🔥 Trending Builds</h2>
        <RouterLink :to="{ name: 'community' }" class="text-sm text-brand-600 dark:text-brand-400 hover:underline font-medium">
          View all →
        </RouterLink>
      </div>

      <div v-if="loadingBuilds" class="flex justify-center py-12">
        <LoadingSpinner label="Loading builds..." />
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <BuildCard
          v-for="build in trendingBuilds"
          :key="build.id"
          :build="build"
          @like="handleLike"
          @view="viewBuild"
        />
      </div>
    </div>

    <!-- Featured Cars -->
    <div>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white">⭐ Featured Cars</h2>
        <RouterLink :to="{ name: 'garage' }" class="text-sm text-brand-600 dark:text-brand-400 hover:underline font-medium">
          Browse garage →
        </RouterLink>
      </div>

      <div v-if="loadingCars" class="flex justify-center py-12">
        <LoadingSpinner />
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <CarCard
          v-for="car in featuredCars"
          :key="car.id"
          :car="car"
          @click="goToCar"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { RouterLink } from 'vue-router';
import StatsCard from '@/components/dashboard/StatsCard.vue';
import BuildCard from '@/components/builds/BuildCard.vue';
import CarCard from '@/components/cars/CarCard.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import { useBuildsStore } from '@/stores/builds.store';
import { useCarsStore } from '@/stores/cars.store';
import type { Car, Build } from '@fh6/types';

export default defineComponent({
  name: 'HomePage',
  components: { RouterLink, StatsCard, BuildCard, CarCard, LoadingSpinner },
  data() {
    return {
      loadingBuilds: false,
      loadingCars: false,
    };
  },
  computed: {
    buildsStore() {
      return useBuildsStore();
    },
    carsStore() {
      return useCarsStore();
    },
    trendingBuilds() {
      return this.buildsStore.trendingBuilds.slice(0, 6);
    },
    featuredCars() {
      return this.carsStore.cars.slice(0, 4);
    },
    totalBuilds(): number {
      return this.buildsStore.total;
    },
  },
  async mounted() {
    this.loadingBuilds = true;
    this.loadingCars = true;
    await Promise.all([
      this.buildsStore.fetchTrending(),
      this.carsStore.fetchCars({ pageSize: 4 } as any),
    ]);
    this.loadingBuilds = false;
    this.loadingCars = false;
  },
  methods: {
    async handleLike(buildId: string) {
      const buildsStore = useBuildsStore();
      await buildsStore.toggleLike(buildId);
    },
    viewBuild(build: Build) {
      this.$router.push({ name: 'community' });
    },
    goToCar(car: Car) {
      this.$router.push({ name: 'car-detail', params: { id: car.id } });
    },
  },
});
</script>
