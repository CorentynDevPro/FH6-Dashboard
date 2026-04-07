import apiClient from './axios';
import type { Build, BuildListResponse, BuildComment, CreateBuildDto, UpdateBuildDto } from '@fh6/types';

export const buildsApi = {
  async getBuilds(params?: { page?: number; pageSize?: number; carId?: string }): Promise<BuildListResponse> {
    const res = await apiClient.get<BuildListResponse>('/builds', { params });
    return res.data;
  },

  async getTrending(): Promise<Build[]> {
    const res = await apiClient.get<Build[]>('/builds/trending');
    return res.data;
  },

  async getMyBuilds(): Promise<Build[]> {
    const res = await apiClient.get<Build[]>('/builds/my');
    return res.data;
  },

  async getBuild(id: string): Promise<Build> {
    const res = await apiClient.get<Build>(`/builds/${id}`);
    return res.data;
  },

  async createBuild(data: CreateBuildDto): Promise<Build> {
    const res = await apiClient.post<Build>('/builds', data);
    return res.data;
  },

  async updateBuild(id: string, data: UpdateBuildDto): Promise<Build> {
    const res = await apiClient.put<Build>(`/builds/${id}`, data);
    return res.data;
  },

  async deleteBuild(id: string): Promise<void> {
    await apiClient.delete(`/builds/${id}`);
  },

  async toggleLike(id: string): Promise<{ liked: boolean }> {
    const res = await apiClient.post<{ liked: boolean }>(`/builds/${id}/like`);
    return res.data;
  },

  async getComments(id: string): Promise<BuildComment[]> {
    const res = await apiClient.get<BuildComment[]>(`/builds/${id}/comments`);
    return res.data;
  },

  async addComment(id: string, content: string): Promise<BuildComment> {
    const res = await apiClient.post<BuildComment>(`/builds/${id}/comments`, { content });
    return res.data;
  },

  async deleteComment(buildId: string, commentId: string): Promise<void> {
    await apiClient.delete(`/builds/${buildId}/comments/${commentId}`);
  },
};
