import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CollectionService } from './collection.service';
import { AddToCollectionDto } from './dto/add-to-collection.dto';

@ApiTags('collection')
@Controller('collection')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @Get()
  @ApiOperation({ summary: 'Get current user car collection' })
  async getCollection(@CurrentUser() user: any) {
    return this.collectionService.getCollection(user.id);
  }

  @Post(':carId')
  @ApiOperation({ summary: 'Add a car to current user collection' })
  async addCar(
    @CurrentUser() user: any,
    @Param('carId') carId: string,
    @Body() dto: AddToCollectionDto,
  ) {
    return this.collectionService.addCar(user.id, carId, dto);
  }

  @Delete(':carId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove a car from current user collection' })
  async removeCar(@CurrentUser() user: any, @Param('carId') carId: string) {
    return this.collectionService.removeCar(user.id, carId);
  }
}
