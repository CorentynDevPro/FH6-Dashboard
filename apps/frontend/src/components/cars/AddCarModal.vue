<template>
  <AppModal v-model="isOpen" title="🚗 Add New Car" size="xl" @update:model-value="onModalToggle">
    <form class="space-y-5" @submit.prevent="submit">

      <!-- Identity -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label class="label">Make *</label>
          <input v-model="form.make" type="text" class="input text-sm" placeholder="e.g. Ford" required />
        </div>
        <div>
          <label class="label">Model *</label>
          <input v-model="form.model" type="text" class="input text-sm" placeholder="e.g. Mustang GT500" required />
        </div>
        <div>
          <label class="label">Year *</label>
          <input v-model.number="form.year" type="number" class="input text-sm" min="1900" :max="currentYear + 2" required />
        </div>
      </div>

      <!-- Classification -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label class="label">Category *</label>
          <select v-model="form.category" class="input text-sm" required>
            <option value="">Select category</option>
            <option v-for="cat in categories" :key="cat.value" :value="cat.value">{{ cat.label }}</option>
          </select>
        </div>
        <div>
          <label class="label">Class *</label>
          <select v-model="form.carClass" class="input text-sm" required>
            <option value="">Select class</option>
            <option v-for="cls in classes" :key="cls" :value="cls">{{ cls }}</option>
          </select>
        </div>
        <div>
          <label class="label">Drivetrain *</label>
          <select v-model="form.drivetrain" class="input text-sm" required>
            <option value="">Select drivetrain</option>
            <option value="FWD">FWD</option>
            <option value="RWD">RWD</option>
            <option value="AWD">AWD</option>
          </select>
        </div>
      </div>

      <!-- Engine -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="label">Engine Type *</label>
          <input v-model="form.engineType" type="text" class="input text-sm" placeholder="e.g. Twin-Turbo V8" required />
        </div>
        <div>
          <label class="label">Displacement (L) *</label>
          <input v-model.number="form.displacement" type="number" class="input text-sm" step="0.1" min="0.1" max="20" required />
        </div>
      </div>

      <!-- Performance specs -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label class="label">Horsepower (hp) *</label>
          <input v-model.number="form.horsepower" type="number" class="input text-sm" min="1" required />
        </div>
        <div>
          <label class="label">Torque (lb-ft) *</label>
          <input v-model.number="form.torque" type="number" class="input text-sm" min="1" required />
        </div>
        <div>
          <label class="label">Weight (kg) *</label>
          <input v-model.number="form.weight" type="number" class="input text-sm" min="100" required />
        </div>
      </div>

      <!-- Extras -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="label">Credit Cost</label>
          <input v-model.number="form.creditCost" type="number" class="input text-sm" min="0" placeholder="0" />
        </div>
        <div>
          <label class="label">Rarity</label>
          <select v-model="form.rarity" class="input text-sm">
            <option v-for="r in rarities" :key="r.value" :value="r.value">{{ r.label }}</option>
          </select>
        </div>
        <div>
          <label class="label">Image URL</label>
          <input v-model="form.imageUrl" type="url" class="input text-sm" placeholder="https://..." />
        </div>
        <div class="flex items-center gap-3 pt-5">
          <input id="forzaEdition" v-model="form.isForzaEdition" type="checkbox" class="w-4 h-4 accent-amber-500" />
          <label for="forzaEdition" class="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer select-none">
            ✦ Forza Edition
          </label>
        </div>
      </div>

      <!-- Stats section -->
      <div class="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
        <button
          type="button"
          class="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700/50 text-sm font-semibold text-gray-800 dark:text-gray-200"
          @click="statsOpen = !statsOpen"
        >
          <span>📊 Performance Stats (optional)</span>
          <span>{{ statsOpen ? '▲' : '▼' }}</span>
        </button>
        <div v-if="statsOpen" class="p-4">
          <p class="text-xs text-gray-400 dark:text-gray-500 mb-3">All stats are on a 0–10 scale. PI Rating: 100–999.</p>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label class="label">Speed</label>
              <input v-model.number="form.stats.speed" type="number" step="0.1" min="0" max="10" class="input text-sm py-1.5" placeholder="5.0" />
            </div>
            <div>
              <label class="label">Handling</label>
              <input v-model.number="form.stats.handling" type="number" step="0.1" min="0" max="10" class="input text-sm py-1.5" placeholder="5.0" />
            </div>
            <div>
              <label class="label">Acceleration</label>
              <input v-model.number="form.stats.acceleration" type="number" step="0.1" min="0" max="10" class="input text-sm py-1.5" placeholder="5.0" />
            </div>
            <div>
              <label class="label">Launch</label>
              <input v-model.number="form.stats.launch" type="number" step="0.1" min="0" max="10" class="input text-sm py-1.5" placeholder="5.0" />
            </div>
            <div>
              <label class="label">Braking</label>
              <input v-model.number="form.stats.braking" type="number" step="0.1" min="0" max="10" class="input text-sm py-1.5" placeholder="5.0" />
            </div>
            <div>
              <label class="label">Offroad</label>
              <input v-model.number="form.stats.offroad" type="number" step="0.1" min="0" max="10" class="input text-sm py-1.5" placeholder="5.0" />
            </div>
            <div class="col-span-2">
              <label class="label">PI Rating (100–999)</label>
              <input v-model.number="form.stats.piRating" type="number" min="100" max="999" class="input text-sm py-1.5" placeholder="500" />
            </div>
          </div>
        </div>
      </div>

      <!-- Error -->
      <div v-if="error" class="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
        {{ error }}
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-3 pt-2">
        <AppButton variant="secondary" type="button" @click="isOpen = false">Cancel</AppButton>
        <AppButton type="submit" :loading="submitting" :disabled="!isFormValid">
          Add Car
        </AppButton>
      </div>
    </form>
  </AppModal>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AppModal from '@/components/common/AppModal.vue';
import AppButton from '@/components/common/AppButton.vue';
import { useCarsStore } from '@/stores/cars.store';

const CATEGORIES = [
  { value: 'SUPERCAR', label: 'Supercar' },
  { value: 'HYPERCAR', label: 'Hypercar' },
  { value: 'TRACK_TOY', label: 'Track Toy' },
  { value: 'SPORT', label: 'Sport' },
  { value: 'HOT_HATCH', label: 'Hot Hatch' },
  { value: 'MUSCLE', label: 'Muscle' },
  { value: 'DRIFT', label: 'Drift' },
  { value: 'RALLY', label: 'Rally' },
  { value: 'OFFROAD', label: 'Offroad' },
  { value: 'CLASSIC', label: 'Classic' },
  { value: 'ELECTRIC', label: 'Electric' },
  { value: 'SUV', label: 'SUV' },
  { value: 'TRUCK', label: 'Truck' },
  { value: 'BUGGY', label: 'Buggy' },
];

const RARITIES = [
  { value: 'COMMON',     label: 'Common' },
  { value: 'RARE',       label: 'Rare' },
  { value: 'ULTRA_RARE', label: 'Ultra Rare' },
  { value: 'EPIC',       label: 'Epic' },
  { value: 'LEGENDARY',  label: 'Legendary' },
];

const EMPTY_FORM = () => ({
  make: '',
  model: '',
  year: new Date().getFullYear(),
  category: '',
  carClass: '',
  drivetrain: '',
  engineType: '',
  displacement: null as number | null,
  horsepower: null as number | null,
  torque: null as number | null,
  weight: null as number | null,
  creditCost: 0,
  rarity: 'COMMON' as string,
  isForzaEdition: false,
  imageUrl: '',
  stats: {
    speed: null as number | null,
    handling: null as number | null,
    acceleration: null as number | null,
    launch: null as number | null,
    braking: null as number | null,
    offroad: null as number | null,
    piRating: null as number | null,
  },
});

export default defineComponent({
  name: 'AddCarModal',
  components: { AppModal, AppButton },
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue', 'created'],
  data() {
    return {
      form: EMPTY_FORM(),
      statsOpen: false,
      submitting: false,
      error: null as string | null,
      categories: CATEGORIES,
      classes: ['D', 'C', 'B', 'A', 'S1', 'S2', 'X'],
      rarities: RARITIES,
    };
  },
  computed: {
    isOpen: {
      get(): boolean { return this.modelValue; },
      set(val: boolean) { this.$emit('update:modelValue', val); },
    },
    currentYear(): number { return new Date().getFullYear(); },
    isFormValid(): boolean {
      const f = this.form;
      return !!(
        f.make && f.model && f.year && f.category && f.carClass && f.drivetrain &&
        f.engineType && f.displacement && f.horsepower && f.torque && f.weight
      );
    },
  },
  methods: {
    onModalToggle(val: boolean) {
      if (!val) this.reset();
    },
    reset() {
      this.form = EMPTY_FORM();
      this.statsOpen = false;
      this.error = null;
    },
    async submit() {
      this.submitting = true;
      this.error = null;
      try {
        const { stats, ...rest } = this.form;
        const hasStats = Object.values(stats).some((v) => v !== null);
        const payload: Record<string, unknown> = { ...rest };
        if (!payload.imageUrl) delete payload.imageUrl;
        if (hasStats) payload.stats = stats;

        await useCarsStore().createCar(payload as any);
        this.isOpen = false;
        this.$emit('created');
        this.reset();
      } catch (err: any) {
        this.error = err.response?.data?.message || err.message || 'Failed to add car';
      } finally {
        this.submitting = false;
      }
    },
  },
});
</script>
