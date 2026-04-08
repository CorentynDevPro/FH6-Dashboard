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
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { BuildsService } from './builds.service';
import { CreateBuildDto } from './dto/create-build.dto';
import { UpdateBuildDto } from './dto/update-build.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

@ApiTags('builds')
@Controller('builds')
export class BuildsController {
  constructor(private readonly buildsService: BuildsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all public builds' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'carId', required: false })
  async findAll(
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('carId') carId?: string,
  ) {
    return this.buildsService.findAll({
      page: page ? +page : 1,
      pageSize: pageSize ? +pageSize : 20,
      carId,
    });
  }

  @Get('trending')
  @ApiOperation({ summary: 'Get trending builds by likes' })
  async getTrending() {
    return this.buildsService.getTrending();
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user builds' })
  async getMyBuilds(@CurrentUser() user: any) {
    return this.buildsService.findByUser(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get build by ID' })
  async findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.buildsService.findOne(id, user?.id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new build' })
  async create(@CurrentUser() user: any, @Body() dto: CreateBuildDto) {
    return this.buildsService.create(user.id, dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a build' })
  async update(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() dto: UpdateBuildDto,
  ) {
    return this.buildsService.update(id, user.id, dto, user.role);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a build' })
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.buildsService.remove(id, user.id, user.role);
  }

  @Post(':id/like')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Toggle like on a build' })
  async toggleLike(@Param('id') id: string, @CurrentUser() user: any) {
    return this.buildsService.toggleLike(id, user.id);
  }

  @Get(':id/comments')
  @ApiOperation({ summary: 'Get build comments' })
  async getComments(@Param('id') id: string) {
    return this.buildsService.getComments(id);
  }

  @Post(':id/comments')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a comment to a build' })
  async addComment(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() dto: CreateCommentDto,
  ) {
    return this.buildsService.addComment(id, user.id, dto);
  }

  @Delete(':id/comments/:commentId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a comment' })
  async deleteComment(
    @Param('id') id: string,
    @Param('commentId') commentId: string,
    @CurrentUser() user: any,
  ) {
    return this.buildsService.deleteComment(commentId, user.id, user.role);
  }
}
