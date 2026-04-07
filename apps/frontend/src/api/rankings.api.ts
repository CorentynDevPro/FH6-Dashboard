import apiClient from './axios';

export interface RankingEntry {
  id: string;
  position: number;
  score: number;
  wins: number;
  topThree: number;
  topTen: number;
  totalRaces: number;
  winRate: number;
  user: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl?: string;
    country?: string;
  };
}

export const rankingsApi = {
  async getGlobal(params?: { page?: number; pageSize?: number }): Promise<{ data: RankingEntry[]; total: number }> {
    const res = await apiClient.get('/rankings/global', { params });
    return res.data;
  },

  async getFriends(): Promise<RankingEntry[]> {
    const res = await apiClient.get<RankingEntry[]>('/rankings/friends');
    return res.data;
  },

  async getMyRanking(): Promise<RankingEntry> {
    const res = await apiClient.get<RankingEntry>('/rankings/me');
    return res.data;
  },
};
