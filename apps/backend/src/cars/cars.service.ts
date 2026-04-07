import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CarCategory, CarClass, DrivetrainType } from '@prisma/client';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';

interface CarFilterParams {
  brand?: string;
  category?: CarCategory;
  carClass?: CarClass;
  drivetrain?: DrivetrainType;
  page?: number;
  pageSize?: number;
}

@Injectable()
export class CarsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: CarFilterParams) {
    const { brand, category, carClass, drivetrain, page = 1, pageSize = 20 } = params;

    const where: any = {};
    if (brand) where.make = { contains: brand, mode: 'insensitive' };
    if (category) where.category = category;
    if (carClass) where.carClass = carClass;
    if (drivetrain) where.drivetrain = drivetrain;

    const [data, total] = await Promise.all([
      this.prisma.car.findMany({
        where,
        include: { stats: true },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: [{ make: 'asc' }, { model: 'asc' }],
      }),
      this.prisma.car.count({ where }),
    ]);

    return { data, total, page, pageSize };
  }

  async findOne(id: string) {
    const car = await this.prisma.car.findUnique({
      where: { id },
      include: {
        stats: true,
        builds: {
          where: { isPublic: true },
          include: {
            author: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
          },
          orderBy: { likesCount: 'desc' },
          take: 10,
        },
      },
    });

    if (!car) {
      throw new NotFoundException('Car not found');
    }

    return car;
  }

  async create(dto: CreateCarDto) {
    const { stats, ...carData } = dto;
    const car = await this.prisma.car.create({
      data: {
        ...carData,
        stats: stats ? { create: stats } : undefined,
      },
      include: { stats: true },
    });
    return car;
  }

  async update(id: string, dto: UpdateCarDto) {
    const { stats, ...carData } = dto;

    const car = await this.prisma.car.update({
      where: { id },
      data: {
        ...carData,
        stats: stats
          ? {
              upsert: {
                create: stats,
                update: stats,
              },
            }
          : undefined,
      },
      include: { stats: true },
    });
    return car;
  }

  async remove(id: string) {
    await this.prisma.car.delete({ where: { id } });
    return { message: 'Car deleted successfully' };
  }
}
