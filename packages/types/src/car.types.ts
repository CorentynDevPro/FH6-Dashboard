export enum CarRarity {
  COMMON = 'COMMON',
  RARE = 'RARE',
  ULTRA_RARE = 'ULTRA_RARE',
  EPIC = 'EPIC',
  LEGENDARY = 'LEGENDARY',
}

export enum CarCategory {
  SPORT = 'SPORT',
  SUV = 'SUV',
  TRUCK = 'TRUCK',
  CLASSIC = 'CLASSIC',
  OFFROAD = 'OFFROAD',
  HYPERCAR = 'HYPERCAR',
  MUSCLE = 'MUSCLE',
  BUGGY = 'BUGGY',
  SUPERCAR = 'SUPERCAR',
  TRACK_TOY = 'TRACK_TOY',
  HOT_HATCH = 'HOT_HATCH',
  RALLY = 'RALLY',
  ELECTRIC = 'ELECTRIC',
  DRIFT = 'DRIFT',
}

export enum CarClass {
  D = 'D',
  C = 'C',
  B = 'B',
  A = 'A',
  S1 = 'S1',
  S2 = 'S2',
  X = 'X',
}

export enum DrivetrainType {
  FWD = 'FWD',
  RWD = 'RWD',
  AWD = 'AWD',
}

export interface CarStats {
  id: string;
  carId: string;
  speed: number;
  handling: number;
  acceleration: number;
  launch: number;
  braking: number;
  offroad: number;
  piRating: number;
}

export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  category: CarCategory;
  carClass: CarClass;
  drivetrain: DrivetrainType;
  engineType: string;
  displacement: number;
  horsepower: number;
  torque: number;
  weight: number;
  imageUrl?: string;
  rarity: CarRarity;
  isForzaEdition: boolean;
  creditCost: number;
  stats?: CarStats;
  createdAt: Date;
  updatedAt: Date;
}

export interface CarListResponse {
  data: Car[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CarFilterParams {
  brand?: string;
  category?: CarCategory;
  carClass?: CarClass;
  drivetrain?: DrivetrainType;
  minYear?: number;
  maxYear?: number;
  page?: number;
  pageSize?: number;
}

export interface UserCar {
  id: string;
  userId: string;
  carId: string;
  car: Car;
  notes?: string;
  addedAt: Date;
}
