import apiClient from './axios';
import type { User, UserProfile, UpdateUserDto } from '@fh6/types';

export const usersApi = {
  async getMe(): Promise<UserProfile> {
    const res = await apiClient.get<UserProfile>('/users/me');
    return res.data;
  },

  async updateMe(data: UpdateUserDto): Promise<User> {
    const res = await apiClient.patch<User>('/users/me', data);
    return res.data;
  },

  async getUser(id: string): Promise<UserProfile> {
    const res = await apiClient.get<UserProfile>(`/users/${id}`);
    return res.data;
  },
};
