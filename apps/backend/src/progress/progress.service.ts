import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProgressDto } from './dto/update-progress.dto';

@Injectable()
export class ProgressService {
  constructor(private readonly prisma: PrismaService) {}

  async getProgress(userId: string) {
    const progress = await this.prisma.progress.findUnique({ where: { userId } });
    if (!progress) {
      throw new NotFoundException('Progress not found');
    }
    return progress;
  }

  async updateProgress(userId: string, dto: UpdateProgressDto) {
    return this.prisma.progress.upsert({
      where: { userId },
      update: dto,
      create: {
        userId,
        level: dto.level ?? 1,
        xp: dto.xp ?? 0,
        xpToNextLevel: dto.xpToNextLevel ?? 1000,
        carsOwned: dto.carsOwned ?? 0,
        racesCompleted: dto.racesCompleted ?? 0,
        challengesCompleted: dto.challengesCompleted ?? 0,
      },
    });
  }
}
