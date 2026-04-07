<template>
  <div class="overflow-x-auto">
    <table class="w-full">
      <thead>
        <tr class="border-b border-gray-200 dark:border-gray-700">
          <th class="text-left py-3 px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide w-12">#</th>
          <th class="text-left py-3 px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Player</th>
          <th class="text-right py-3 px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Score</th>
          <th class="text-right py-3 px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide hidden sm:table-cell">Wins</th>
          <th class="text-right py-3 px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide hidden md:table-cell">Win Rate</th>
          <th class="text-right py-3 px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide hidden lg:table-cell">Races</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100 dark:divide-gray-700/50">
        <tr
          v-for="entry in entries"
          :key="entry.id"
          :class="[
            'transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/30',
            isCurrentUser(entry) ? 'bg-brand-50/50 dark:bg-brand-900/10' : '',
          ]"
        >
          <!-- Position -->
          <td class="py-3 px-3">
            <div class="flex items-center justify-center">
              <span v-if="entry.position <= 3" class="text-lg">{{ medals[entry.position] }}</span>
              <span v-else class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ entry.position }}</span>
            </div>
          </td>

          <!-- Player -->
          <td class="py-3 px-3">
            <div class="flex items-center gap-3">
              <img
                v-if="entry.user.avatarUrl"
                :src="entry.user.avatarUrl"
                :alt="entry.user.displayName"
                class="w-8 h-8 rounded-full flex-shrink-0"
              />
              <div v-else class="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                <span class="text-xs font-semibold text-gray-500">{{ entry.user.displayName.charAt(0) }}</span>
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ entry.user.displayName }}</span>
                  <span v-if="isCurrentUser(entry)" class="text-xs bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 px-1.5 py-0.5 rounded font-medium">You</span>
                </div>
                <div class="flex items-center gap-1 text-xs text-gray-400">
                  <span v-if="entry.user.country">{{ getFlagEmoji(entry.user.country) }}</span>
                  <span>@{{ entry.user.username }}</span>
                </div>
              </div>
            </div>
          </td>

          <!-- Score -->
          <td class="py-3 px-3 text-right">
            <span class="text-sm font-bold text-brand-600 dark:text-brand-400 tabular-nums">
              {{ formatNumber(entry.score) }}
            </span>
          </td>

          <!-- Wins -->
          <td class="py-3 px-3 text-right hidden sm:table-cell">
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300 tabular-nums">{{ entry.wins }}</span>
          </td>

          <!-- Win Rate -->
          <td class="py-3 px-3 text-right hidden md:table-cell">
            <span :class="['text-sm font-medium tabular-nums', winRateColor(entry.winRate)]">
              {{ entry.winRate.toFixed(1) }}%
            </span>
          </td>

          <!-- Total Races -->
          <td class="py-3 px-3 text-right hidden lg:table-cell">
            <span class="text-sm text-gray-500 dark:text-gray-400 tabular-nums">{{ entry.totalRaces }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import { useAuthStore } from '@/stores/auth.store';
import type { RankingEntry } from '@/api/rankings.api';

export default defineComponent({
  name: 'LeaderboardTable',
  props: {
    entries: {
      type: Array as PropType<RankingEntry[]>,
      required: true,
    },
  },
  data() {
    return {
      medals: { 1: '🥇', 2: '🥈', 3: '🥉' } as Record<number, string>,
    };
  },
  computed: {
    currentUserId(): string | undefined {
      return useAuthStore().user?.id;
    },
  },
  methods: {
    isCurrentUser(entry: RankingEntry): boolean {
      return entry.user.id === this.currentUserId;
    },
    formatNumber(n: number): string {
      return new Intl.NumberFormat().format(n);
    },
    winRateColor(rate: number): string {
      if (rate >= 50) return 'text-green-500 dark:text-green-400';
      if (rate >= 30) return 'text-yellow-500 dark:text-yellow-400';
      return 'text-gray-500 dark:text-gray-400';
    },
    getFlagEmoji(country: string): string {
      const flag = country
        .toUpperCase()
        .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
      return flag;
    },
  },
});
</script>
