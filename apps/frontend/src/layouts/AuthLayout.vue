<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-brand-500 rounded-2xl mb-4 shadow-lg">
          <span class="text-3xl">🏎️</span>
        </div>
        <h1 class="text-2xl font-bold text-white">FH6 Dashboard</h1>
        <p class="text-gray-400 mt-1">Forza Horizon 6 Companion</p>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
        <RouterView />
      </div>

      <p class="text-center text-gray-500 text-sm mt-6">
        &copy; {{ new Date().getFullYear() }} FH6 Dashboard. Not affiliated with Microsoft or Playground Games.
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { RouterView } from 'vue-router';

export default defineComponent({
  name: 'AuthLayout',
  components: { RouterView },
});
</script>
