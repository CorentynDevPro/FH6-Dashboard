<template>
  <AppCard title="Filters" padding="sm">
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <!-- Brand filter -->
      <div>
        <label class="label">Brand</label>
        <input
          v-model="localFilters.brand"
          type="text"
          placeholder="e.g. Ford"
          class="input text-sm py-2"
          @input="debouncedEmit"
        />
      </div>

      <!-- Category filter -->
      <div>
        <label class="label">Category</label>
        <select v-model="localFilters.category" class="input text-sm py-2" @change="emitFilters">
          <option value="">All Categories</option>
          <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
        </select>
      </div>

      <!-- Class filter -->
      <div>
        <label class="label">Class</label>
        <select v-model="localFilters.carClass" class="input text-sm py-2" @change="emitFilters">
          <option value="">All Classes</option>
          <option v-for="cls in classes" :key="cls" :value="cls">{{ cls }}</option>
        </select>
      </div>

      <!-- Drivetrain filter -->
      <div>
        <label class="label">Drivetrain</label>
        <select v-model="localFilters.drivetrain" class="input text-sm py-2" @change="emitFilters">
          <option value="">All</option>
          <option value="AWD">AWD</option>
          <option value="RWD">RWD</option>
          <option value="FWD">FWD</option>
        </select>
      </div>
    </div>

    <div class="flex justify-end mt-3">
      <AppButton variant="ghost" size="sm" @click="resetFilters">Reset Filters</AppButton>
    </div>
  </AppCard>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AppCard from '@/components/common/AppCard.vue';
import AppButton from '@/components/common/AppButton.vue';

export default defineComponent({
  name: 'CarFilters',
  components: { AppCard, AppButton },
  emits: ['filter'],
  data() {
    return {
      localFilters: {
        brand: '',
        category: '',
        carClass: '',
        drivetrain: '',
      } as Record<string, string>,
      debounceTimer: null as ReturnType<typeof setTimeout> | null,
      categories: ['SPORT', 'SUV', 'TRUCK', 'CLASSIC', 'OFFROAD', 'HYPERCAR', 'MUSCLE', 'BUGGY', 'SUPERCAR', 'TRACK_TOY', 'HOT_HATCH', 'RALLY', 'ELECTRIC', 'DRIFT'],
      classes: ['D', 'C', 'B', 'A', 'S1', 'S2', 'X'],
    };
  },
  methods: {
    debouncedEmit() {
      if (this.debounceTimer) clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.emitFilters();
      }, 400);
    },
    emitFilters() {
      const filters: Record<string, string> = {};
      Object.entries(this.localFilters).forEach(([key, val]) => {
        if (val) filters[key] = val;
      });
      this.$emit('filter', filters);
    },
    resetFilters() {
      this.localFilters = { brand: '', category: '', carClass: '', drivetrain: '' };
      this.$emit('filter', {});
    },
  },
});
</script>
