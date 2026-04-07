import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddToCollectionDto } from './dto/add-to-collection.dto';

@Injectable()
export class CollectionService {
  constructor(private readonly prisma: PrismaService) {}

  async getCollection(userId: string) {
    return this.prisma.userCar.findMany({
      where: { userId },
      include: {
        car: { include: { stats: true } },
      },
      orderBy: { addedAt: 'desc' },
    });
  }

  async addCar(userId: string, carId: string, dto: AddToCollectionDto) {
    const car = await this.prisma.car.findUnique({ where: { id: carId } });
    if (!car) throw new NotFoundException('Car not found');

    const existing = await this.prisma.userCar.findUnique({
      where: { userId_carId: { userId, carId } },
    });
    if (existing) throw new ConflictException('Car already in collection');

    const entry = await this.prisma.userCar.create({
      data: { userId, carId, notes: dto.notes },
      include: { car: { include: { stats: true } } },
    });

    await this.prisma.progress.upsert({
      where: { userId },
      update: { carsOwned: { increment: 1 } },
      create: { userId, carsOwned: 1 },
    });

    return entry;
  }

  async removeCar(userId: string, carId: string) {
    const entry = await this.prisma.userCar.findUnique({
      where: { userId_carId: { userId, carId } },
    });
    if (!entry) throw new NotFoundException('Car not in collection');

    await this.prisma.userCar.delete({
      where: { userId_carId: { userId, carId } },
    });

    await this.prisma.progress.upsert({
      where: { userId },
      update: { carsOwned: { decrement: 1 } },
      create: { userId, carsOwned: 0 },
    });

    return { message: 'Car removed from collection' };
  }

  async isInCollection(userId: string, carId: string): Promise<boolean> {
    const entry = await this.prisma.userCar.findUnique({
      where: { userId_carId: { userId, carId } },
    });
    return !!entry;
  }
}
