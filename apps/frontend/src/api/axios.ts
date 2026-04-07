import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import router from '@/router';
import { useAuthStore } from '@/stores/auth.store';

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor — attach JWT from in-memory store
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  // Access token lives in Pinia store (memory only, not localStorage)
  const authStore = useAuthStore();
  const token = authStore.accessToken;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — handle 401 and refresh token
let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: any) => void }> = [];

function processQueue(error: any, token: string | null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
}

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        localStorage.removeItem('refreshToken');
        router.push({ name: 'login' });
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/auth/refresh`,
          { refreshToken },
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data.tokens;

        // Update in-memory store with new access token
        const authStore = useAuthStore();
        authStore.accessToken = accessToken;
        authStore.refreshToken = newRefreshToken;
        localStorage.setItem('refreshToken', newRefreshToken);

        apiClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        processQueue(null, accessToken);
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem('refreshToken');
        const authStore = useAuthStore();
        authStore.clearAuth();
        router.push({ name: 'login' });
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
