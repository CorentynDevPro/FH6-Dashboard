import { defineStore } from 'pinia';
import { authApi } from '@/api/auth.api';
import { usersApi } from '@/api/users.api';
import type { User } from '@fh6/types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    accessToken: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken'),
    loading: false,
    error: null,
  }),

  getters: {
    isLoggedIn: (state): boolean => !!state.accessToken && !!state.user,
    isAdmin: (state): boolean => state.user?.role === 'ADMIN',
  },

  actions: {
    async initializeAuth() {
      if (this.accessToken) {
        try {
          const user = await usersApi.getMe();
          this.user = user;
        } catch {
          this.clearAuth();
        }
      }
    },

    async login(email: string, password: string) {
      this.loading = true;
      this.error = null;
      try {
        const { tokens, user } = await authApi.login({ email, password });
        this.accessToken = tokens.accessToken;
        this.refreshToken = tokens.refreshToken;
        this.user = user;
        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Login failed';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async register(email: string, username: string, displayName: string, password: string) {
      this.loading = true;
      this.error = null;
      try {
        const { tokens, user } = await authApi.register({ email, username, displayName, password });
        this.accessToken = tokens.accessToken;
        this.refreshToken = tokens.refreshToken;
        this.user = user;
        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Registration failed';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      if (this.refreshToken) {
        try {
          await authApi.logout(this.refreshToken);
        } catch {}
      }
      this.clearAuth();
    },

    async refreshTokens() {
      if (!this.refreshToken) throw new Error('No refresh token');
      const { tokens, user } = await authApi.refresh(this.refreshToken);
      this.accessToken = tokens.accessToken;
      this.refreshToken = tokens.refreshToken;
      this.user = user;
      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
    },

    clearAuth() {
      this.user = null;
      this.accessToken = null;
      this.refreshToken = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },

    setUser(user: User) {
      this.user = user;
    },
  },
});
