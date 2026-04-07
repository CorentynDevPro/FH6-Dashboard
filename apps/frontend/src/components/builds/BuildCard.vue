<template>
  <div class="card overflow-hidden">
    <!-- Car image -->
    <div class="relative h-40 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
      <img
        v-if="build.car?.imageUrl"
        :src="build.car.imageUrl"
        :alt="`${build.car.make} ${build.car.model}`"
        class="w-full h-full object-cover"
        @error="(e) => ((e.target as HTMLImageElement).style.display = 'none')"
      />
      <div v-else class="flex items-center justify-center h-full">
        <span class="text-4xl">🔧</span>
      </div>
      <div v-if="!build.isPublic" class="absolute top-2 left-2">
        <AppBadge variant="default">Private</AppBadge>
      </div>
    </div>

    <div class="p-4">
      <!-- Author -->
      <div class="flex items-center gap-2 mb-2">
        <img
          v-if="build.author?.avatarUrl"
          :src="build.author.avatarUrl"
          :alt="build.author.displayName"
          class="w-6 h-6 rounded-full"
        />
        <span class="text-xs text-gray-500 dark:text-gray-400">{{ build.author?.displayName }}</span>
        <span class="text-xs text-gray-400 dark:text-gray-500 ml-auto">{{ timeAgo(build.createdAt) }}</span>
      </div>

      <!-- Title -->
      <h3 class="font-semibold text-gray-900 dark:text-white text-sm leading-tight mb-1">{{ build.title }}</h3>
      <p class="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{{ build.description }}</p>

      <!-- Car info -->
      <div v-if="build.car" class="mt-2 text-xs text-gray-500 dark:text-gray-400">
        🚗 {{ build.car.year }} {{ build.car.make }} {{ build.car.model }}
      </div>

      <!-- Tags -->
      <div v-if="build.tags?.length" class="flex flex-wrap gap-1 mt-2">
        <span
          v-for="tag in build.tags.slice(0, 3)"
          :key="tag"
          class="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md px-2 py-0.5"
        >
          #{{ tag }}
        </span>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
        <button
          :class="[
            'flex items-center gap-1.5 text-xs font-medium transition-colors',
            build.likedByMe
              ? 'text-red-500 hover:text-red-600'
              : 'text-gray-500 dark:text-gray-400 hover:text-red-500',
          ]"
          @click.stop="$emit('like', build.id)"
        >
          <span>{{ build.likedByMe ? '❤️' : '🤍' }}</span>
          <span>{{ build.likesCount }}</span>
        </button>

        <button
          class="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-brand-500 transition-colors font-medium"
          @click.stop="$emit('view', build)"
        >
          <span>💬</span>
          <span>{{ build._count?.comments ?? build.commentsCount ?? 0 }}</span>
        </button>

        <div v-if="build.tuneCode" class="ml-auto">
          <button
            class="text-xs text-brand-600 dark:text-brand-400 hover:underline font-medium"
            @click.stop="copyTuneCode"
          >
            {{ copied ? '✅ Copied!' : '📋 ' + build.tuneCode }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import type { Build } from '@fh6/types';
import AppBadge from '@/components/common/AppBadge.vue';
import { timeAgo } from '@fh6/ui';

export default defineComponent({
  name: 'BuildCard',
  components: { AppBadge },
  props: {
    build: {
      type: Object as PropType<Build & { _count?: { comments: number } }>,
      required: true,
    },
  },
  emits: ['like', 'view'],
  data() {
    return {
      copied: false,
    };
  },
  methods: {
    timeAgo,
    async copyTuneCode() {
      if (!this.build.tuneCode) return;
      try {
        await navigator.clipboard.writeText(this.build.tuneCode);
        this.copied = true;
        setTimeout(() => (this.copied = false), 2000);
      } catch {
        // Clipboard not supported
      }
    },
  },
});
</script>
