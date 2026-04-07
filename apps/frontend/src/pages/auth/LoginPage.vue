<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Sign In</h1>
      <p class="text-gray-500 dark:text-gray-400 mt-1">Welcome back to FH6 Dashboard</p>
    </div>

    <form class="space-y-4" @submit.prevent="handleLogin">
      <AppInput
        v-model="form.email"
        label="Email"
        type="email"
        placeholder="you@example.com"
        :error="errors.email"
        required
        autocomplete="email"
      />

      <AppInput
        v-model="form.password"
        label="Password"
        type="password"
        placeholder="••••••••"
        :error="errors.password"
        required
        autocomplete="current-password"
      />

      <div v-if="globalError" class="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
        {{ globalError }}
      </div>

      <AppButton
        type="submit"
        variant="primary"
        size="lg"
        class="w-full"
        :loading="loading"
      >
        Sign In
      </AppButton>
    </form>

    <p class="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
      Don't have an account?
      <RouterLink :to="{ name: 'register' }" class="text-brand-600 dark:text-brand-400 font-medium hover:underline">
        Create one
      </RouterLink>
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { RouterLink } from 'vue-router';
import AppInput from '@/components/common/AppInput.vue';
import AppButton from '@/components/common/AppButton.vue';
import { useAuthStore } from '@/stores/auth.store';

export default defineComponent({
  name: 'LoginPage',
  components: { RouterLink, AppInput, AppButton },
  data() {
    return {
      form: {
        email: '',
        password: '',
      },
      errors: {
        email: '',
        password: '',
      },
      globalError: '',
      loading: false,
    };
  },
  methods: {
    validate(): boolean {
      this.errors = { email: '', password: '' };
      let valid = true;
      if (!this.form.email) { this.errors.email = 'Email is required'; valid = false; }
      if (!this.form.password) { this.errors.password = 'Password is required'; valid = false; }
      return valid;
    },
    async handleLogin() {
      if (!this.validate()) return;
      this.globalError = '';
      this.loading = true;
      try {
        await useAuthStore().login(this.form.email, this.form.password);
        const redirect = this.$route.query.redirect as string;
        this.$router.push(redirect || { name: 'dashboard' });
      } catch (err: any) {
        this.globalError = err.response?.data?.message || 'Invalid email or password.';
      } finally {
        this.loading = false;
      }
    },
  },
});
</script>
