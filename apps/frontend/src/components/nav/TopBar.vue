<template>
  <header class="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
    <div class="flex items-center gap-4 px-4 sm:px-6 h-16">
      <!-- Mobile menu toggle -->
      <button
        class="lg:hidden p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        @click="$emit('toggle-sidebar')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <!-- Page title -->
      <div class="flex-1">
        <h2 class="text-base font-semibold text-gray-900 dark:text-white">{{ pageTitle }}</h2>
      </div>

      <!-- Right side actions -->
      <div class="flex items-center gap-2">
        <DarkModeToggle />

        <template v-if="isLoggedIn">
          <RouterLink
            :to="{ name: 'profile' }"
            class="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <img
              v-if="user?.avatarUrl"
              :src="user.avatarUrl"
              :alt="user.displayName"
              class="w-8 h-8 rounded-full"
            />
            <div v-else class="w-8 h-8 bg-brand-100 dark:bg-brand-900/30 rounded-full flex items-center justify-center">
              <span class="text-brand-600 text-sm font-semibold">
                {{ user?.displayName?.charAt(0).toUpperCase() }}
              </span>
            </div>
          </RouterLink>
        </template>

        <RouterLink
          v-else
          :to="{ name: 'login' }"
          class="inline-flex items-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Sign In
        </RouterLink>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { RouterLink } from 'vue-router';
import DarkModeToggle from '@/components/common/DarkModeToggle.vue';
import { useAuthStore } from '@/stores/auth.store';

const pageTitles: Record<string, string> = {
  home: 'Home',
  dashboard: 'Dashboard',
  garage: 'Garage',
  'car-detail': 'Car Details',
  community: 'Community Builds',
  leaderboard: 'Leaderboard',
  profile: 'Profile',
  'user-profile': 'Player Profile',
};

export default defineComponent({
  name: 'TopBar',
  components: { RouterLink, DarkModeToggle },
  emits: ['toggle-sidebar'],
  computed: {
    authStore() {
      return useAuthStore();
    },
    user() {
      return this.authStore.user;
    },
    isLoggedIn() {
      return this.authStore.isLoggedIn;
    },
    pageTitle(): string {
      const routeName = this.$route.name as string;
      return pageTitles[routeName] || 'FH6 Dashboard';
    },
  },
});
</script>
