import { defineStore } from 'pinia';
import { buildsApi } from '@/api/builds.api';
import type { Build } from '@fh6/types';

interface BuildsState {
  builds: Build[];
  trendingBuilds: Build[];
  currentBuild: Build | null;
  total: number;
  page: number;
  pageSize: number;
  loading: boolean;
  error: string | null;
}

export const useBuildsStore = defineStore('builds', {
  state: (): BuildsState => ({
    builds: [],
    trendingBuilds: [],
    currentBuild: null,
    total: 0,
    page: 1,
    pageSize: 20,
    loading: false,
    error: null,
  }),

  getters: {
    totalPages: (state): number => Math.ceil(state.total / state.pageSize),
  },

  actions: {
    async fetchBuilds(params?: { page?: number; pageSize?: number; carId?: string }) {
      this.loading = true;
      this.error = null;
      if (params?.page) this.page = params.page;
      try {
        const result = await buildsApi.getBuilds({
          page: this.page,
          pageSize: this.pageSize,
          carId: params?.carId,
        });
        this.builds = result.data;
        this.total = result.total;
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Failed to fetch builds';
      } finally {
        this.loading = false;
      }
    },

    async fetchTrending() {
      try {
        this.trendingBuilds = await buildsApi.getTrending();
      } catch (err: any) {
        console.error('Failed to fetch trending builds', err);
      }
    },

    async fetchBuild(id: string) {
      this.loading = true;
      this.error = null;
      try {
        this.currentBuild = await buildsApi.getBuild(id);
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Failed to fetch build';
      } finally {
        this.loading = false;
      }
    },

    async createBuild(data: any) {
      this.loading = true;
      this.error = null;
      try {
        const build = await buildsApi.createBuild(data);
        this.builds.unshift(build);
        this.total++;
        return build;
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Failed to create build';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async toggleLike(buildId: string) {
      const result = await buildsApi.toggleLike(buildId);
      const build = this.builds.find((b) => b.id === buildId);
      if (build) {
        build.likedByMe = result.liked;
        build.likesCount += result.liked ? 1 : -1;
      }
      if (this.currentBuild?.id === buildId) {
        this.currentBuild.likedByMe = result.liked;
        this.currentBuild.likesCount += result.liked ? 1 : -1;
      }
      return result;
    },

    async deleteBuild(id: string) {
      await buildsApi.deleteBuild(id);
      this.builds = this.builds.filter((b) => b.id !== id);
      this.total--;
    },
  },
});
