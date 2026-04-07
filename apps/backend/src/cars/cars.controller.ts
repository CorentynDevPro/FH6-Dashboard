import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';

@ApiTags('cars')
@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all cars with optional filters' })
  @ApiQuery({ name: 'brand', required: false })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'class', required: false })
  @ApiQuery({ name: 'drivetrain', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  async findAll(
    @Query('brand') brand?: string,
    @Query('category') category?: string,
    @Query('class') carClass?: string,
    @Query('drivetrain') drivetrain?: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.carsService.findAll({
      brand,
      category: category as any,
      carClass: carClass as any,
      drivetrain: drivetrain as any,
      page: page ? +page : 1,
      pageSize: pageSize ? +pageSize : 20,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get car by ID' })
  async findOne(@Param('id') id: string) {
    return this.carsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MODERATOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new car (Admin only)' })
  async create(@Body() dto: CreateCarDto) {
    return this.carsService.create(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MODERATOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a car (Admin only)' })
  async update(@Param('id') id: string, @Body() dto: UpdateCarDto) {
    return this.carsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a car (Admin only)' })
  async remove(@Param('id') id: string) {
    return this.carsService.remove(id);
  }
}
