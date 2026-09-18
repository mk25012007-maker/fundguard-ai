import { Controller, Get, UseGuards } from '@nestjs/common';

import { AiAnalysisService } from './ai-analysis.service';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('ai-analysis')
@UseGuards(JwtAuthGuard)
export class AiAnalysisController {
  constructor(private readonly aiAnalysisService: AiAnalysisService) {}

  @Get('trades')
  async analyzeTrades(@CurrentUser() currentUser: { id: string }) {
    return this.aiAnalysisService.analyzeTrades(currentUser.id);
  }
}
