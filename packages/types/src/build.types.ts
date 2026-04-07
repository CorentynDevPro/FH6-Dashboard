import { User } from './user.types';
import { Car } from './car.types';

export interface Build {
  id: string;
  title: string;
  description: string;
  carId: string;
  car?: Car;
  authorId: string;
  author?: User;
  tuneCode?: string;
  isPublic: boolean;
  likesCount: number;
  commentsCount: number;
  tags: string[];
  setupData: BuildSetup;
  comments?: BuildComment[];
  likedByMe?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BuildSetup {
  tires?: TireSetup;
  suspension?: SuspensionSetup;
  engine?: EngineSetup;
  transmission?: TransmissionSetup;
  aero?: AeroSetup;
  brakes?: BrakeSetup;
}

export interface TireSetup {
  compound: string;
  frontPressure: number;
  rearPressure: number;
  frontWidth: number;
  rearWidth: number;
}

export interface SuspensionSetup {
  frontRideHeight: number;
  rearRideHeight: number;
  frontSpringRate: number;
  rearSpringRate: number;
  frontDamping: number;
  rearDamping: number;
  frontCamber: number;
  rearCamber: number;
  frontToe: number;
  rearToe: number;
}

export interface EngineSetup {
  intake: string;
  camshaft: string;
  valves: string;
  displacement: string;
  pistons: string;
  turbo?: string;
  intercooler?: string;
  oilCooling?: string;
  flywheel?: string;
}

export interface TransmissionSetup {
  type: string;
  finalDrive: number;
  gear1: number;
  gear2: number;
  gear3: number;
  gear4: number;
  gear5: number;
  gear6?: number;
  gear7?: number;
  gear8?: number;
  gear9?: number;
  gear10?: number;
}

export interface AeroSetup {
  frontDownforce: number;
  rearDownforce: number;
}

export interface BrakeSetup {
  balance: number;
  pressure: number;
}

export interface BuildComment {
  id: string;
  buildId: string;
  authorId: string;
  author?: User;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBuildDto {
  title: string;
  description: string;
  carId: string;
  tuneCode?: string;
  isPublic?: boolean;
  tags?: string[];
  setupData?: BuildSetup;
}

export interface UpdateBuildDto {
  title?: string;
  description?: string;
  tuneCode?: string;
  isPublic?: boolean;
  tags?: string[];
  setupData?: BuildSetup;
}

export interface BuildListResponse {
  data: Build[];
  total: number;
  page: number;
  pageSize: number;
}
