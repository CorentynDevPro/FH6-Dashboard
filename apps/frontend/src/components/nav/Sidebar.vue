<template>
  <aside
    :class="[
      'fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out flex flex-col',
      isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
    ]"
  >
    <!-- Logo -->
    <div class="flex items-center gap-3 px-6 py-5 border-b border-gray-200 dark:border-gray-700">
      <div class="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center shadow">
        <span class="text-xl">🏎️</span>
      </div>
      <div>
        <div class="text-base font-bold text-gray-900 dark:text-white">FH6 Dashboard</div>
        <div class="text-xs text-gray-500 dark:text-gray-400">Forza Horizon 6</div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 py-4 overflow-y-auto">
      <div class="px-3 space-y-1">
        <RouterLink
          v-for="item in navItems"
          :key="item.name"
          :to="item.to"
          :class="[
            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group',
            isActive(item.to)
              ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white',
          ]"
          @click="$emit('close')"
        >
          <span class="text-lg">{{ item.icon }}</span>
          <span>{{ item.name }}</span>
          <span v-if="item.badge" class="ml-auto text-xs bg-brand-500 text-white rounded-full px-2 py-0.5">{{ item.badge }}</span>
        </RouterLink>
      </div>

      <div v-if="isLoggedIn" class="mt-6 px-3">
        <div class="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide px-3 mb-2">Account</div>
        <RouterLink
          :to="{ name: 'profile' }"
          :class="[
            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
            isActive('/profile')
              ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800',
          ]"
          @click="$emit('close')"
        >
          <img
            v-if="user?.avatarUrl"
            :src="user.avatarUrl"
            :alt="user.displayName"
            class="w-6 h-6 rounded-full"
          />
          <span v-else class="text-lg">👤</span>
          <span>{{ user?.displayName || 'Profile' }}</span>
        </RouterLink>
      </div>
    </nav>

    <!-- Bottom user section -->
    <div class="p-4 border-t border-gray-200 dark:border-gray-700">
      <div v-if="isLoggedIn" class="flex items-center gap-3">
        <img
          v-if="user?.avatarUrl"
          :src="user.avatarUrl"
          :alt="user.displayName"
          class="w-9 h-9 rounded-full"
        />
        <div v-else class="w-9 h-9 bg-brand-100 dark:bg-brand-900/30 rounded-full flex items-center justify-center">
          <span class="text-brand-600 dark:text-brand-400 font-semibold text-sm">
            {{ user?.displayName?.charAt(0).toUpperCase() }}
          </span>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ user?.displayName }}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400 truncate">@{{ user?.username }}</p>
        </div>
        <button
          class="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          title="Logout"
          @click="handleLogout"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
      <RouterLink
        v-else
        :to="{ name: 'login' }"
        class="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium rounded-lg transition-colors"
      >
        <span>Sign In</span>
      </RouterLink>
    </div>
  </aside>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';

export default defineComponent({
  name: 'Sidebar',
  components: { RouterLink },
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['close'],
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
    navItems() {
      return [
        { name: 'Home', to: '/', icon: '🏠' },
        { name: 'Dashboard', to: '/dashboard', icon: '📊' },
        { name: 'Garage', to: '/garage', icon: '🚗' },
        { name: 'Community', to: '/community', icon: '🌐' },
        { name: 'Leaderboard', to: '/leaderboard', icon: '🏆' },
      ];
    },
  },
  methods: {
    isActive(path: string): boolean {
      if (path === '/') return this.$route.path === '/';
      return this.$route.path.startsWith(path);
    },
    async handleLogout() {
      await this.authStore.logout();
      this.$router.push({ name: 'login' });
      this.$emit('close');
    },
  },
});
</script>
