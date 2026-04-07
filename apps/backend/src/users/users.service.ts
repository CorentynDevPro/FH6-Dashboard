import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { passwordHash, ...rest } = user;
    return rest;
  }

  async findOneWithProfile(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        progress: true,
        achievements: true,
        ranking: true,
        _count: {
          select: {
            builds: true,
            likes: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { passwordHash, ...rest } = user;
    return {
      ...rest,
      totalBuilds: rest._count.builds,
      totalLikes: rest._count.likes,
    };
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: { id },
      data: dto,
    });
    const { passwordHash, ...rest } = user;
    return rest;
  }
}
