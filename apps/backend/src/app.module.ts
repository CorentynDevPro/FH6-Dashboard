import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CarsModule } from './cars/cars.module';
import { BuildsModule } from './builds/builds.module';
import { RankingsModule } from './rankings/rankings.module';
import { ProgressModule } from './progress/progress.module';
import { ChallengesModule } from './challenges/challenges.module';
import { CollectionModule } from './collection/collection.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    CarsModule,
    BuildsModule,
    RankingsModule,
    ProgressModule,
    ChallengesModule,
    CollectionModule,
  ],
})
export class AppModule {}
