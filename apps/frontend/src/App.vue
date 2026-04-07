<template>
  <RouterView />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { RouterView } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';

export default defineComponent({
  name: 'App',
  components: { RouterView },
  created() {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    }

    const authStore = useAuthStore();
    authStore.initializeAuth();
  },
});
</script>
