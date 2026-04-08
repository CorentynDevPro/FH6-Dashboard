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

  // Create users
  const passwordHash = await bcrypt.hash('password123', 10);

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@fh6dashboard.com',
      username: 'admin',
      displayName: 'FH6 Admin',
      passwordHash,
      role: UserRole.ADMIN,
      bio: 'The admin of FH6 Dashboard',
      country: 'US',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    },
  });

  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'drift_king@fh6.com',
        username: 'drift_king',
        displayName: 'Drift King',
        passwordHash,
        bio: 'Sideways is the only way',
        country: 'JP',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=driftking',
      },
    }),
    prisma.user.create({
      data: {
        email: 'speed_demon@fh6.com',
        username: 'speed_demon',
        displayName: 'Speed Demon',
        passwordHash,
        bio: 'Full throttle, never back off',
        country: 'DE',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=speeddemon',
      },
    }),
    prisma.user.create({
      data: {
        email: 'offroad_warrior@fh6.com',
        username: 'offroad_warrior',
        displayName: 'Offroad Warrior',
        passwordHash,
        bio: 'Where roads end, adventure begins',
        country: 'AU',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=offroadwarrior',
      },
    }),
    prisma.user.create({
      data: {
        email: 'tuner_pro@fh6.com',
        username: 'tuner_pro',
        displayName: 'Tuner Pro',
        passwordHash,
        bio: 'Every millisecond counts',
        country: 'GB',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tunerpro',
      },
    }),
  ]);

  const allUsers = [adminUser, ...users];

  // Create rankings
  for (let i = 0; i < allUsers.length; i++) {
    const wins = Math.floor(Math.random() * 500);
    const totalRaces = wins + Math.floor(Math.random() * 1000) + 100;
    await prisma.ranking.create({
      data: {
        userId: allUsers[i].id,
        globalRank: i + 1,
        score: Math.floor(Math.random() * 50000) + 10000,
        wins,
        topThree: wins + Math.floor(Math.random() * 200),
        topTen: wins + Math.floor(Math.random() * 400) + 200,
        totalRaces,
        winRate: parseFloat(((wins / totalRaces) * 100).toFixed(2)),
      },
    });
  }

  // Create progress
  for (const user of allUsers) {
    await prisma.progress.create({
      data: {
        userId: user.id,
        level: Math.floor(Math.random() * 50) + 1,
        xp: Math.floor(Math.random() * 50000),
        xpToNextLevel: 1000 + Math.floor(Math.random() * 5000),
        carsOwned: Math.floor(Math.random() * 100) + 5,
        racesCompleted: Math.floor(Math.random() * 2000) + 50,
        challengesCompleted: Math.floor(Math.random() * 200) + 10,
      },
    });
  }

  // Create achievements
  const achievementData = [
    { name: 'First Win', description: 'Win your first race', icon: '🏆' },
    { name: 'Speed Demon', description: 'Reach 300mph', icon: '⚡' },
    { name: 'Car Collector', description: 'Own 50 cars', icon: '🚗' },
    { name: 'Build Master', description: 'Create 10 builds', icon: '🔧' },
    { name: 'Community Star', description: 'Get 100 likes on a build', icon: '⭐' },
  ];

  for (const user of allUsers) {
    const numAchievements = Math.floor(Math.random() * achievementData.length) + 1;
    for (let i = 0; i < numAchievements; i++) {
      await prisma.achievement.create({
        data: {
          userId: user.id,
          ...achievementData[i],
        },
      });
    }
  }

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
  console.log(`   Users: ${allUsers.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
