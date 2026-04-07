<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Garage</h1>
        <p class="text-gray-500 dark:text-gray-400">{{ total }} cars found</p>
      </div>
    </div>

    <CarFilters class="mb-6" @filter="handleFilter" />

    <div v-if="loading" class="flex justify-center py-16">
      <LoadingSpinner label="Loading cars..." size="lg" />
    </div>

    <div v-else-if="error" class="text-center py-16 text-red-500">
      {{ error }}
    </div>

    <div v-else-if="cars.length === 0" class="text-center py-16">
      <div class="text-5xl mb-4">🚗</div>
      <p class="text-gray-500 dark:text-gray-400">No cars match your filters</p>
    </div>

    <div v-else>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <CarCard
          v-for="car in cars"
          :key="car.id"
          :car="car"
          @click="goToCar"
        />
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex items-center justify-center gap-2 mt-8">
        <AppButton
          variant="outline"
          size="sm"
          :disabled="page === 1"
          @click="setPage(page - 1)"
        >
          ← Previous
        </AppButton>

        <div class="flex items-center gap-1">
          <button
            v-for="p in visiblePages"
            :key="p"
            :class="[
              'w-9 h-9 rounded-lg text-sm font-medium transition-colors',
              p === page
                ? 'bg-brand-500 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700',
            ]"
            @click="setPage(p)"
          >
            {{ p }}
          </button>
        </div>

        <AppButton
          variant="outline"
          size="sm"
          :disabled="page === totalPages"
          @click="setPage(page + 1)"
        >
          Next →
        </AppButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CarCard from '@/components/cars/CarCard.vue';
import CarFilters from '@/components/cars/CarFilters.vue';
import AppButton from '@/components/common/AppButton.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import { useCarsStore } from '@/stores/cars.store';
import type { Car } from '@fh6/types';

export default defineComponent({
  name: 'GaragePage',
  components: { CarCard, CarFilters, AppButton, LoadingSpinner },
  computed: {
    store() { return useCarsStore(); },
    cars() { return this.store.cars; },
    total() { return this.store.total; },
    page() { return this.store.page; },
    totalPages() { return this.store.totalPages; },
    loading() { return this.store.loading; },
    error() { return this.store.error; },
    visiblePages(): number[] {
      const range = [];
      const start = Math.max(1, this.page - 2);
      const end = Math.min(this.totalPages, start + 4);
      for (let i = start; i <= end; i++) range.push(i);
      return range;
    },
  },
  async mounted() {
    await this.store.fetchCars();
  },
  methods: {
    handleFilter(filters: any) {
      this.store.page = 1;
      this.store.fetchCars(filters);
    },
    setPage(p: number) {
      this.store.setPage(p);
    },
    goToCar(car: Car) {
      this.$router.push({ name: 'car-detail', params: { id: car.id } });
    },
  },
});
</script>
