export enum UserRole {
  USER = 'USER',
  MODERATOR = 'MODERATOR',
  ADMIN = 'ADMIN',
}

export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  role: UserRole;
  bio?: string;
  country?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile extends User {
  totalBuilds: number;
  totalLikes: number;
  achievements: Achievement[];
  progress?: UserProgress;
}

export interface UserProgress {
  id: string;
  userId: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  carsOwned: number;
  racesCompleted: number;
  challengesCompleted: number;
  updatedAt: Date;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
}

export interface UpdateUserDto {
  displayName?: string;
  bio?: string;
  country?: string;
  avatarUrl?: string;
}
