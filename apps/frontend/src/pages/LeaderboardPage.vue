<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Leaderboard</h1>
      <p class="text-gray-500 dark:text-gray-400">See how you rank against the world</p>
    </div>

    <!-- Tabs -->
    <div class="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit mb-6">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        :class="[
          'px-5 py-2 text-sm font-medium rounded-lg transition-all',
          activeTab === tab.key
            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200',
        ]"
        @click="switchTab(tab.key)"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Your Ranking Card -->
    <div v-if="myRanking" class="card p-5 mb-6 border-brand-200 dark:border-brand-800 bg-brand-50 dark:bg-brand-900/10">
      <div class="flex items-center gap-4">
        <div class="text-3xl font-black text-brand-500">#{{ myRanking.position || myRanking.globalRank }}</div>
        <div class="flex-1">
          <p class="text-sm text-gray-500 dark:text-gray-400">Your Global Rank</p>
          <p class="font-semibold text-gray-900 dark:text-white">{{ myRanking.score?.toLocaleString() }} pts</p>
        </div>
        <div class="text-right hidden sm:block">
          <p class="text-sm text-gray-500 dark:text-gray-400">Win Rate</p>
          <p class="font-semibold text-gray-900 dark:text-white">{{ myRanking.winRate?.toFixed(1) }}%</p>
        </div>
        <div class="text-right hidden md:block">
          <p class="text-sm text-gray-500 dark:text-gray-400">Wins</p>
          <p class="font-semibold text-gray-900 dark:text-white">{{ myRanking.wins }}</p>
        </div>
      </div>
    </div>

    <!-- Table -->
    <AppCard>
      <div v-if="loading" class="flex justify-center py-12">
        <LoadingSpinner />
      </div>
      <div v-else-if="entries.length === 0" class="text-center py-12 text-gray-400">
        No rankings found
      </div>
      <LeaderboardTable v-else :entries="entries" />

      <!-- Pagination -->
      <div v-if="totalPages > 1 && activeTab === 'global'" class="flex justify-center gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
        <AppButton variant="outline" size="sm" :disabled="page === 1" @click="loadPage(page - 1)">← Prev</AppButton>
        <span class="flex items-center text-sm text-gray-500 dark:text-gray-400 px-3">{{ page }} / {{ totalPages }}</span>
        <AppButton variant="outline" size="sm" :disabled="page === totalPages" @click="loadPage(page + 1)">Next →</AppButton>
      </div>
    </AppCard>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AppCard from '@/components/common/AppCard.vue';
import AppButton from '@/components/common/AppButton.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import LeaderboardTable from '@/components/leaderboard/LeaderboardTable.vue';
import { rankingsApi } from '@/api/rankings.api';
import { useAuthStore } from '@/stores/auth.store';
import type { RankingEntry } from '@/api/rankings.api';

export default defineComponent({
  name: 'LeaderboardPage',
  components: { AppCard, AppButton, LoadingSpinner, LeaderboardTable },
  data() {
    return {
      activeTab: 'global' as 'global' | 'friends',
      entries: [] as RankingEntry[],
      myRanking: null as any,
      loading: false,
      page: 1,
      pageSize: 50,
      total: 0,
      tabs: [
        { key: 'global' as const, label: '🌍 Global' },
        { key: 'friends' as const, label: '👥 Friends' },
      ],
    };
  },
  computed: {
    totalPages(): number {
      return Math.ceil(this.total / this.pageSize);
    },
    isLoggedIn() {
      return useAuthStore().isLoggedIn;
    },
  },
  async mounted() {
    await this.loadData();
  },
  methods: {
    async loadData() {
      this.loading = true;
      try {
        if (this.activeTab === 'global') {
          const res = await rankingsApi.getGlobal({ page: this.page, pageSize: this.pageSize });
          this.entries = res.data;
          this.total = res.total;
        } else {
          this.entries = await rankingsApi.getFriends();
        }

        if (this.isLoggedIn) {
          try {
            this.myRanking = await rankingsApi.getMyRanking();
          } catch {}
        }
      } catch {}
      finally {
        this.loading = false;
      }
    },
    async switchTab(tab: 'global' | 'friends') {
      this.activeTab = tab;
      this.page = 1;
      await this.loadData();
    },
    async loadPage(p: number) {
      this.page = p;
      await this.loadData();
    },
  },
});
</script>
