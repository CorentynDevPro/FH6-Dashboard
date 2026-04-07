<template>
  <div>
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
      <p class="text-gray-500 dark:text-gray-400">Welcome back, {{ user?.displayName }}!</p>
    </div>

    <!-- Stats grid -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatsCard label="Player Level" :value="progress?.level || 1" icon="⚡" icon-bg="bg-yellow-50 dark:bg-yellow-900/20" />
      <StatsCard label="Cars Owned" :value="progress?.carsOwned || 0" icon="🚗" icon-bg="bg-blue-50 dark:bg-blue-900/20" />
      <StatsCard label="Races Won" :value="ranking?.wins || 0" icon="🏆" icon-bg="bg-brand-50 dark:bg-brand-900/20" />
      <StatsCard label="Challenges Done" :value="progress?.challengesCompleted || 0" icon="🎯" icon-bg="bg-purple-50 dark:bg-purple-900/20" />
    </div>

    <!-- XP Progress -->
    <AppCard title="Experience Progress" class="mb-6">
      <div class="flex items-center gap-4 mb-2">
        <div class="text-2xl font-black text-brand-500">Lv.{{ progress?.level || 1 }}</div>
        <div class="flex-1">
          <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
            <span>{{ formatNumber(progress?.xp || 0) }} XP</span>
            <span>{{ formatNumber(progress?.xpToNextLevel || 1000) }} XP</span>
          </div>
          <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              class="h-full bg-gradient-to-r from-brand-400 to-brand-600 rounded-full transition-all duration-500"
              :style="{ width: `${xpPercent}%` }"
            />
          </div>
        </div>
        <div class="text-sm font-semibold text-gray-700 dark:text-gray-300">
          {{ xpPercent.toFixed(0) }}%
        </div>
      </div>
    </AppCard>

    <!-- Charts row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <ActivityChart
        title="Race Activity (Last 7 Days)"
        :labels="activityLabels"
        :datasets="raceDatasets"
        type="bar"
      />
      <ActivityChart
        title="Score Progression"
        :labels="scoreLabels"
        :datasets="scoreDatasets"
        type="line"
      />
    </div>

    <!-- Recent challenges -->
    <AppCard title="Active Challenges">
      <div v-if="loadingChallenges" class="flex justify-center py-6">
        <LoadingSpinner />
      </div>
      <div v-else-if="challenges.length === 0" class="text-center py-6 text-gray-400">
        No active challenges right now
      </div>
      <div v-else class="space-y-3">
        <div
          v-for="challenge in challenges"
          :key="challenge.id"
          class="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
        >
          <span class="text-2xl">{{ challenge.icon }}</span>
          <div class="flex-1">
            <div class="flex items-center gap-2">
              <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ challenge.title }}</p>
              <AppBadge :variant="challengeVariant(challenge.type)">{{ challenge.type }}</AppBadge>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ challenge.description }}</p>
          </div>
          <div class="text-right">
            <div class="text-sm font-bold text-brand-600 dark:text-brand-400">+{{ challenge.xpReward }} XP</div>
            <div class="text-xs text-gray-400">{{ timeUntil(challenge.endsAt) }}</div>
          </div>
        </div>
      </div>
    </AppCard>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import StatsCard from '@/components/dashboard/StatsCard.vue';
import ActivityChart from '@/components/dashboard/ActivityChart.vue';
import AppCard from '@/components/common/AppCard.vue';
import AppBadge from '@/components/common/AppBadge.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import { useAuthStore } from '@/stores/auth.store';
import apiClient from '@/api/axios';

export default defineComponent({
  name: 'DashboardPage',
  components: { StatsCard, ActivityChart, AppCard, AppBadge, LoadingSpinner },
  data() {
    return {
      progress: null as any,
      ranking: null as any,
      challenges: [] as any[],
      loadingChallenges: false,
      activityLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      raceDatasets: [
        {
          label: 'Races',
          data: [12, 8, 15, 6, 20, 18, 9],
          backgroundColor: 'rgba(245, 158, 11, 0.7)',
          borderRadius: 6,
        },
        {
          label: 'Wins',
          data: [5, 3, 8, 2, 11, 9, 4],
          backgroundColor: 'rgba(34, 197, 94, 0.7)',
          borderRadius: 6,
        },
      ],
      scoreLabels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
      scoreDatasets: [
        {
          label: 'Score',
          data: [8000, 12000, 15500, 18200, 22000, 28500],
          borderColor: 'rgba(245, 158, 11, 0.9)',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: 'rgba(245, 158, 11, 1)',
          pointRadius: 4,
        },
      ],
    };
  },
  computed: {
    user() {
      return useAuthStore().user;
    },
    xpPercent(): number {
      if (!this.progress) return 0;
      return Math.min((this.progress.xp / this.progress.xpToNextLevel) * 100, 100);
    },
  },
  async mounted() {
    await this.loadData();
  },
  methods: {
    async loadData() {
      try {
        const [progressRes, rankingRes] = await Promise.all([
          apiClient.get('/progress/me'),
          apiClient.get('/rankings/me'),
        ]);
        this.progress = progressRes.data;
        this.ranking = rankingRes.data;
      } catch {}

      this.loadingChallenges = true;
      try {
        const res = await apiClient.get('/challenges/current');
        this.challenges = res.data;
      } catch {}
      finally {
        this.loadingChallenges = false;
      }
    },
    formatNumber(n: number): string {
      return new Intl.NumberFormat().format(n);
    },
    challengeVariant(type: string): string {
      const map: Record<string, string> = { DAILY: 'success', WEEKLY: 'primary', SEASONAL: 'warning', SPECIAL: 'danger' };
      return map[type] || 'default';
    },
    timeUntil(date: string): string {
      const diff = new Date(date).getTime() - Date.now();
      if (diff < 0) return 'Expired';
      const hours = Math.floor(diff / (1000 * 60 * 60));
      if (hours < 24) return `${hours}h left`;
      return `${Math.floor(hours / 24)}d left`;
    },
  },
});
</script>
