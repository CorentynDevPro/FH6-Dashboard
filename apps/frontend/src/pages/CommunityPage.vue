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
    <AppModal v-model="showCreateModal" title="Create New Build" size="lg">
      <form class="space-y-4" @submit.prevent="submitBuild">
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

export default defineComponent({
  name: 'CommunityPage',
  components: { BuildCard, BuildComments, AppButton, AppModal, AppInput, LoadingSpinner },
  data() {
    return {
      showDetailModal: false,
      showCreateModal: false,
      selectedBuild: null as Build | null,
      submitting: false,
      newBuild: {
        title: '',
        description: '',
        carId: '',
        tuneCode: '',
        isPublic: true,
      },
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
  },
  async mounted() {
    await Promise.all([
      this.buildsStore.fetchBuilds(),
      this.carsStore.fetchCars(),
    ]);
  },
  methods: {
    timeAgo,
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
    async submitBuild() {
      this.submitting = true;
      try {
        await this.buildsStore.createBuild({
          ...this.newBuild,
          tags: [],
        });
        this.showCreateModal = false;
        this.newBuild = { title: '', description: '', carId: '', tuneCode: '', isPublic: true };
      } catch {}
      finally {
        this.submitting = false;
      }
    },
  },
});
</script>
