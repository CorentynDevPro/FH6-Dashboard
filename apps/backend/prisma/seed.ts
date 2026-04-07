import { PrismaClient, UserRole, CarCategory, CarClass, DrivetrainType, ChallengeType } from '@prisma/client';
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

  // Create cars
  const carsData = [
    // ── HYPERCARS ──────────────────────────────────────────────────────────────
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
      make: 'Koenigsegg',
      model: 'Jesko Absolut',
      year: 2021,
      category: CarCategory.HYPERCAR,
      carClass: CarClass.X,
      drivetrain: DrivetrainType.RWD,
      engineType: 'Twin-Turbo V8',
      displacement: 5.0,
      horsepower: 1600,
      torque: 1106,
      weight: 1320,
      imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
      rarity: 5,
      creditCost: 3000000,
      stats: { speed: 10, handling: 9, acceleration: 10, launch: 9.5, braking: 9, offroad: 1, piRating: 999 },
    },
    // ── SUPERCARS ──────────────────────────────────────────────────────────────
    {
      make: 'Lamborghini',
      model: 'Huracán STO',
      year: 2021,
      category: CarCategory.SUPERCAR,
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
      make: 'Ferrari',
      model: '296 GTB',
      year: 2022,
      category: CarCategory.SUPERCAR,
      carClass: CarClass.S2,
      drivetrain: DrivetrainType.RWD,
      engineType: 'Twin-Turbo V6 Hybrid',
      displacement: 3.0,
      horsepower: 819,
      torque: 546,
      weight: 1470,
      imageUrl: 'https://images.unsplash.com/photo-1541443131876-44b03de101c5?w=800',
      rarity: 4,
      creditCost: 322000,
      stats: { speed: 9, handling: 9, acceleration: 9.5, launch: 9, braking: 9, offroad: 1, piRating: 932 },
    },
    {
      make: 'McLaren',
      model: '765LT',
      year: 2020,
      category: CarCategory.SUPERCAR,
      carClass: CarClass.S2,
      drivetrain: DrivetrainType.RWD,
      engineType: 'Twin-Turbo V8',
      displacement: 4.0,
      horsepower: 755,
      torque: 590,
      weight: 1229,
      imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800',
      rarity: 4,
      creditCost: 358000,
      stats: { speed: 9.5, handling: 9.5, acceleration: 9.5, launch: 8.5, braking: 9.5, offroad: 1, piRating: 950 },
    },
    // ── TRACK TOYS ─────────────────────────────────────────────────────────────
    {
      make: 'Porsche',
      model: '911 GT3 RS',
      year: 2023,
      category: CarCategory.TRACK_TOY,
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
      make: 'Radical',
      model: 'SR8RX',
      year: 2018,
      category: CarCategory.TRACK_TOY,
      carClass: CarClass.S2,
      drivetrain: DrivetrainType.RWD,
      engineType: 'Supercharged V8',
      displacement: 2.8,
      horsepower: 360,
      torque: 250,
      weight: 620,
      imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800',
      rarity: 3,
      creditCost: 185000,
      stats: { speed: 8, handling: 10, acceleration: 9, launch: 9, braking: 10, offroad: 1, piRating: 945 },
    },
    // ── SPORT ──────────────────────────────────────────────────────────────────
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
    {
      make: 'Nissan',
      model: 'GT-R R35 Nismo',
      year: 2022,
      category: CarCategory.SPORT,
      carClass: CarClass.S1,
      drivetrain: DrivetrainType.AWD,
      engineType: 'Twin-Turbo V6',
      displacement: 3.8,
      horsepower: 600,
      torque: 481,
      weight: 1740,
      imageUrl: 'https://images.unsplash.com/photo-1548199569-3e1c6aa8f469?w=800',
      rarity: 3,
      creditCost: 212000,
      stats: { speed: 8.5, handling: 8.5, acceleration: 9, launch: 9.5, braking: 8.5, offroad: 3, piRating: 866 },
    },
    // ── HOT HATCHES ────────────────────────────────────────────────────────────
    {
      make: 'Toyota',
      model: 'GR Yaris',
      year: 2020,
      category: CarCategory.HOT_HATCH,
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
      make: 'Volkswagen',
      model: 'Golf R Mk8',
      year: 2021,
      category: CarCategory.HOT_HATCH,
      carClass: CarClass.B,
      drivetrain: DrivetrainType.AWD,
      engineType: 'Turbocharged I4',
      displacement: 2.0,
      horsepower: 315,
      torque: 420,
      weight: 1489,
      imageUrl: 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=800',
      rarity: 2,
      creditCost: 42100,
      stats: { speed: 6.5, handling: 8, acceleration: 7.5, launch: 7.5, braking: 7.5, offroad: 3, piRating: 712 },
    },
    {
      make: 'Renault',
      model: 'Mégane R.S. Trophy-R',
      year: 2019,
      category: CarCategory.HOT_HATCH,
      carClass: CarClass.B,
      drivetrain: DrivetrainType.FWD,
      engineType: 'Turbocharged I4',
      displacement: 1.8,
      horsepower: 300,
      torque: 420,
      weight: 1306,
      imageUrl: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=800',
      rarity: 2,
      creditCost: 44900,
      stats: { speed: 6, handling: 8.5, acceleration: 7, launch: 6.5, braking: 8, offroad: 2, piRating: 688 },
    },
    // ── MUSCLE ─────────────────────────────────────────────────────────────────
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
      make: 'Dodge',
      model: 'Challenger SRT Demon',
      year: 2018,
      category: CarCategory.MUSCLE,
      carClass: CarClass.S1,
      drivetrain: DrivetrainType.RWD,
      engineType: 'Supercharged V8',
      displacement: 6.2,
      horsepower: 840,
      torque: 770,
      weight: 1980,
      imageUrl: 'https://images.unsplash.com/photo-1612825173281-9a193378527e?w=800',
      rarity: 4,
      creditCost: 89000,
      stats: { speed: 8.5, handling: 6, acceleration: 9.5, launch: 10, braking: 6.5, offroad: 2, piRating: 856 },
    },
    // ── DRIFT ──────────────────────────────────────────────────────────────────
    {
      make: 'Nissan',
      model: 'Silvia S15 Spec-R',
      year: 2002,
      category: CarCategory.DRIFT,
      carClass: CarClass.B,
      drivetrain: DrivetrainType.RWD,
      engineType: 'Turbocharged SR20DET',
      displacement: 2.0,
      horsepower: 247,
      torque: 275,
      weight: 1240,
      imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
      rarity: 2,
      creditCost: 22500,
      stats: { speed: 6, handling: 7.5, acceleration: 6.5, launch: 6, braking: 6.5, offroad: 2, piRating: 651 },
    },
    {
      make: 'Toyota',
      model: 'AE86 Sprinter Trueno',
      year: 1986,
      category: CarCategory.DRIFT,
      carClass: CarClass.D,
      drivetrain: DrivetrainType.RWD,
      engineType: '4A-GE DOHC',
      displacement: 1.6,
      horsepower: 128,
      torque: 149,
      weight: 940,
      imageUrl: 'https://images.unsplash.com/photo-1520031441872-265e4ff70366?w=800',
      rarity: 3,
      creditCost: 18000,
      stats: { speed: 4, handling: 7, acceleration: 4.5, launch: 4, braking: 6, offroad: 2, piRating: 382 },
    },
    // ── RALLY ──────────────────────────────────────────────────────────────────
    {
      make: 'Subaru',
      model: 'Impreza WRX STI',
      year: 2004,
      category: CarCategory.RALLY,
      carClass: CarClass.A,
      drivetrain: DrivetrainType.AWD,
      engineType: 'Turbocharged EJ20',
      displacement: 2.0,
      horsepower: 300,
      torque: 407,
      weight: 1495,
      imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
      rarity: 3,
      creditCost: 34000,
      stats: { speed: 7, handling: 8.5, acceleration: 7.5, launch: 8, braking: 7.5, offroad: 7, piRating: 774 },
    },
    {
      make: 'Ford',
      model: 'Focus RS WRC 02',
      year: 2002,
      category: CarCategory.RALLY,
      carClass: CarClass.A,
      drivetrain: DrivetrainType.AWD,
      engineType: 'Turbocharged I4',
      displacement: 2.0,
      horsepower: 300,
      torque: 420,
      weight: 1230,
      imageUrl: 'https://images.unsplash.com/photo-1547744152-14d985cb937f?w=800',
      rarity: 3,
      creditCost: 48000,
      stats: { speed: 7, handling: 8.5, acceleration: 7.5, launch: 8.5, braking: 7, offroad: 8, piRating: 756 },
    },
    // ── ELECTRIC ───────────────────────────────────────────────────────────────
    {
      make: 'Rimac',
      model: 'Nevera',
      year: 2021,
      category: CarCategory.ELECTRIC,
      carClass: CarClass.S2,
      drivetrain: DrivetrainType.AWD,
      engineType: 'Quad Electric Motor',
      displacement: 0,
      horsepower: 1914,
      torque: 2360,
      weight: 2150,
      imageUrl: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800',
      rarity: 5,
      creditCost: 2400000,
      stats: { speed: 10, handling: 8.5, acceleration: 10, launch: 10, braking: 9, offroad: 2, piRating: 997 },
    },
    {
      make: 'Tesla',
      model: 'Model S Plaid',
      year: 2021,
      category: CarCategory.ELECTRIC,
      carClass: CarClass.S1,
      drivetrain: DrivetrainType.AWD,
      engineType: 'Tri Electric Motor',
      displacement: 0,
      horsepower: 1020,
      torque: 1050,
      weight: 2162,
      imageUrl: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800',
      rarity: 3,
      creditCost: 135990,
      stats: { speed: 8.5, handling: 7.5, acceleration: 10, launch: 10, braking: 8, offroad: 2, piRating: 884 },
    },
    // ── OFFROAD ────────────────────────────────────────────────────────────────
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
      make: 'Land Rover',
      model: 'Defender 90 V8',
      year: 2022,
      category: CarCategory.OFFROAD,
      carClass: CarClass.C,
      drivetrain: DrivetrainType.AWD,
      engineType: 'Supercharged V8',
      displacement: 5.0,
      horsepower: 518,
      torque: 461,
      weight: 2250,
      imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800',
      rarity: 2,
      creditCost: 105000,
      stats: { speed: 5.5, handling: 5, acceleration: 6.5, launch: 5.5, braking: 5.5, offroad: 9, piRating: 591 },
    },
    // ── CLASSIC ────────────────────────────────────────────────────────────────
    {
      make: 'Ford',
      model: 'GT40 Mk II',
      year: 1966,
      category: CarCategory.CLASSIC,
      carClass: CarClass.A,
      drivetrain: DrivetrainType.RWD,
      engineType: 'V8 7.0L',
      displacement: 7.0,
      horsepower: 485,
      torque: 570,
      weight: 1105,
      imageUrl: 'https://images.unsplash.com/photo-1574023284256-21f3ee08f4ab?w=800',
      rarity: 5,
      creditCost: 6000000,
      stats: { speed: 7.5, handling: 7, acceleration: 7.5, launch: 6.5, braking: 6, offroad: 1, piRating: 772 },
    },
    {
      make: 'Porsche',
      model: '911 Carrera RS 2.7',
      year: 1973,
      category: CarCategory.CLASSIC,
      carClass: CarClass.C,
      drivetrain: DrivetrainType.RWD,
      engineType: 'Flat-6 NA',
      displacement: 2.7,
      horsepower: 210,
      torque: 255,
      weight: 900,
      imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800',
      rarity: 4,
      creditCost: 1200000,
      stats: { speed: 5.5, handling: 7.5, acceleration: 6, launch: 5.5, braking: 6.5, offroad: 1, piRating: 560 },
    },
    // ── SUV ────────────────────────────────────────────────────────────────────
    {
      make: 'Porsche',
      model: 'Cayenne Turbo GT',
      year: 2022,
      category: CarCategory.SUV,
      carClass: CarClass.S1,
      drivetrain: DrivetrainType.AWD,
      engineType: 'Twin-Turbo V8',
      displacement: 4.0,
      horsepower: 631,
      torque: 627,
      weight: 2175,
      imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800',
      rarity: 3,
      creditCost: 189350,
      stats: { speed: 7.5, handling: 7, acceleration: 8, launch: 8, braking: 7, offroad: 5, piRating: 816 },
    },
    {
      make: 'BMW',
      model: 'X5 M Competition',
      year: 2022,
      category: CarCategory.SUV,
      carClass: CarClass.A,
      drivetrain: DrivetrainType.AWD,
      engineType: 'Twin-Turbo V8',
      displacement: 4.4,
      horsepower: 617,
      torque: 553,
      weight: 2345,
      imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
      rarity: 2,
      creditCost: 109900,
      stats: { speed: 7, handling: 6.5, acceleration: 7.5, launch: 7.5, braking: 7, offroad: 5.5, piRating: 788 },
    },
    // ── TRUCK ──────────────────────────────────────────────────────────────────
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
      make: 'Ford',
      model: 'F-150 Raptor R',
      year: 2023,
      category: CarCategory.TRUCK,
      carClass: CarClass.A,
      drivetrain: DrivetrainType.AWD,
      engineType: 'Supercharged V8',
      displacement: 5.2,
      horsepower: 700,
      torque: 640,
      weight: 2450,
      imageUrl: 'https://images.unsplash.com/photo-1547744152-14d985cb937f?w=800',
      rarity: 3,
      creditCost: 109145,
      stats: { speed: 7, handling: 5.5, acceleration: 7.5, launch: 6, braking: 6, offroad: 9, piRating: 793 },
    },
    // ── BUGGY ──────────────────────────────────────────────────────────────────
    {
      make: 'VW',
      model: 'Baja Bug',
      year: 1972,
      category: CarCategory.BUGGY,
      carClass: CarClass.C,
      drivetrain: DrivetrainType.RWD,
      engineType: 'Air-Cooled Flat-4',
      displacement: 2.0,
      horsepower: 180,
      torque: 190,
      weight: 820,
      imageUrl: 'https://images.unsplash.com/photo-1566836610593-62b3a1db00c2?w=800',
      rarity: 2,
      creditCost: 28000,
      stats: { speed: 5, handling: 6, acceleration: 5.5, launch: 6, braking: 5, offroad: 8.5, piRating: 528 },
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
  // Car index reference (0-based in carsData above):
  //  0 Bugatti Chiron   1 Koenigsegg Jesko  2 Lambo Huracán STO  3 Ferrari 296 GTB
  //  4 McLaren 765LT    5 Porsche GT3 RS     6 Radical SR8RX      7 BMW M4
  //  8 Nissan GT-R     9 Toyota GR Yaris    10 VW Golf R          11 Renault Mégane
  // 12 Ford Mustang    13 Dodge Demon       14 Nissan Silvia       15 Toyota AE86
  // 16 Subaru WRX STI  17 Ford Focus WRC   18 Rimac Nevera        19 Tesla Plaid
  // 20 Jeep Wrangler   21 Land Rover       22 Ford GT40           23 Porsche RS 2.7
  // 24 Cayenne GT      25 BMW X5 M         26 Chevy ZR2           27 Ford Raptor R
  // 28 VW Baja Bug
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
        differential: { type: 'Race', awdFront: 20, awdRear: 80, awdBalance: 75 },
      },
    },
    {
      title: 'Huracán STO Track Beast',
      description: 'Full track setup optimized for Bernese Alps circuit. Maxed downforce with race tires.',
      carIndex: 2,
      authorIndex: 2,
      tuneCode: '987 654 321',
      tags: ['track', 'time-attack', 'lamborghini'],
      setupData: {
        tires: { compound: 'Race', frontPressure: 30, rearPressure: 28, frontWidth: 245, rearWidth: 305 },
        alignment: { frontCamber: -2.5, rearCamber: -1.5, frontToe: -0.2, rearToe: 0.4, frontCaster: 6.5 },
        aero: { frontDownforce: 380, rearDownforce: 450 },
        brakes: { balance: 58, pressure: 100 },
        differential: { type: 'Race', rwdAcceleration: 75, rwdDeceleration: 25 },
      },
    },
    {
      title: 'Mustang GT500 Drift Machine',
      description: 'Perfect rear-wheel drift setup. Locked diff, soft front suspension, and slick rear tires.',
      carIndex: 12,
      authorIndex: 0,
      tuneCode: '555 777 999',
      tags: ['drift', 'muscle', 'ford'],
      setupData: {
        tires: { compound: 'Drift', frontPressure: 26, rearPressure: 22, frontWidth: 275, rearWidth: 305 },
        suspension: { frontRideHeight: 11, rearRideHeight: 13, frontSpringRate: 500, rearSpringRate: 400 },
        dampers: { frontCompression: 5, rearCompression: 4, frontRebound: 7, rearRebound: 6 },
        differential: { type: 'Race', rwdAcceleration: 90, rwdDeceleration: 35 },
      },
    },
    {
      title: 'GR Yaris Rally Spec',
      description: 'Rally-inspired build with all-terrain tires. Perfect for dirt and gravel stages.',
      carIndex: 9,
      authorIndex: 3,
      tuneCode: '246 813 579',
      tags: ['rally', 'dirt', 'toyota', 'awd'],
      setupData: {
        tires: { compound: 'Rally', frontPressure: 24, rearPressure: 24, frontWidth: 235, rearWidth: 235 },
        suspension: { frontRideHeight: 18, rearRideHeight: 19, frontSpringRate: 280, rearSpringRate: 300 },
        differential: { type: 'Race', awdFront: 35, awdRear: 65, awdBalance: 65 },
      },
    },
    {
      title: 'Wrangler Extreme Offroad',
      description: 'Maximum offroad capability. Mud tires, raised suspension, and locked diffs.',
      carIndex: 20,
      authorIndex: 4,
      tuneCode: '111 222 333',
      tags: ['offroad', 'mud', 'jeep', 'crawler'],
      setupData: {
        tires: { compound: 'Offroad', frontPressure: 18, rearPressure: 18, frontWidth: 265, rearWidth: 265 },
        suspension: { frontRideHeight: 30, rearRideHeight: 31, frontSpringRate: 300, rearSpringRate: 320 },
        differential: { type: 'Race', awdFront: 50, awdRear: 50, awdBalance: 50 },
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
        tires: { compound: 'Race', frontPressure: 30, rearPressure: 28, frontWidth: 265, rearWidth: 305 },
        alignment: { frontCamber: -3.0, rearCamber: -2.0, frontToe: -0.1, rearToe: 0.3, frontCaster: 7.0 },
        brakes: { balance: 55, pressure: 95 },
        aero: { frontDownforce: 250, rearDownforce: 320 },
        differential: { type: 'Race', rwdAcceleration: 60, rwdDeceleration: 20 },
      },
    },
    {
      title: 'Rimac Nevera Street Killer',
      description: 'Insane launch control using all four motors. Near-perfect 0-60 in under 2 seconds.',
      carIndex: 18,
      authorIndex: 2,
      tuneCode: '000 001 999',
      tags: ['electric', 'drag', 'rimac'],
      setupData: {
        tires: { compound: 'Sport', frontPressure: 32, rearPressure: 32, frontWidth: 275, rearWidth: 305 },
        differential: { type: 'Race', awdFront: 25, awdRear: 75, awdBalance: 70 },
        brakes: { balance: 52, pressure: 100 },
      },
    },
    {
      title: 'Silvia S15 Angle King',
      description: 'Maximum drift angle with full lock steering and aggressive diff. Smoke machine.',
      carIndex: 14,
      authorIndex: 0,
      tuneCode: '240 240 240',
      tags: ['drift', 'nissan', 'angle', 'rwd'],
      setupData: {
        tires: { compound: 'Drift', frontPressure: 22, rearPressure: 20, frontWidth: 235, rearWidth: 265 },
        alignment: { frontCamber: -3.5, rearCamber: -1.0, frontToe: -0.5, rearToe: 0.2, frontCaster: 7.5 },
        antiRollBars: { front: 15, rear: 45 },
        differential: { type: 'Race', rwdAcceleration: 95, rwdDeceleration: 15 },
      },
    },
    {
      title: 'WRX STI Gravel Master',
      description: 'Maximum grip rally build for dirt and gravel events. Stiff but planted.',
      carIndex: 16,
      authorIndex: 3,
      tuneCode: '360 555 888',
      tags: ['rally', 'subaru', 'gravel', 'awd'],
      setupData: {
        tires: { compound: 'Rally', frontPressure: 26, rearPressure: 26, frontWidth: 225, rearWidth: 225 },
        suspension: { frontRideHeight: 17, rearRideHeight: 18, frontSpringRate: 350, rearSpringRate: 380 },
        differential: { type: 'Race', awdFront: 40, awdRear: 60, awdBalance: 62 },
        brakes: { balance: 48, pressure: 90 },
      },
    },
    {
      title: 'BMW M4 Daily Driver+',
      description: 'Street build that remains comfortable while still offering impressive performance.',
      carIndex: 7,
      authorIndex: 4,
      tuneCode: '800 333 666',
      tags: ['bmw', 'street', 'sport', 'daily'],
      setupData: {
        tires: { compound: 'Sport', frontPressure: 31, rearPressure: 29, frontWidth: 265, rearWidth: 285 },
        alignment: { frontCamber: -1.5, rearCamber: -1.0, frontToe: -0.1, rearToe: 0.2, frontCaster: 5.5 },
        differential: { type: 'Sport', rwdAcceleration: 65, rwdDeceleration: 20 },
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
