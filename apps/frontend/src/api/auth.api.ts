import apiClient from './axios';
import type { AuthResponse, LoginDto, RegisterDto } from '@fh6/types';

export const authApi = {
  async login(dto: LoginDto): Promise<AuthResponse> {
    const res = await apiClient.post<AuthResponse>('/auth/login', dto);
    return res.data;
  },

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const res = await apiClient.post<AuthResponse>('/auth/register', dto);
    return res.data;
  },

  async refresh(refreshToken: string): Promise<AuthResponse> {
    const res = await apiClient.post<AuthResponse>('/auth/refresh', { refreshToken });
    return res.data;
  },

  async logout(refreshToken: string): Promise<void> {
    await apiClient.post('/auth/logout', { refreshToken });
  },
};
