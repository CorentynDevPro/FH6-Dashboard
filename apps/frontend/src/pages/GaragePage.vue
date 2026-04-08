<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Garage</h1>
        <p class="text-gray-500 dark:text-gray-400">{{ total }} cars found</p>
      </div>
      <div class="flex items-center gap-2">
        <AppButton
          v-if="isStaff"
          variant="primary"
          size="sm"
          @click="showAddCarModal = true"
        >
          ➕ Add Car
        </AppButton>
        <button
          v-if="isLoggedIn"
          :class="[
            'px-4 py-2 rounded-xl text-sm font-medium transition-colors',
            showMyCollection
              ? 'bg-brand-500 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600',
          ]"
          @click="toggleMyCollection"
        >
          ♥ My Collection ({{ collectionCount }})
        </button>
      </div>
    </div>

    <CarFilters v-if="!showMyCollection" class="mb-6" @filter="handleFilter" />

    <div v-if="loading || collectionLoading" class="flex justify-center py-16">
      <LoadingSpinner label="Loading cars..." size="lg" />
    </div>

    <div v-else-if="error" class="text-center py-16 text-red-500">
      {{ error }}
    </div>

    <div v-else-if="displayedCars.length === 0" class="text-center py-16">
      <div class="text-5xl mb-4">🚗</div>
      <p class="text-gray-500 dark:text-gray-400">
        {{ showMyCollection ? 'No cars in your collection yet' : 'No cars match your filters' }}
      </p>
    </div>

    <div v-else>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <CarCard
          v-for="car in displayedCars"
          :key="car.id"
          :car="car"
          @click="goToCar"
        />
      </div>

      <!-- Pagination (only for all-cars view) -->
      <div v-if="!showMyCollection && totalPages > 1" class="flex items-center justify-center gap-2 mt-8">
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

    <!-- Add Car Modal (ADMIN / MODERATOR only) -->
    <AddCarModal v-if="isStaff" v-model="showAddCarModal" @created="onCarCreated" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CarCard from '@/components/cars/CarCard.vue';
import CarFilters from '@/components/cars/CarFilters.vue';
import AddCarModal from '@/components/cars/AddCarModal.vue';
import AppButton from '@/components/common/AppButton.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import { useCarsStore } from '@/stores/cars.store';
import { useAuthStore } from '@/stores/auth.store';
import type { Car } from '@fh6/types';

export default defineComponent({
  name: 'GaragePage',
  components: { CarCard, CarFilters, AddCarModal, AppButton, LoadingSpinner },
  data() {
    return {
      showMyCollection: false,
      showAddCarModal: false,
    };
  },
  computed: {
    store() { return useCarsStore(); },
    authStore() { return useAuthStore(); },
    isLoggedIn() { return this.authStore.isLoggedIn; },
    isStaff() {
      const role = this.authStore.user?.role;
      return role === 'ADMIN' || role === 'MODERATOR';
    },
    cars() { return this.store.cars; },
    total() { return this.store.total; },
    page() { return this.store.page; },
    totalPages() { return this.store.totalPages; },
    loading() { return this.store.loading; },
    collectionLoading() { return this.store.collectionLoading; },
    error() { return this.store.error; },
    myCollection() { return this.store.myCollection; },
    collectionCount() { return this.store.myCollection.length; },
    displayedCars(): Car[] {
      if (this.showMyCollection) {
        return this.myCollection.map((uc) => uc.car);
      }
      return this.cars;
    },
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
    if (this.isLoggedIn) {
      await this.store.fetchCollection();
    }
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
    async toggleMyCollection() {
      this.showMyCollection = !this.showMyCollection;
      if (this.showMyCollection && this.isLoggedIn) {
        await this.store.fetchCollection();
      }
    },
    onCarCreated() {
      this.store.fetchCars();
    },
  },
});
</script>
