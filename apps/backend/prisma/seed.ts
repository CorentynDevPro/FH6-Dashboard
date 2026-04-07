import { PrismaClient, UserRole, CarCategory, CarClass, DrivetrainType, ChallengeType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clean up
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

  // Create cars
  const carsData = [
    {
      make: 'Bugatti',
      model: 'Chiron Super Sport 300+',
      year: 2019,
      category: CarCategory.HYPERCAR,
      carClass: CarClass.X,
      drivetrain: DrivetrainType.AWD,
      engineType: 'W16 Quad-Turbo',
      displacement: 8.0,
      horsepower: 1578,
      torque: 1180,
      weight: 1995,
      imageUrl: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800',
      rarity: 5,
      creditCost: 2800000,
      stats: { speed: 10, handling: 8, acceleration: 10, launch: 9, braking: 8, offroad: 2, piRating: 998 },
    },
    {
      make: 'Lamborghini',
      model: 'Huracán STO',
      year: 2021,
      category: CarCategory.HYPERCAR,
      carClass: CarClass.S2,
      drivetrain: DrivetrainType.RWD,
      engineType: 'V10 NA',
      displacement: 5.2,
      horsepower: 631,
      torque: 417,
      weight: 1339,
      imageUrl: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800',
      rarity: 4,
      creditCost: 329490,
      stats: { speed: 9, handling: 9.5, acceleration: 9, launch: 8.5, braking: 9, offroad: 2, piRating: 900 },
    },
    {
      make: 'Ford',
      model: 'Mustang GT500',
      year: 2020,
      category: CarCategory.MUSCLE,
      carClass: CarClass.S1,
      drivetrain: DrivetrainType.RWD,
      engineType: 'Supercharged V8',
      displacement: 5.2,
      horsepower: 760,
      torque: 625,
      weight: 1827,
      imageUrl: 'https://images.unsplash.com/photo-1547744152-14d985cb937f?w=800',
      rarity: 3,
      creditCost: 92900,
      stats: { speed: 8, handling: 7, acceleration: 8.5, launch: 7, braking: 7, offroad: 3, piRating: 812 },
    },
    {
      make: 'Toyota',
      model: 'GR Yaris',
      year: 2020,
      category: CarCategory.SPORT,
      carClass: CarClass.B,
      drivetrain: DrivetrainType.AWD,
      engineType: 'Turbocharged 3-cylinder',
      displacement: 1.6,
      horsepower: 261,
      torque: 370,
      weight: 1280,
      imageUrl: 'https://images.unsplash.com/photo-1612825173281-9a193378527e?w=800',
      rarity: 2,
      creditCost: 31400,
      stats: { speed: 6, handling: 8, acceleration: 7, launch: 7.5, braking: 7, offroad: 4, piRating: 699 },
    },
    {
      make: 'Jeep',
      model: 'Wrangler Rubicon 392',
      year: 2021,
      category: CarCategory.OFFROAD,
      carClass: CarClass.C,
      drivetrain: DrivetrainType.AWD,
      engineType: 'V8',
      displacement: 6.4,
      horsepower: 470,
      torque: 470,
      weight: 2177,
      imageUrl: 'https://images.unsplash.com/photo-1566836610593-62b3a1db00c2?w=800',
      rarity: 2,
      creditCost: 57495,
      stats: { speed: 5, handling: 5, acceleration: 6, launch: 5, braking: 5, offroad: 9.5, piRating: 600 },
    },
    {
      make: 'Porsche',
      model: '911 GT3 RS',
      year: 2023,
      category: CarCategory.SPORT,
      carClass: CarClass.S1,
      drivetrain: DrivetrainType.RWD,
      engineType: 'Flat-6 NA',
      displacement: 4.0,
      horsepower: 525,
      torque: 465,
      weight: 1450,
      imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800',
      rarity: 4,
      creditCost: 224250,
      stats: { speed: 8.5, handling: 10, acceleration: 8.5, launch: 7.5, braking: 9.5, offroad: 2, piRating: 880 },
    },
    {
      make: 'Chevrolet',
      model: 'Colorado ZR2',
      year: 2023,
      category: CarCategory.TRUCK,
      carClass: CarClass.B,
      drivetrain: DrivetrainType.AWD,
      engineType: 'Turbodiesel I4',
      displacement: 2.8,
      horsepower: 186,
      torque: 369,
      weight: 2268,
      imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
      rarity: 1,
      creditCost: 46000,
      stats: { speed: 5, handling: 5, acceleration: 5, launch: 4, braking: 5, offroad: 8, piRating: 612 },
    },
    {
      make: 'BMW',
      model: 'M4 Competition',
      year: 2021,
      category: CarCategory.SPORT,
      carClass: CarClass.A,
      drivetrain: DrivetrainType.RWD,
      engineType: 'Twin-Turbo I6',
      displacement: 3.0,
      horsepower: 503,
      torque: 479,
      weight: 1725,
      imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
      rarity: 3,
      creditCost: 84900,
      stats: { speed: 7.5, handling: 8.5, acceleration: 8, launch: 7, braking: 8, offroad: 2, piRating: 789 },
    },
  ];

  const createdCars = await Promise.all(
    carsData.map(async ({ stats, ...carData }) => {
      const car = await prisma.car.create({ data: carData });
      await prisma.carStats.create({ data: { carId: car.id, ...stats } });
      return car;
    }),
  );

  // Create builds
  const buildsData = [
    {
      title: 'Chiron Ultimate Drag Setup',
      description: 'Maximum straight-line speed configuration. Launch control optimized for quarter-mile records.',
      carIndex: 0,
      authorIndex: 1,
      tuneCode: '123 456 789',
      tags: ['drag', 'straight-line', 'hypercar'],
      setupData: {
        tires: { compound: 'Race', frontPressure: 28, rearPressure: 30, frontWidth: 295, rearWidth: 355 },
        transmission: { type: 'Race', finalDrive: 3.5, gear1: 2.9, gear2: 2.1, gear3: 1.7, gear4: 1.4, gear5: 1.2, gear6: 1.0 },
      },
    },
    {
      title: 'Huracán STO Track Beast',
      description: 'Full track setup optimized for Bernese Alps circuit. Maxed downforce with race tires.',
      carIndex: 1,
      authorIndex: 2,
      tuneCode: '987 654 321',
      tags: ['track', 'time-attack', 'lamborghini'],
      setupData: {
        aero: { frontDownforce: 8, rearDownforce: 9 },
        suspension: { frontRideHeight: 90, rearRideHeight: 95, frontSpringRate: 750, rearSpringRate: 800, frontDamping: 7, rearDamping: 7, frontCamber: -2.5, rearCamber: -1.5, frontToe: -0.2, rearToe: 0.4 },
      },
    },
    {
      title: 'Mustang GT500 Drift Machine',
      description: 'Perfect rear-wheel drift setup. Locked diff, soft front suspension, and slick rear tires.',
      carIndex: 2,
      authorIndex: 0,
      tuneCode: '555 777 999',
      tags: ['drift', 'muscle', 'ford'],
      setupData: {
        tires: { compound: 'Drift', frontPressure: 26, rearPressure: 22, frontWidth: 275, rearWidth: 305 },
        suspension: { frontRideHeight: 100, rearRideHeight: 115, frontSpringRate: 500, rearSpringRate: 400, frontDamping: 5, rearDamping: 4, frontCamber: -1.5, rearCamber: -2.0, frontToe: -0.1, rearToe: 0.5 },
      },
    },
    {
      title: 'GR Yaris Rally Spec',
      description: 'Rally-inspired build with all-terrain tires. Perfect for dirt and gravel stages.',
      carIndex: 3,
      authorIndex: 3,
      tuneCode: '246 813 579',
      tags: ['rally', 'dirt', 'toyota', 'awd'],
      setupData: {
        tires: { compound: 'All-Terrain', frontPressure: 24, rearPressure: 24, frontWidth: 235, rearWidth: 235 },
      },
    },
    {
      title: 'Wrangler Extreme Offroad',
      description: 'Maximum offroad capability. Mud tires, raised suspension, and locked diffs.',
      carIndex: 4,
      authorIndex: 4,
      tuneCode: '111 222 333',
      tags: ['offroad', 'mud', 'jeep', 'crawler'],
      setupData: {
        tires: { compound: 'Mud', frontPressure: 18, rearPressure: 18, frontWidth: 265, rearWidth: 265 },
        suspension: { frontRideHeight: 150, rearRideHeight: 155, frontSpringRate: 300, rearSpringRate: 320, frontDamping: 5, rearDamping: 5, frontCamber: 0, rearCamber: 0, frontToe: 0, rearToe: 0 },
      },
    },
    {
      title: 'GT3 RS Nürburgring Setup',
      description: 'Lap-optimized tune for the Nürburgring. Stiff springs, max brakes, race tires.',
      carIndex: 5,
      authorIndex: 1,
      tuneCode: '370 911 993',
      tags: ['nurburgring', 'track', 'porsche', 'time-attack'],
      setupData: {
        brakes: { balance: 55, pressure: 95 },
        aero: { frontDownforce: 6, rearDownforce: 7 },
      },
    },
  ];

  const createdBuilds = await Promise.all(
    buildsData.map(({ carIndex, authorIndex, setupData, ...data }) =>
      prisma.build.create({
        data: {
          ...data,
          carId: createdCars[carIndex].id,
          authorId: allUsers[authorIndex].id,
          setupData: setupData as any,
          likesCount: Math.floor(Math.random() * 200),
        },
      }),
    ),
  );

  // Add comments
  const commentTexts = [
    'This tune is absolutely insane! Hit 300mph on the straight.',
    'Works great on the B-class racing series too!',
    'The suspension setup feels amazing on Goliath.',
    'Thanks for sharing! Shaved 3 seconds off my lap time.',
    'Can you share the differential settings too?',
    'Best drift tune I\'ve ever used. Smooth and controllable.',
    'Tried it on the Eliminator and it destroys everyone!',
  ];

  for (const build of createdBuilds) {
    const commentCount = Math.floor(Math.random() * 4) + 1;
    for (let i = 0; i < commentCount; i++) {
      await prisma.comment.create({
        data: {
          buildId: build.id,
          authorId: allUsers[Math.floor(Math.random() * allUsers.length)].id,
          content: commentTexts[Math.floor(Math.random() * commentTexts.length)],
        },
      });
    }
  }

  // Add likes
  for (const build of createdBuilds) {
    const likers = allUsers.slice(0, Math.floor(Math.random() * allUsers.length) + 1);
    for (const user of likers) {
      await prisma.like.upsert({
        where: { buildId_userId: { buildId: build.id, userId: user.id } },
        update: {},
        create: { buildId: build.id, userId: user.id },
      });
    }
  }

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
  console.log(`   Cars: ${createdCars.length}`);
  console.log(`   Builds: ${createdBuilds.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
