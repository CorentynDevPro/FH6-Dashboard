import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ChallengesService } from './challenges.service';

@ApiTags('challenges')
@Controller('challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  @Get('current')
  @ApiOperation({ summary: 'Get active challenges' })
  async getCurrent() {
    return this.challengesService.getCurrentChallenges();
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all challenges' })
  async getAll() {
    return this.challengesService.getAllChallenges();
  }

  @Post(':id/complete')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark a challenge as completed' })
  async complete(@Param('id') id: string, @CurrentUser() user: any) {
    return this.challengesService.completeChallenge(id, user.id);
  }
}
