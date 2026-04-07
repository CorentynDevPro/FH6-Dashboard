<template>
  <div>
    <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-4">
      Comments ({{ comments.length }})
    </h3>

    <!-- Add comment -->
    <div v-if="isLoggedIn" class="flex gap-3 mb-6">
      <img
        v-if="currentUser?.avatarUrl"
        :src="currentUser.avatarUrl"
        :alt="currentUser.displayName"
        class="w-8 h-8 rounded-full flex-shrink-0"
      />
      <div v-else class="w-8 h-8 bg-brand-100 dark:bg-brand-900/30 rounded-full flex items-center justify-center flex-shrink-0">
        <span class="text-brand-600 text-sm font-semibold">{{ currentUser?.displayName?.charAt(0) }}</span>
      </div>
      <div class="flex-1">
        <textarea
          v-model="newComment"
          placeholder="Add a comment..."
          rows="2"
          class="input resize-none text-sm"
          @keydown.ctrl.enter="submitComment"
        />
        <div class="flex justify-end mt-2">
          <AppButton
            size="sm"
            :loading="submitting"
            :disabled="!newComment.trim()"
            @click="submitComment"
          >
            Comment
          </AppButton>
        </div>
      </div>
    </div>

    <!-- Comments list -->
    <div v-if="loading" class="flex justify-center py-8">
      <LoadingSpinner />
    </div>

    <div v-else-if="comments.length === 0" class="text-center py-8 text-gray-400 dark:text-gray-500">
      No comments yet. Be the first!
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="comment in comments"
        :key="comment.id"
        class="flex gap-3"
      >
        <img
          v-if="comment.author?.avatarUrl"
          :src="comment.author.avatarUrl"
          :alt="comment.author.displayName"
          class="w-8 h-8 rounded-full flex-shrink-0"
        />
        <div v-else class="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
          <span class="text-gray-500 text-sm font-semibold">{{ comment.author?.displayName?.charAt(0) }}</span>
        </div>
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-0.5">
            <span class="text-sm font-medium text-gray-900 dark:text-white">{{ comment.author?.displayName }}</span>
            <span class="text-xs text-gray-400 dark:text-gray-500">{{ timeAgo(comment.createdAt) }}</span>
            <button
              v-if="canDelete(comment)"
              class="ml-auto text-xs text-red-400 hover:text-red-500 transition-colors"
              @click="deleteComment(comment.id)"
            >
              Delete
            </button>
          </div>
          <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{{ comment.content }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import type { BuildComment } from '@fh6/types';
import AppButton from '@/components/common/AppButton.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import { buildsApi } from '@/api/builds.api';
import { useAuthStore } from '@/stores/auth.store';
import { timeAgo } from '@fh6/ui';

export default defineComponent({
  name: 'BuildComments',
  components: { AppButton, LoadingSpinner },
  props: {
    buildId: {
      type: String,
      required: true,
    },
    initialComments: {
      type: Array as PropType<BuildComment[]>,
      default: () => [],
    },
  },
  data() {
    return {
      comments: [...this.initialComments] as BuildComment[],
      newComment: '',
      loading: false,
      submitting: false,
    };
  },
  computed: {
    authStore() {
      return useAuthStore();
    },
    isLoggedIn() {
      return this.authStore.isLoggedIn;
    },
    currentUser() {
      return this.authStore.user;
    },
  },
  async mounted() {
    if (this.initialComments.length === 0) {
      await this.loadComments();
    }
  },
  methods: {
    timeAgo,
    async loadComments() {
      this.loading = true;
      try {
        this.comments = await buildsApi.getComments(this.buildId);
      } catch {}
      finally {
        this.loading = false;
      }
    },
    async submitComment() {
      if (!this.newComment.trim() || this.submitting) return;
      this.submitting = true;
      try {
        const comment = await buildsApi.addComment(this.buildId, this.newComment.trim());
        this.comments.unshift(comment);
        this.newComment = '';
      } catch {}
      finally {
        this.submitting = false;
      }
    },
    canDelete(comment: BuildComment): boolean {
      return this.currentUser?.id === comment.authorId;
    },
    async deleteComment(commentId: string) {
      try {
        await buildsApi.deleteComment(this.buildId, commentId);
        this.comments = this.comments.filter((c) => c.id !== commentId);
      } catch {}
    },
  },
});
</script>
