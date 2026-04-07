import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChallengesService {
  constructor(private readonly prisma: PrismaService) {}

  async getCurrentChallenges() {
    const now = new Date();
    return this.prisma.challenge.findMany({
      where: {
        isActive: true,
        startsAt: { lte: now },
        endsAt: { gte: now },
      },
      orderBy: { endsAt: 'asc' },
    });
  }

  async getAllChallenges() {
    return this.prisma.challenge.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async completeChallenge(challengeId: string, userId: string) {
    const existing = await this.prisma.challengeCompletion.findUnique({
      where: { challengeId_userId: { challengeId, userId } },
    });

    if (existing) {
      throw new ConflictException('Challenge already completed');
    }

    const completion = await this.prisma.challengeCompletion.create({
      data: { challengeId, userId },
      include: { challenge: true },
    });

    // Award XP to the user
    await this.prisma.progress.updateMany({
      where: { userId },
      data: {
        xp: { increment: completion.challenge.xpReward },
        challengesCompleted: { increment: 1 },
      },
    });

    return { message: 'Challenge completed!', xpAwarded: completion.challenge.xpReward };
  }
}
