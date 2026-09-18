import { Injectable, InternalServerErrorException } from '@nestjs/common';
import OpenAI from 'openai';
import { AnalyzeTradeDto } from './dto/analyze-trade.dto';
import { TradeAnalysisResponseDto } from './dto/trade-analysis-response.dto';
import { AnalyzeRiskDto } from './dto/analyze-risk.dto';
import { RiskAnalysisResponseDto } from './dto/risk-analysis-response.dto';
import { AiCoachingDto } from './dto/ai-coaching.dto';
import { CoachingResponseDto } from './dto/coaching-response.dto';

@Injectable()
export class AiService {
  private readonly openai: OpenAI | null;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;

    this.openai = apiKey
      ? new OpenAI({
          apiKey,
        })
      : null;
  }

  async askAI(message: string): Promise<string> {
    if (!this.openai) {
      return 'Follow your funded-account rules first. Never risk more than your planned risk per trade, and stop trading when your daily loss limit is reached.';
    }

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'You are FundGuard AI, an AI trading discipline assistant. Focus on risk management, funded-account rules, discipline, and avoiding rule violations. Do not provide guaranteed trading signals.',
          },
          {
            role: 'user',
            content: message,
          },
        ],
        temperature: 0.3,
        max_tokens: 300,
      });

      return (
        response.choices[0]?.message?.content?.trim() ||
        'Stay within your funded-account rules and protect your risk limits.'
      );
    } catch (error) {
      console.error('OpenAI request failed:', error);

      return 'Follow your funded-account rules first. Control your risk, avoid revenge trading, and stop when your daily loss limit is reached.';
    }
  }

  async analyzeTrade(dto: AnalyzeTradeDto): Promise<TradeAnalysisResponseDto> {
    const riskRewardRatio =
      dto.riskRewardRatio ?? this.calculateRiskReward(dto);

    const score = this.calculateTradeScore(riskRewardRatio, dto.riskPercent);

    let assessment: TradeAnalysisResponseDto['assessment'];

    if (score >= 80) {
      assessment = 'LOW_RISK';
    } else if (score >= 60) {
      assessment = 'MODERATE_RISK';
    } else {
      assessment = 'HIGH_RISK';
    }

    const recommendations = this.buildTradeRecommendations(
      riskRewardRatio,
      dto.riskPercent,
    );

    return {
      success: true,
      assessment,
      score,
      riskRewardRatio,
      riskPercent: dto.riskPercent,
      analysis: `Trade analysis for ${dto.asset} ${dto.direction}. Risk is ${dto.riskPercent}% with a ${riskRewardRatio.toFixed(2)} risk-to-reward ratio.`,
      recommendations,
    };
  }

  async analyzeRisk(dto: AnalyzeRiskDto): Promise<RiskAnalysisResponseDto> {
    const riskRewardRatio =
      dto.riskRewardRatio ?? this.calculateRiskReward(dto);

    const dailyLossUsagePercent =
      dto.dailyLossLimit && dto.dailyLossLimit > 0
        ? ((dto.currentDailyLoss ?? 0) / dto.dailyLossLimit) * 100
        : 0;

    const drawdownUsagePercent =
      dto.maxDrawdown && dto.maxDrawdown > 0
        ? ((dto.currentDrawdown ?? 0) / dto.maxDrawdown) * 100
        : 0;

    const warnings: string[] = [];
    const recommendations: string[] = [];

    if (dto.riskPercent > 2) {
      warnings.push('Risk per trade is above 2%.');
      recommendations.push('Reduce risk per trade to 1-2% or less.');
    }

    if (dailyLossUsagePercent >= 80) {
      warnings.push('Daily loss usage is approaching the account limit.');
      recommendations.push('Consider stopping trading for the day.');
    }

    if (drawdownUsagePercent >= 80) {
      warnings.push('Drawdown usage is approaching the maximum limit.');
      recommendations.push('Reduce exposure and protect remaining drawdown.');
    }

    if (dto.tradesToday !== undefined && dto.tradesToday >= 5) {
      warnings.push('High number of trades today.');
      recommendations.push(
        'Avoid overtrading and wait for high-quality setups.',
      );
    }

    let score = 100;

    if (dto.riskPercent > 2) {
      score -= 20;
    }

    if (dto.riskPercent > 3) {
      score -= 20;
    }

    if (dailyLossUsagePercent >= 80) {
      score -= 20;
    }

    if (drawdownUsagePercent >= 80) {
      score -= 20;
    }

    if (dto.tradesToday !== undefined && dto.tradesToday >= 5) {
      score -= 10;
    }

    score = Math.max(0, Math.min(100, score));

    let riskLevel: RiskAnalysisResponseDto['riskLevel'];

    if (score >= 80) {
      riskLevel = 'LOW_RISK';
    } else if (score >= 60) {
      riskLevel = 'MODERATE_RISK';
    } else {
      riskLevel = 'HIGH_RISK';
    }

    const summary =
      riskLevel === 'LOW_RISK'
        ? 'Risk conditions are currently controlled.'
        : riskLevel === 'MODERATE_RISK'
          ? 'Risk is elevated. Review your exposure before continuing.'
          : 'Risk is high. Protect the account and avoid additional unnecessary exposure.';

    return {
      success: true,
      riskLevel,
      score,
      riskRewardRatio,
      riskPercent: dto.riskPercent,
      dailyLossUsagePercent,
      drawdownUsagePercent,
      analysis: `Risk analysis for ${dto.asset} ${dto.direction}. Current risk is ${dto.riskPercent}% with a ${riskRewardRatio.toFixed(2)} risk-to-reward ratio.`,
      warnings,
      recommendations,
      summary,
    };
  }

  async generateCoaching(dto: AiCoachingDto): Promise<CoachingResponseDto> {
    const disciplineScore = 70;

    let coachingLevel: CoachingResponseDto['coachingLevel'];

    if (disciplineScore < 50) {
      coachingLevel = 'BEGINNER';
    } else if (disciplineScore < 80) {
      coachingLevel = 'INTERMEDIATE';
    } else {
      coachingLevel = 'ADVANCED';
    }
    return {
      coachingLevel,
      disciplineScore,
      summary:
        'Focus on consistent execution, controlled risk, and following your funded-account rules.',
      strengths: [
        'Willingness to review trading performance',
        'Awareness of risk management',
      ],
      weaknesses: ['Consistency can be improved', 'Avoid unnecessary trades'],
      improvements: [
        'Follow the trading plan',
        'Respect daily loss limits',
        'Avoid revenge trading',
      ],
      actionPlan: [
        'Set your maximum daily risk before trading',
        'Take only planned setups',
        'Review every trade after the session',
      ],
      coachMessage:
        'Protect the account first. A disciplined trader does not need to trade every opportunity.',
      recommendations: [
        'Keep risk consistent',
        'Stop after reaching your daily loss limit',
        'Review emotional decisions before the next session',
      ],
    };
  }

  private calculateRiskReward(dto: {
    direction: 'LONG' | 'SHORT';
    entryPrice: number;
    stopLoss: number;
    takeProfit: number;
  }): number {
    const risk = Math.abs(dto.entryPrice - dto.stopLoss);
    const reward = Math.abs(dto.takeProfit - dto.entryPrice);

    if (risk === 0) {
      return 0;
    }

    return Number((reward / risk).toFixed(2));
  }

  private calculateTradeScore(
    riskRewardRatio: number,
    riskPercent: number,
  ): number {
    let score = 100;

    if (riskRewardRatio < 1) {
      score -= 35;
    } else if (riskRewardRatio < 1.5) {
      score -= 20;
    } else if (riskRewardRatio < 2) {
      score -= 10;
    }

    if (riskPercent > 2) {
      score -= 25;
    } else if (riskPercent > 1) {
      score -= 10;
    }

    return Math.max(0, Math.min(100, score));
  }

  private buildTradeRecommendations(
    riskRewardRatio: number,
    riskPercent: number,
  ): string[] {
    const recommendations: string[] = [];

    if (riskRewardRatio < 1.5) {
      recommendations.push(
        'Look for setups with a stronger risk-to-reward ratio.',
      );
    }

    if (riskPercent > 2) {
      recommendations.push('Reduce position size to lower risk.');
    }

    if (recommendations.length === 0) {
      recommendations.push('Risk parameters are within a disciplined range.');
    }

    recommendations.push('Respect your funded-account daily loss limit.');

    return recommendations;
  }
}
