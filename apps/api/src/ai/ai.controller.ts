import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { AiService } from './ai.service';

import { AskAiDto } from './dto/ask-ai.dto';
import { AiResponseDto } from './dto/ai-response.dto';

import { AnalyzeTradeDto } from './dto/analyze-trade.dto';
import { TradeAnalysisResponseDto } from './dto/trade-analysis-response.dto';

import { AnalyzeRiskDto } from './dto/analyze-risk.dto';
import { RiskAnalysisResponseDto } from './dto/risk-analysis-response.dto';

import { AiCoachingDto } from './dto/ai-coaching.dto';
import { CoachingResponseDto } from './dto/coaching-response.dto';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('ask')
  async askAI(@Body() dto: AskAiDto): Promise<AiResponseDto> {
    const response = await this.aiService.askAI(dto.message.trim());

    return {
      success: true,
      response,
    };
  }

  @Post('analyze-trade')
  async analyzeTrade(
    @Body() dto: AnalyzeTradeDto,
  ): Promise<TradeAnalysisResponseDto> {
    return this.aiService.analyzeTrade(dto);
  }

  @Post('analyze-risk')
  async analyzeRisk(
    @Body() dto: AnalyzeRiskDto,
  ): Promise<RiskAnalysisResponseDto> {
    return this.aiService.analyzeRisk(dto);
  }

  @Post('coaching')
  async coaching(@Body() dto: AiCoachingDto): Promise<CoachingResponseDto> {
    return this.aiService.generateCoaching({
      message: dto.message ?? '',
      experience: dto.experience,
      recentPerformance: dto.recentPerformance,
      mainChallenge: dto.mainChallenge,
      goal: dto.goal,
      accountBalance: dto.accountBalance,
      dailyLossLimit: dto.dailyLossLimit,
      currentDailyLoss: dto.currentDailyLoss,
      riskPercent: dto.riskPercent,
      tradesToday: dto.tradesToday,
    });
  }
}
