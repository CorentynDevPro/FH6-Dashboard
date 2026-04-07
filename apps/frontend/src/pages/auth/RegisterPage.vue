<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Create Account</h1>
      <p class="text-gray-500 dark:text-gray-400 mt-1">Join the FH6 community</p>
    </div>

    <form class="space-y-4" @submit.prevent="handleRegister">
      <AppInput
        v-model="form.email"
        label="Email"
        type="email"
        placeholder="you@example.com"
        :error="errors.email"
        required
      />

      <AppInput
        v-model="form.username"
        label="Username"
        placeholder="drift_king"
        :error="errors.username"
        required
        hint="Only letters, numbers, and underscores"
      />

      <AppInput
        v-model="form.displayName"
        label="Display Name"
        placeholder="Drift King"
        :error="errors.displayName"
        required
      />

      <AppInput
        v-model="form.password"
        label="Password"
        type="password"
        placeholder="••••••••"
        :error="errors.password"
        required
        hint="At least 8 characters"
      />

      <AppInput
        v-model="form.confirmPassword"
        label="Confirm Password"
        type="password"
        placeholder="••••••••"
        :error="errors.confirmPassword"
        required
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
        Create Account
      </AppButton>
    </form>

    <p class="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
      Already have an account?
      <RouterLink :to="{ name: 'login' }" class="text-brand-600 dark:text-brand-400 font-medium hover:underline">
        Sign in
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
  name: 'RegisterPage',
  components: { RouterLink, AppInput, AppButton },
  data() {
    return {
      form: {
        email: '',
        username: '',
        displayName: '',
        password: '',
        confirmPassword: '',
      },
      errors: {
        email: '',
        username: '',
        displayName: '',
        password: '',
        confirmPassword: '',
      },
      globalError: '',
      loading: false,
    };
  },
  methods: {
    validate(): boolean {
      this.errors = { email: '', username: '', displayName: '', password: '', confirmPassword: '' };
      let valid = true;
      if (!this.form.email) { this.errors.email = 'Email is required'; valid = false; }
      if (!this.form.username) { this.errors.username = 'Username is required'; valid = false; }
      else if (!/^[a-zA-Z0-9_]+$/.test(this.form.username)) { this.errors.username = 'Only letters, numbers, and underscores'; valid = false; }
      if (!this.form.displayName) { this.errors.displayName = 'Display name is required'; valid = false; }
      if (this.form.password.length < 8) { this.errors.password = 'Password must be at least 8 characters'; valid = false; }
      if (this.form.password !== this.form.confirmPassword) { this.errors.confirmPassword = 'Passwords do not match'; valid = false; }
      return valid;
    },
    async handleRegister() {
      if (!this.validate()) return;
      this.globalError = '';
      this.loading = true;
      try {
        await useAuthStore().register(this.form.email, this.form.username, this.form.displayName, this.form.password);
        this.$router.push({ name: 'dashboard' });
      } catch (err: any) {
        const msg = err.response?.data?.message;
        this.globalError = Array.isArray(msg) ? msg.join(', ') : (msg || 'Registration failed.');
      } finally {
        this.loading = false;
      }
    },
  },
});
</script>
