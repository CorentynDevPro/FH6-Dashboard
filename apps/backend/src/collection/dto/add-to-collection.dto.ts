import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class AddToCollectionDto {
  @ApiPropertyOptional({ description: 'Optional personal notes for this car' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
