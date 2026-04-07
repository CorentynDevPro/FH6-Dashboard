<template>
  <div>
    <div v-if="loading" class="flex justify-center py-20">
      <LoadingSpinner label="Loading profile..." size="lg" />
    </div>

    <div v-else-if="!profile" class="text-center py-20">
      <p class="text-gray-500 dark:text-gray-400">User not found</p>
    </div>

    <template v-else>
      <!-- Profile Header -->
      <div class="card p-6 mb-6">
        <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <!-- Avatar -->
          <div class="relative">
            <img
              v-if="profile.avatarUrl"
              :src="profile.avatarUrl"
              :alt="profile.displayName"
              class="w-24 h-24 rounded-2xl"
            />
            <div v-else class="w-24 h-24 bg-brand-100 dark:bg-brand-900/30 rounded-2xl flex items-center justify-center text-4xl font-bold text-brand-600">
              {{ profile.displayName.charAt(0) }}
            </div>
            <AppBadge
              v-if="profile.role !== 'USER'"
              :variant="profile.role === 'ADMIN' ? 'danger' : 'warning'"
              class="absolute -bottom-2 left-1/2 -translate-x-1/2"
            >
              {{ profile.role }}
            </AppBadge>
          </div>

          <div class="flex-1 text-center sm:text-left">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ profile.displayName }}</h1>
            <p class="text-gray-500 dark:text-gray-400 text-sm">@{{ profile.username }}</p>
            <p v-if="profile.bio" class="mt-2 text-gray-600 dark:text-gray-400 text-sm max-w-lg">{{ profile.bio }}</p>

            <div class="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-4">
              <div class="text-center">
                <div class="text-lg font-bold text-gray-900 dark:text-white">{{ profile.totalBuilds || 0 }}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">Builds</div>
              </div>
              <div class="text-center">
                <div class="text-lg font-bold text-gray-900 dark:text-white">{{ profile.totalLikes || 0 }}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">Likes Given</div>
              </div>
              <div v-if="profile.country" class="text-center">
                <div class="text-lg">{{ getFlagEmoji(profile.country) }}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">{{ profile.country }}</div>
              </div>
            </div>
          </div>

          <!-- Edit button (own profile only) -->
          <div v-if="isOwnProfile">
            <AppButton variant="outline" size="sm" @click="showEditModal = true">
              ✏️ Edit Profile
            </AppButton>
          </div>
        </div>
      </div>

      <!-- Progress + Stats -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <AppCard title="Progress" class="lg:col-span-2">
          <div v-if="profile.progress">
            <div class="flex items-center gap-3 mb-4">
              <div class="text-3xl font-black text-brand-500">Lv.{{ profile.progress.level }}</div>
              <div class="flex-1">
                <div class="flex justify-between text-xs text-gray-500 mb-1">
                  <span>{{ profile.progress.xp.toLocaleString() }} XP</span>
                  <span>{{ profile.progress.xpToNextLevel.toLocaleString() }} XP</span>
                </div>
                <div class="h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full">
                  <div class="h-full bg-brand-500 rounded-full" :style="{ width: `${xpPercent}%` }" />
                </div>
              </div>
            </div>
            <div class="grid grid-cols-3 gap-3">
              <div class="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div class="text-xl font-bold text-gray-900 dark:text-white">{{ profile.progress.racesCompleted.toLocaleString() }}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">Races</div>
              </div>
              <div class="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div class="text-xl font-bold text-gray-900 dark:text-white">{{ profile.progress.carsOwned }}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">Cars</div>
              </div>
              <div class="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div class="text-xl font-bold text-gray-900 dark:text-white">{{ profile.progress.challengesCompleted }}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">Challenges</div>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-6 text-gray-400">No progress data</div>
        </AppCard>

        <!-- Achievements -->
        <AppCard title="Achievements">
          <div v-if="profile.achievements && profile.achievements.length > 0" class="space-y-3">
            <div
              v-for="achievement in profile.achievements"
              :key="achievement.id"
              class="flex items-center gap-3 p-2 rounded-xl bg-gray-50 dark:bg-gray-700/50"
            >
              <span class="text-2xl">{{ achievement.icon }}</span>
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ achievement.name }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ achievement.description }}</p>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-6 text-gray-400">No achievements yet</div>
        </AppCard>
      </div>
    </template>

    <!-- Edit Profile Modal -->
    <AppModal v-model="showEditModal" title="Edit Profile" size="md">
      <form class="space-y-4" @submit.prevent="saveProfile">
        <AppInput v-model="editForm.displayName" label="Display Name" />
        <div>
          <label class="label">Bio</label>
          <textarea v-model="editForm.bio" rows="3" class="input resize-none" placeholder="Tell us about yourself..." />
        </div>
        <AppInput v-model="editForm.country" label="Country Code" placeholder="US" hint="2-letter country code" />
        <AppInput v-model="editForm.avatarUrl" label="Avatar URL" type="url" />
        <div class="flex justify-end gap-3 pt-2">
          <AppButton variant="secondary" @click="showEditModal = false">Cancel</AppButton>
          <AppButton type="submit" :loading="saving">Save Changes</AppButton>
        </div>
      </form>
    </AppModal>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AppCard from '@/components/common/AppCard.vue';
import AppBadge from '@/components/common/AppBadge.vue';
import AppButton from '@/components/common/AppButton.vue';
import AppModal from '@/components/common/AppModal.vue';
import AppInput from '@/components/common/AppInput.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import { usersApi } from '@/api/users.api';
import { useAuthStore } from '@/stores/auth.store';
import type { UserProfile } from '@fh6/types';

export default defineComponent({
  name: 'ProfilePage',
  components: { AppCard, AppBadge, AppButton, AppModal, AppInput, LoadingSpinner },
  data() {
    return {
      profile: null as UserProfile | null,
      loading: false,
      showEditModal: false,
      saving: false,
      editForm: {
        displayName: '',
        bio: '',
        country: '',
        avatarUrl: '',
      },
    };
  },
  computed: {
    authStore() { return useAuthStore(); },
    currentUser() { return this.authStore.user; },
    isOwnProfile(): boolean {
      if (!this.profile || !this.currentUser) return false;
      return this.profile.id === this.currentUser.id;
    },
    xpPercent(): number {
      if (!this.profile?.progress) return 0;
      return Math.min((this.profile.progress.xp / this.profile.progress.xpToNextLevel) * 100, 100);
    },
  },
  async mounted() {
    await this.loadProfile();
  },
  methods: {
    async loadProfile() {
      this.loading = true;
      try {
        const id = this.$route.params.id as string;
        this.profile = id ? await usersApi.getUser(id) : await usersApi.getMe();
        if (this.isOwnProfile) {
          this.editForm = {
            displayName: this.profile.displayName,
            bio: this.profile.bio || '',
            country: this.profile.country || '',
            avatarUrl: this.profile.avatarUrl || '',
          };
        }
      } catch {}
      finally {
        this.loading = false;
      }
    },
    async saveProfile() {
      this.saving = true;
      try {
        const updated = await usersApi.updateMe(this.editForm);
        this.authStore.setUser({ ...this.currentUser!, ...updated });
        if (this.profile) {
          this.profile = { ...this.profile, ...updated };
        }
        this.showEditModal = false;
      } catch {}
      finally {
        this.saving = false;
      }
    },
    getFlagEmoji(country: string): string {
      return country.toUpperCase().replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
    },
  },
});
</script>
