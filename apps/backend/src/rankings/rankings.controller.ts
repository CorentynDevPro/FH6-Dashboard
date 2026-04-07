import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RankingsService } from './rankings.service';

@ApiTags('rankings')
@Controller('rankings')
export class RankingsController {
  constructor(private readonly rankingsService: RankingsService) {}

  @Get('global')
  @ApiOperation({ summary: 'Get global leaderboard' })
  async getGlobal(
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.rankingsService.getGlobal({
      page: page ? +page : 1,
      pageSize: pageSize ? +pageSize : 50,
    });
  }

  @Get('friends')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get friends leaderboard' })
  async getFriends(@CurrentUser() user: any) {
    return this.rankingsService.getFriendsRanking(user.id);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user ranking' })
  async getMyRanking(@CurrentUser() user: any) {
    return this.rankingsService.getUserRanking(user.id);
  }
}
