import { PrismaClient, UserRole, ChallengeType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clean up
  await prisma.userCar.deleteMany();
  await prisma.challengeCompletion.deleteMany();
  await prisma.challenge.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.progress.deleteMany();
  await prisma.ranking.deleteMany();
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.build.deleteMany();
  await prisma.carStats.deleteMany();
  await prisma.car.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();
  await prisma.season.deleteMany();

  // Create single admin user
  const adminPassword = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const adminUser = await prisma.user.create({
    data: {
      email: process.env.ADMIN_EMAIL || 'admin@fh6dashboard.com',
      username: 'admin',
      displayName: 'FH6 Admin',
      passwordHash,
      role: UserRole.ADMIN,
      bio: 'The admin of FH6 Dashboard',
      country: 'US',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
      progress: {
        create: {
          level: 1,
          xp: 0,
          xpToNextLevel: 1000,
          carsOwned: 0,
          racesCompleted: 0,
          challengesCompleted: 0,
        },
      },
      ranking: {
        create: {
          globalRank: 1,
          score: 0,
          wins: 0,
          topThree: 0,
          topTen: 0,
          totalRaces: 0,
          winRate: 0,
        },
      },
    },
  });

  // Create challenges
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  await Promise.all([
    prisma.challenge.create({
      data: {
        title: 'Speed King',
        description: 'Reach a top speed of 250mph in any car',
        type: ChallengeType.DAILY,
        xpReward: 500,
        icon: '🚀',
        startsAt: now,
        endsAt: tomorrow,
        isActive: true,
      },
    }),
    prisma.challenge.create({
      data: {
        title: 'Drift Master',
        description: 'Score 1,000,000 drift points in a single drift zone',
        type: ChallengeType.DAILY,
        xpReward: 750,
        icon: '💨',
        startsAt: now,
        endsAt: tomorrow,
        isActive: true,
      },
    }),
    prisma.challenge.create({
      data: {
        title: 'Social Builder',
        description: 'Share 3 builds with the community this week',
        type: ChallengeType.WEEKLY,
        xpReward: 2000,
        icon: '🔧',
        startsAt: now,
        endsAt: nextWeek,
        isActive: true,
      },
    }),
    prisma.challenge.create({
      data: {
        title: 'Race Champion',
        description: 'Win 10 races in Road Racing series',
        type: ChallengeType.WEEKLY,
        xpReward: 3000,
        icon: '🏆',
        startsAt: now,
        endsAt: nextWeek,
        isActive: true,
      },
    }),
    prisma.challenge.create({
      data: {
        title: 'Season Collector',
        description: 'Collect all 30 seasonal cars this season',
        type: ChallengeType.SEASONAL,
        xpReward: 10000,
        icon: '🌟',
        startsAt: now,
        endsAt: nextMonth,
        isActive: true,
      },
    }),
  ]);

  // Create active season
  await prisma.season.create({
    data: {
      name: 'Horizon Rush',
      theme: 'Speed and Adrenaline',
      startsAt: now,
      endsAt: nextMonth,
      isActive: true,
    },
  });

  console.log('✅ Seed complete!');
  console.log(`   Admin user: ${adminUser.email}`);
  console.log(`   Password:   ${adminPassword}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

