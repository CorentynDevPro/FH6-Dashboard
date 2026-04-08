import {
  IsString,
  IsInt,
  IsEnum,
  IsOptional,
  IsNumber,
  IsUrl,
  IsBoolean,
  Min,
  Max,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CarCategory, CarClass, DrivetrainType, CarRarity } from '@prisma/client';

class CarStatsDto {
  @IsNumber() @Min(0) @Max(10) speed: number;
  @IsNumber() @Min(0) @Max(10) handling: number;
  @IsNumber() @Min(0) @Max(10) acceleration: number;
  @IsNumber() @Min(0) @Max(10) launch: number;
  @IsNumber() @Min(0) @Max(10) braking: number;
  @IsNumber() @Min(0) @Max(10) offroad: number;
  @IsInt() @Min(100) @Max(999) piRating: number;
}

export class CreateCarDto {
  @ApiProperty() @IsString() make: string;
  @ApiProperty() @IsString() model: string;
  @ApiProperty() @IsInt() @Min(1900) @Max(new Date().getFullYear() + 2) year: number;
  @ApiProperty({ enum: CarCategory }) @IsEnum(CarCategory) category: CarCategory;
  @ApiProperty({ enum: CarClass }) @IsEnum(CarClass) carClass: CarClass;
  @ApiProperty({ enum: DrivetrainType }) @IsEnum(DrivetrainType) drivetrain: DrivetrainType;
  @ApiProperty() @IsString() engineType: string;
  @ApiProperty() @IsNumber() displacement: number;
  @ApiProperty() @IsInt() horsepower: number;
  @ApiProperty() @IsInt() torque: number;
  @ApiProperty() @IsInt() weight: number;
  @ApiPropertyOptional() @IsOptional() @IsUrl() imageUrl?: string;
  @ApiPropertyOptional({ enum: CarRarity }) @IsOptional() @IsEnum(CarRarity) rarity?: CarRarity;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isForzaEdition?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(0) creditCost?: number;

  @ApiPropertyOptional({ type: CarStatsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CarStatsDto)
  stats?: CarStatsDto;
}
