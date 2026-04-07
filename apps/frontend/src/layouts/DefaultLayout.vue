<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
    <Sidebar :is-open="sidebarOpen" @close="sidebarOpen = false" />

    <div class="flex-1 flex flex-col min-w-0" :class="{ 'lg:ml-64': true }">
      <TopBar @toggle-sidebar="sidebarOpen = !sidebarOpen" />

      <main class="flex-1 p-4 sm:p-6 overflow-auto">
        <RouterView />
      </main>
    </div>

    <!-- Mobile overlay -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 bg-black/50 z-20 lg:hidden"
      @click="sidebarOpen = false"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { RouterView } from 'vue-router';
import Sidebar from '@/components/nav/Sidebar.vue';
import TopBar from '@/components/nav/TopBar.vue';

export default defineComponent({
  name: 'DefaultLayout',
  components: { RouterView, Sidebar, TopBar },
  data() {
    return {
      sidebarOpen: false,
    };
  },
  mounted() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
  },
  unmounted() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    handleResize() {
      if (window.innerWidth >= 1024) {
        this.sidebarOpen = false;
      }
    },
  },
});
</script>
