<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Community Builds</h1>
        <p class="text-gray-500 dark:text-gray-400">{{ total }} builds shared</p>
      </div>
      <AppButton v-if="isLoggedIn" @click="showCreateModal = true">
        + New Build
      </AppButton>
    </div>

    <div v-if="loading" class="flex justify-center py-16">
      <LoadingSpinner label="Loading builds..." size="lg" />
    </div>

    <div v-else-if="builds.length === 0" class="text-center py-16">
      <div class="text-5xl mb-4">🔧</div>
      <p class="text-gray-500 dark:text-gray-400">No builds yet. Be the first!</p>
    </div>

    <div v-else>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <BuildCard
          v-for="build in builds"
          :key="build.id"
          :build="build"
          @like="handleLike"
          @view="openBuildDetail"
        />
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex justify-center gap-2 mt-8">
        <AppButton variant="outline" size="sm" :disabled="page === 1" @click="loadPage(page - 1)">← Prev</AppButton>
        <span class="flex items-center text-sm text-gray-500 dark:text-gray-400 px-3">{{ page }} / {{ totalPages }}</span>
        <AppButton variant="outline" size="sm" :disabled="page === totalPages" @click="loadPage(page + 1)">Next →</AppButton>
      </div>
    </div>

    <!-- Build Detail Modal -->
    <AppModal v-model="showDetailModal" :title="selectedBuild?.title" size="xl">
      <div v-if="selectedBuild">
        <div class="flex items-center gap-2 mb-4">
          <img v-if="selectedBuild.author?.avatarUrl" :src="selectedBuild.author.avatarUrl" class="w-7 h-7 rounded-full" />
          <span class="text-sm text-gray-600 dark:text-gray-400">by {{ selectedBuild.author?.displayName }}</span>
          <span class="text-xs text-gray-400 dark:text-gray-500">• {{ timeAgo(selectedBuild.createdAt) }}</span>
        </div>
        <p class="text-gray-600 dark:text-gray-400 mb-4">{{ selectedBuild.description }}</p>
        <div v-if="selectedBuild.tuneCode" class="p-3 bg-brand-50 dark:bg-brand-900/20 rounded-xl text-sm font-mono text-brand-700 dark:text-brand-400 mb-4">
          Tune Code: {{ selectedBuild.tuneCode }}
        </div>
        <BuildComments :build-id="selectedBuild.id" :initial-comments="selectedBuild.comments || []" />
      </div>
    </AppModal>

    <!-- Create Build Modal -->
    <AppModal v-model="showCreateModal" title="Create New Build" size="xl">
      <form class="space-y-4" @submit.prevent="submitBuild">
        <!-- Basic info -->
        <AppInput v-model="newBuild.title" label="Build Title" placeholder="e.g. Ultimate Drift Setup" required />
        <div>
          <label class="label">Car</label>
          <select v-model="newBuild.carId" class="input text-sm">
            <option value="">Select a car...</option>
            <option v-for="car in availableCars" :key="car.id" :value="car.id">
              {{ car.year }} {{ car.make }} {{ car.model }}
            </option>
          </select>
        </div>
        <div>
          <label class="label">Description</label>
          <textarea v-model="newBuild.description" rows="3" class="input resize-none" placeholder="Describe your build..." />
        </div>
        <AppInput v-model="newBuild.tuneCode" label="Tune Code (optional)" placeholder="123 456 789" />

        <!-- Tuning accordion -->
        <div class="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
          <button
            type="button"
            class="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700/50 text-sm font-semibold text-gray-800 dark:text-gray-200"
            @click="tuningOpen = !tuningOpen"
          >
            <span>⚙️ Tuning Setup (optional)</span>
            <span>{{ tuningOpen ? '▲' : '▼' }}</span>
          </button>

          <div v-if="tuningOpen" class="p-4 space-y-5">

            <!-- Tires -->
            <div>
              <h3 class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">🛞 Tires</h3>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label class="label">Compound</label>
                  <select v-model="setup.tires.compound" class="input text-sm py-1.5">
                    <option value="">—</option>
                    <option value="Street">Street</option>
                    <option value="Sport">Sport</option>
                    <option value="Race">Race</option>
                    <option value="Drag">Drag</option>
                    <option value="Offroad">Offroad</option>
                    <option value="Rally">Rally</option>
                    <option value="Drift">Drift</option>
                  </select>
                </div>
                <div>
                  <label class="label">Front Pressure (bar)</label>
                  <input v-model.number="setup.tires.frontPressure" type="number" step="0.1" min="1" max="4" class="input text-sm py-1.5" placeholder="2.0" />
                </div>
                <div>
                  <label class="label">Rear Pressure (bar)</label>
                  <input v-model.number="setup.tires.rearPressure" type="number" step="0.1" min="1" max="4" class="input text-sm py-1.5" placeholder="2.0" />
                </div>
                <div>
                  <label class="label">Front Width (mm)</label>
                  <input v-model.number="setup.tires.frontWidth" type="number" step="5" min="145" max="345" class="input text-sm py-1.5" placeholder="255" />
                </div>
                <div>
                  <label class="label">Rear Width (mm)</label>
                  <input v-model.number="setup.tires.rearWidth" type="number" step="5" min="145" max="345" class="input text-sm py-1.5" placeholder="275" />
                </div>
              </div>
            </div>

            <!-- Alignment -->
            <div>
              <h3 class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">🔧 Alignment</h3>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label class="label">Front Camber (°)</label>
                  <input v-model.number="setup.alignment.frontCamber" type="number" step="0.1" min="-5" max="5" class="input text-sm py-1.5" placeholder="-1.0" />
                </div>
                <div>
                  <label class="label">Rear Camber (°)</label>
                  <input v-model.number="setup.alignment.rearCamber" type="number" step="0.1" min="-5" max="5" class="input text-sm py-1.5" placeholder="-1.0" />
                </div>
                <div>
                  <label class="label">Front Toe (°)</label>
                  <input v-model.number="setup.alignment.frontToe" type="number" step="0.1" min="-5" max="5" class="input text-sm py-1.5" placeholder="0.0" />
                </div>
                <div>
                  <label class="label">Rear Toe (°)</label>
                  <input v-model.number="setup.alignment.rearToe" type="number" step="0.1" min="-5" max="5" class="input text-sm py-1.5" placeholder="0.2" />
                </div>
                <div>
                  <label class="label">Front Caster (°)</label>
                  <input v-model.number="setup.alignment.frontCaster" type="number" step="0.1" min="1" max="9" class="input text-sm py-1.5" placeholder="5.0" />
                </div>
              </div>
            </div>

            <!-- Anti-Roll Bars -->
            <div>
              <h3 class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">🪶 Anti-Roll Bars</h3>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="label">Front (1–65)</label>
                  <input v-model.number="setup.antiRollBars.front" type="number" step="1" min="1" max="65" class="input text-sm py-1.5" placeholder="30" />
                </div>
                <div>
                  <label class="label">Rear (1–65)</label>
                  <input v-model.number="setup.antiRollBars.rear" type="number" step="1" min="1" max="65" class="input text-sm py-1.5" placeholder="30" />
                </div>
              </div>
            </div>

            <!-- Springs & Ride Height -->
            <div>
              <h3 class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">🪵 Springs & Ride Height</h3>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label class="label">Front Ride Height (cm)</label>
                  <input v-model.number="setup.suspension.frontRideHeight" type="number" step="0.1" min="10" max="40" class="input text-sm py-1.5" placeholder="15" />
                </div>
                <div>
                  <label class="label">Rear Ride Height (cm)</label>
                  <input v-model.number="setup.suspension.rearRideHeight" type="number" step="0.1" min="10" max="40" class="input text-sm py-1.5" placeholder="15" />
                </div>
                <div>
                  <label class="label">Front Spring (kgf/mm)</label>
                  <input v-model.number="setup.suspension.frontSpringRate" type="number" step="0.5" min="10" max="200" class="input text-sm py-1.5" placeholder="50" />
                </div>
                <div>
                  <label class="label">Rear Spring (kgf/mm)</label>
                  <input v-model.number="setup.suspension.rearSpringRate" type="number" step="0.5" min="10" max="200" class="input text-sm py-1.5" placeholder="50" />
                </div>
              </div>
            </div>

            <!-- Dampers -->
            <div>
              <h3 class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">🧯 Dampers</h3>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label class="label">Front Compression</label>
                  <input v-model.number="setup.dampers.frontCompression" type="number" step="1" min="1" max="20" class="input text-sm py-1.5" placeholder="7" />
                </div>
                <div>
                  <label class="label">Rear Compression</label>
                  <input v-model.number="setup.dampers.rearCompression" type="number" step="1" min="1" max="20" class="input text-sm py-1.5" placeholder="7" />
                </div>
                <div>
                  <label class="label">Front Rebound</label>
                  <input v-model.number="setup.dampers.frontRebound" type="number" step="1" min="1" max="20" class="input text-sm py-1.5" placeholder="10" />
                </div>
                <div>
                  <label class="label">Rear Rebound</label>
                  <input v-model.number="setup.dampers.rearRebound" type="number" step="1" min="1" max="20" class="input text-sm py-1.5" placeholder="10" />
                </div>
              </div>
            </div>

            <!-- Aerodynamics -->
            <div>
              <h3 class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">⚖️ Aerodynamics</h3>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="label">Front Downforce</label>
                  <input v-model.number="setup.aero.frontDownforce" type="number" step="1" min="0" max="500" class="input text-sm py-1.5" placeholder="150" />
                </div>
                <div>
                  <label class="label">Rear Downforce</label>
                  <input v-model.number="setup.aero.rearDownforce" type="number" step="1" min="0" max="500" class="input text-sm py-1.5" placeholder="200" />
                </div>
              </div>
            </div>

            <!-- Transmission -->
            <div>
              <h3 class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">⚙️ Transmission</h3>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label class="label">Type</label>
                  <select v-model="setup.transmission.type" class="input text-sm py-1.5">
                    <option value="">—</option>
                    <option value="Stock">Stock</option>
                    <option value="Sport">Sport</option>
                    <option value="Race">Race</option>
                  </select>
                </div>
                <div>
                  <label class="label">Final Drive</label>
                  <input v-model.number="setup.transmission.finalDrive" type="number" step="0.01" min="2" max="6" class="input text-sm py-1.5" placeholder="3.90" />
                </div>
                <div v-for="g in gearCount" :key="`gear${g}`">
                  <label class="label">Gear {{ g }}</label>
                  <input v-model.number="setup.transmission['gear' + g]" type="number" step="0.01" min="0.5" max="6" class="input text-sm py-1.5" :placeholder="defaultGear(g)" />
                </div>
              </div>
            </div>

            <!-- Differential -->
            <div>
              <h3 class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">🔩 Differential</h3>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label class="label">Type</label>
                  <select v-model="setup.differential.type" class="input text-sm py-1.5">
                    <option value="">—</option>
                    <option value="Open">Open</option>
                    <option value="Sport">Sport</option>
                    <option value="Race">Race</option>
                  </select>
                </div>
                <template v-if="selectedDrivetrain === 'FWD' || selectedDrivetrain === ''">
                  <div>
                    <label class="label">FWD Accel (%)</label>
                    <input v-model.number="setup.differential.fwdAcceleration" type="number" step="1" min="0" max="100" class="input text-sm py-1.5" placeholder="30" />
                  </div>
                  <div>
                    <label class="label">FWD Decel (%)</label>
                    <input v-model.number="setup.differential.fwdDeceleration" type="number" step="1" min="0" max="100" class="input text-sm py-1.5" placeholder="5" />
                  </div>
                </template>
                <template v-if="selectedDrivetrain === 'RWD' || selectedDrivetrain === ''">
                  <div>
                    <label class="label">RWD Accel (%)</label>
                    <input v-model.number="setup.differential.rwdAcceleration" type="number" step="1" min="0" max="100" class="input text-sm py-1.5" placeholder="70" />
                  </div>
                  <div>
                    <label class="label">RWD Decel (%)</label>
                    <input v-model.number="setup.differential.rwdDeceleration" type="number" step="1" min="0" max="100" class="input text-sm py-1.5" placeholder="30" />
                  </div>
                </template>
                <template v-if="selectedDrivetrain === 'AWD' || selectedDrivetrain === ''">
                  <div>
                    <label class="label">AWD Front (%)</label>
                    <input v-model.number="setup.differential.awdFront" type="number" step="1" min="0" max="100" class="input text-sm py-1.5" placeholder="25" />
                  </div>
                  <div>
                    <label class="label">AWD Rear (%)</label>
                    <input v-model.number="setup.differential.awdRear" type="number" step="1" min="0" max="100" class="input text-sm py-1.5" placeholder="75" />
                  </div>
                  <div>
                    <label class="label">AWD Balance (%)</label>
                    <input v-model.number="setup.differential.awdBalance" type="number" step="1" min="0" max="100" class="input text-sm py-1.5" placeholder="70" />
                  </div>
                </template>
              </div>
            </div>

            <!-- Brakes -->
            <div>
              <h3 class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">⚡ Brakes</h3>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="label">Balance (% front)</label>
                  <input v-model.number="setup.brakes.balance" type="number" step="1" min="0" max="100" class="input text-sm py-1.5" placeholder="50" />
                </div>
                <div>
                  <label class="label">Pressure (%)</label>
                  <input v-model.number="setup.brakes.pressure" type="number" step="1" min="0" max="200" class="input text-sm py-1.5" placeholder="100" />
                </div>
              </div>
            </div>

          </div>
        </div>

        <div class="flex items-center gap-2">
          <input id="public" v-model="newBuild.isPublic" type="checkbox" class="rounded border-gray-300" />
          <label for="public" class="text-sm text-gray-700 dark:text-gray-300">Make this build public</label>
        </div>
        <div class="flex justify-end gap-3 pt-2">
          <AppButton variant="secondary" @click="showCreateModal = false">Cancel</AppButton>
          <AppButton type="submit" :loading="submitting" :disabled="!newBuild.title || !newBuild.carId">
            Create Build
          </AppButton>
        </div>
      </form>
    </AppModal>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BuildCard from '@/components/builds/BuildCard.vue';
import BuildComments from '@/components/builds/BuildComments.vue';
import AppButton from '@/components/common/AppButton.vue';
import AppModal from '@/components/common/AppModal.vue';
import AppInput from '@/components/common/AppInput.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import { useBuildsStore } from '@/stores/builds.store';
import { useCarsStore } from '@/stores/cars.store';
import { useAuthStore } from '@/stores/auth.store';
import { timeAgo } from '@fh6/ui';
import type { Build } from '@fh6/types';

interface TiresForm { compound: string; frontPressure: number | null; rearPressure: number | null; frontWidth: number | null; rearWidth: number | null; }
interface AlignmentForm { frontCamber: number | null; rearCamber: number | null; frontToe: number | null; rearToe: number | null; frontCaster: number | null; }
interface AntiRollBarsForm { front: number | null; rear: number | null; }
interface SuspensionForm { frontRideHeight: number | null; rearRideHeight: number | null; frontSpringRate: number | null; rearSpringRate: number | null; }
interface DampersForm { frontCompression: number | null; rearCompression: number | null; frontRebound: number | null; rearRebound: number | null; }
interface AeroForm { frontDownforce: number | null; rearDownforce: number | null; }
interface TransmissionForm { type: string; finalDrive: number | null; gear1: number | null; gear2: number | null; gear3: number | null; gear4: number | null; gear5: number | null; gear6: number | null; gear7: number | null; gear8: number | null; gear9: number | null; gear10: number | null; [key: string]: string | number | null; }
interface DifferentialForm { type: string; fwdAcceleration: number | null; fwdDeceleration: number | null; rwdAcceleration: number | null; rwdDeceleration: number | null; awdFront: number | null; awdRear: number | null; awdBalance: number | null; }
interface BrakesForm { balance: number | null; pressure: number | null; }

interface TuningFormState {
  tires: TiresForm;
  alignment: AlignmentForm;
  antiRollBars: AntiRollBarsForm;
  suspension: SuspensionForm;
  dampers: DampersForm;
  aero: AeroForm;
  transmission: TransmissionForm;
  differential: DifferentialForm;
  brakes: BrakesForm;
}

export default defineComponent({
  name: 'CommunityPage',
  components: { BuildCard, BuildComments, AppButton, AppModal, AppInput, LoadingSpinner },
  data() {
    return {
      showDetailModal: false,
      showCreateModal: false,
      selectedBuild: null as Build | null,
      submitting: false,
      tuningOpen: false,
      newBuild: {
        title: '',
        description: '',
        carId: '',
        tuneCode: '',
        isPublic: true,
      },
      setup: {
        tires: { compound: '', frontPressure: null, rearPressure: null, frontWidth: null, rearWidth: null },
        alignment: { frontCamber: null, rearCamber: null, frontToe: null, rearToe: null, frontCaster: null },
        antiRollBars: { front: null, rear: null },
        suspension: { frontRideHeight: null, rearRideHeight: null, frontSpringRate: null, rearSpringRate: null },
        dampers: { frontCompression: null, rearCompression: null, frontRebound: null, rearRebound: null },
        aero: { frontDownforce: null, rearDownforce: null },
        transmission: { type: '', finalDrive: null, gear1: null, gear2: null, gear3: null, gear4: null, gear5: null, gear6: null, gear7: null, gear8: null, gear9: null, gear10: null },
        differential: { type: '', fwdAcceleration: null, fwdDeceleration: null, rwdAcceleration: null, rwdDeceleration: null, awdFront: null, awdRear: null, awdBalance: null },
        brakes: { balance: null, pressure: null },
      } as TuningFormState,
    };
  },
  computed: {
    buildsStore() { return useBuildsStore(); },
    carsStore() { return useCarsStore(); },
    builds() { return this.buildsStore.builds; },
    total() { return this.buildsStore.total; },
    page() { return this.buildsStore.page; },
    totalPages() { return this.buildsStore.totalPages; },
    loading() { return this.buildsStore.loading; },
    isLoggedIn() { return useAuthStore().isLoggedIn; },
    availableCars() { return this.carsStore.cars; },
    selectedDrivetrain(): string {
      const car = this.carsStore.cars.find((c) => c.id === this.newBuild.carId);
      return car?.drivetrain ?? '';
    },
    gearCount(): number[] {
      return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    },
  },
  async mounted() {
    await Promise.all([
      this.buildsStore.fetchBuilds(),
      this.carsStore.fetchCars(),
    ]);
  },
  methods: {
    timeAgo,
    defaultGear(g: number): string {
      const defaults = ['3.50', '2.50', '1.80', '1.30', '1.00', '0.85', '0.72'];
      return defaults[g - 1] ?? '1.00';
    },
    async handleLike(buildId: string) {
      await this.buildsStore.toggleLike(buildId);
    },
    openBuildDetail(build: Build) {
      this.selectedBuild = build;
      this.showDetailModal = true;
    },
    loadPage(p: number) {
      this.buildsStore.fetchBuilds({ page: p });
    },
    buildSetupData() {
      const stripNulls = <T extends Record<string, unknown>>(obj: T) =>
        Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== null && v !== '' && v !== undefined));
      const s = this.setup;
      const result: Record<string, unknown> = {};
      const tires = stripNulls(s.tires as unknown as Record<string, unknown>); if (Object.keys(tires).length) result.tires = tires;
      const alignment = stripNulls(s.alignment as unknown as Record<string, unknown>); if (Object.keys(alignment).length) result.alignment = alignment;
      const arb = stripNulls(s.antiRollBars as unknown as Record<string, unknown>); if (Object.keys(arb).length) result.antiRollBars = arb;
      const susp = stripNulls(s.suspension as unknown as Record<string, unknown>); if (Object.keys(susp).length) result.suspension = susp;
      const damp = stripNulls(s.dampers as unknown as Record<string, unknown>); if (Object.keys(damp).length) result.dampers = damp;
      const aero = stripNulls(s.aero as unknown as Record<string, unknown>); if (Object.keys(aero).length) result.aero = aero;
      const trans = stripNulls(s.transmission as unknown as Record<string, unknown>); if (Object.keys(trans).length) result.transmission = trans;
      const diff = stripNulls(s.differential as unknown as Record<string, unknown>); if (Object.keys(diff).length) result.differential = diff;
      const brakes = stripNulls(s.brakes as unknown as Record<string, unknown>); if (Object.keys(brakes).length) result.brakes = brakes;
      return result;
    },
    async submitBuild() {
      this.submitting = true;
      try {
        await this.buildsStore.createBuild({
          ...this.newBuild,
          tags: [],
          setupData: this.buildSetupData(),
        });
        this.showCreateModal = false;
        this.newBuild = { title: '', description: '', carId: '', tuneCode: '', isPublic: true };
        this.tuningOpen = false;
        this.setup = {
          tires: { compound: '', frontPressure: null, rearPressure: null, frontWidth: null, rearWidth: null },
          alignment: { frontCamber: null, rearCamber: null, frontToe: null, rearToe: null, frontCaster: null },
          antiRollBars: { front: null, rear: null },
          suspension: { frontRideHeight: null, rearRideHeight: null, frontSpringRate: null, rearSpringRate: null },
          dampers: { frontCompression: null, rearCompression: null, frontRebound: null, rearRebound: null },
          aero: { frontDownforce: null, rearDownforce: null },
          transmission: { type: '', finalDrive: null, gear1: null, gear2: null, gear3: null, gear4: null, gear5: null, gear6: null, gear7: null, gear8: null, gear9: null, gear10: null },
          differential: { type: '', fwdAcceleration: null, fwdDeceleration: null, rwdAcceleration: null, rwdDeceleration: null, awdFront: null, awdRear: null, awdBalance: null },
          brakes: { balance: null, pressure: null },
        } as TuningFormState;
      } catch {}
      finally {
        this.submitting = false;
      }
    },
  },
});
</script>
