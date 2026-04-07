import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ProgressService } from './progress.service';
import { UpdateProgressDto } from './dto/update-progress.dto';

@ApiTags('progress')
@Controller('progress')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user progress' })
  async getMyProgress(@CurrentUser() user: any) {
    return this.progressService.getProgress(user.id);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current user progress' })
  async updateProgress(@CurrentUser() user: any, @Body() dto: UpdateProgressDto) {
    return this.progressService.updateProgress(user.id, dto);
  }
}
