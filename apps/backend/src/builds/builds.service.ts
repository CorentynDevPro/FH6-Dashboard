import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBuildDto } from './dto/create-build.dto';
import { UpdateBuildDto } from './dto/update-build.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

const AUTHOR_SELECT = {
  id: true,
  username: true,
  displayName: true,
  avatarUrl: true,
};

@Injectable()
export class BuildsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: { page: number; pageSize: number; carId?: string }) {
    const { page, pageSize, carId } = params;
    const where: any = { isPublic: true };
    if (carId) where.carId = carId;

    const [data, total] = await Promise.all([
      this.prisma.build.findMany({
        where,
        include: {
          author: { select: AUTHOR_SELECT },
          car: { select: { id: true, make: true, model: true, year: true, imageUrl: true } },
          _count: { select: { comments: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.build.count({ where }),
    ]);

    return { data, total, page, pageSize };
  }

  async getTrending() {
    return this.prisma.build.findMany({
      where: { isPublic: true },
      include: {
        author: { select: AUTHOR_SELECT },
        car: { select: { id: true, make: true, model: true, year: true, imageUrl: true } },
        _count: { select: { comments: true } },
      },
      orderBy: { likesCount: 'desc' },
      take: 10,
    });
  }

  async findByUser(userId: string) {
    return this.prisma.build.findMany({
      where: { authorId: userId },
      include: {
        car: { select: { id: true, make: true, model: true, year: true, imageUrl: true } },
        _count: { select: { comments: true, likes: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, currentUserId?: string) {
    const build = await this.prisma.build.findUnique({
      where: { id },
      include: {
        author: { select: AUTHOR_SELECT },
        car: { include: { stats: true } },
        comments: {
          include: { author: { select: AUTHOR_SELECT } },
          orderBy: { createdAt: 'desc' },
        },
        likes: currentUserId ? { where: { userId: currentUserId } } : false,
        _count: { select: { comments: true, likes: true } },
      },
    });

    if (!build) {
      throw new NotFoundException('Build not found');
    }

    return {
      ...build,
      likedByMe: currentUserId ? build.likes?.length > 0 : false,
    };
  }

  async create(authorId: string, dto: CreateBuildDto) {
    return this.prisma.build.create({
      data: {
        ...dto,
        authorId,
        setupData: (dto.setupData as any) ?? {},
        tags: dto.tags ?? [],
      },
      include: {
        author: { select: AUTHOR_SELECT },
        car: true,
      },
    });
  }

  async update(id: string, userId: string, dto: UpdateBuildDto) {
    const build = await this.prisma.build.findUnique({ where: { id } });
    if (!build) throw new NotFoundException('Build not found');
    if (build.authorId !== userId) throw new ForbiddenException('Not your build');

    return this.prisma.build.update({
      where: { id },
      data: { ...dto, setupData: (dto.setupData as any) },
    });
  }

  async remove(id: string, userId: string) {
    const build = await this.prisma.build.findUnique({ where: { id } });
    if (!build) throw new NotFoundException('Build not found');
    if (build.authorId !== userId) throw new ForbiddenException('Not your build');
    await this.prisma.build.delete({ where: { id } });
    return { message: 'Build deleted' };
  }

  async toggleLike(buildId: string, userId: string) {
    const existing = await this.prisma.like.findUnique({
      where: { buildId_userId: { buildId, userId } },
    });

    if (existing) {
      await this.prisma.like.delete({ where: { id: existing.id } });
      await this.prisma.build.update({
        where: { id: buildId },
        data: { likesCount: { decrement: 1 } },
      });
      return { liked: false };
    } else {
      await this.prisma.like.create({ data: { buildId, userId } });
      await this.prisma.build.update({
        where: { id: buildId },
        data: { likesCount: { increment: 1 } },
      });
      return { liked: true };
    }
  }

  async getComments(buildId: string) {
    return this.prisma.comment.findMany({
      where: { buildId },
      include: { author: { select: AUTHOR_SELECT } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async addComment(buildId: string, authorId: string, dto: CreateCommentDto) {
    const build = await this.prisma.build.findUnique({ where: { id: buildId } });
    if (!build) throw new NotFoundException('Build not found');

    return this.prisma.comment.create({
      data: { buildId, authorId, content: dto.content },
      include: { author: { select: AUTHOR_SELECT } },
    });
  }

  async deleteComment(commentId: string, userId: string) {
    const comment = await this.prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.authorId !== userId) throw new ForbiddenException('Not your comment');
    await this.prisma.comment.delete({ where: { id: commentId } });
    return { message: 'Comment deleted' };
  }
}
