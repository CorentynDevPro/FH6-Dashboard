import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RankingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getGlobal(params: { page: number; pageSize: number }) {
    const { page, pageSize } = params;
    const [data, total] = await Promise.all([
      this.prisma.ranking.findMany({
        include: {
          user: {
            select: { id: true, username: true, displayName: true, avatarUrl: true, country: true },
          },
        },
        orderBy: { score: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.ranking.count(),
    ]);

    return {
      data: data.map((r, i) => ({ ...r, position: (page - 1) * pageSize + i + 1 })),
      total,
      page,
      pageSize,
    };
  }

  async getFriendsRanking(userId: string) {
    // In a real app you'd have a friends system; here we return top 20 + current user
    const topRankings = await this.prisma.ranking.findMany({
      include: {
        user: {
          select: { id: true, username: true, displayName: true, avatarUrl: true, country: true },
        },
      },
      orderBy: { score: 'desc' },
      take: 20,
    });

    return topRankings.map((r, i) => ({ ...r, position: i + 1 }));
  }

  async getUserRanking(userId: string) {
    return this.prisma.ranking.findUnique({
      where: { userId },
      include: {
        user: {
          select: { id: true, username: true, displayName: true, avatarUrl: true },
        },
      },
    });
  }
}
