import { IsOptional, IsInt, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProgressDto {
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(1) level?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(0) xp?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(0) xpToNextLevel?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(0) carsOwned?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(0) racesCompleted?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(0) challengesCompleted?: number;
}
