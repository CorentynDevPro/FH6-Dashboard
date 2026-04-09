import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { useAuthStore } from '@/stores/auth.store';
import './assets/main.css';

async function bootstrap() {
  const app = createApp(App);

  app.use(createPinia());
  app.use(router);

  // Rehydrate the session from localStorage before mounting so the router
  // guard can correctly evaluate `isLoggedIn` on the first navigation.
  await useAuthStore().initializeAuth();

  app.mount('#app');
}

bootstrap();
