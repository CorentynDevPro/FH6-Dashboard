import { defineStore } from 'pinia';
import { authApi } from '@/api/auth.api';
import type { User } from '@fh6/types';

interface AuthState {
  user: User | null;
  // Access token kept in-memory only (not persisted) to reduce XSS exposure
  accessToken: string | null;
  // Refresh token persisted in localStorage; for higher security deploy with httpOnly cookies
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    accessToken: null, // intentionally NOT loaded from localStorage
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
      if (this.refreshToken) {
        try {
          const { tokens, user } = await authApi.refresh(this.refreshToken);
          this.accessToken = tokens.accessToken;
          this.refreshToken = tokens.refreshToken;
          this.user = user;
          localStorage.setItem('refreshToken', tokens.refreshToken);
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
        // Only persist refresh token; access token lives in memory only
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
      localStorage.setItem('refreshToken', tokens.refreshToken);
    },

    clearAuth() {
      this.user = null;
      this.accessToken = null;
      this.refreshToken = null;
      localStorage.removeItem('refreshToken');
    },

    setUser(user: User) {
      this.user = user;
    },
  },
});
