import { Injectable, InternalServerErrorException } from '@nestjs/common';
import OpenAI from 'openai';

import { AnalyzeTradeDto } from './dto/analyze-trade.dto';
import { TradeAnalysisResponseDto } from './dto/trade-analysis-response.dto';
import { AnalyzeRiskDto } from './dto/analyze-risk.dto';
import { RiskAnalysisResponseDto } from './dto/risk-analysis-response.dto';
import { CoachingDto } from './dto/coaching.dto';
import { CoachingResponseDto } from './dto/coaching-response.dto';

@Injectable()
export class AiService {
  private readonly openai: OpenAI | null;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY?.trim();

    if (!apiKey) {
      console.warn(
        'OPENAI_API_KEY is not configured. AI features will use fallback responses.',
      );

      this.openai = null;
      return;
    }

    this.openai = new OpenAI({
      apiKey,
    });
  }

  // ============================================================
  // 7.1 - GENERAL AI ASSISTANT
  // ============================================================

  async askAI(message: string): Promise<string> {
    if (!this.openai) {
      return (
        'FundGuard AI is running in fallback mode because ' +
        'OPENAI_API_KEY is not configured. ' +
        'For risk management, focus on position sizing, stop-losses, ' +
        'daily loss limits, drawdown and disciplined execution.'
      );
    }

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'You are FundGuard AI, an AI trading risk assistant. ' +
              'Help traders understand trading risk, drawdown, daily loss limits, ' +
              'position sizing, risk-reward ratios, and disciplined trading decisions. ' +
              'Do not guarantee profits. Do not encourage irresponsible financial behavior. ' +
              'Focus on risk management and disciplined decision-making.',
          },
          {
            role: 'user',
            content: message,
          },
        ],
        temperature: 0.3,
      });

      return (
        completion.choices[0]?.message?.content?.trim() ??
        'I could not generate an AI response.'
      );
    } catch (error) {
      console.error('OpenAI request failed:', error);

      throw new InternalServerErrorException(
        'AI service is temporarily unavailable.',
      );
    }
  }

  // ============================================================
  // 7.14 - TRADE ANALYSIS
  // ============================================================

  async analyzeTrade(
    trade: AnalyzeTradeDto,
  ): Promise<TradeAnalysisResponseDto> {
    const entry = Number(trade.entryPrice);
    const stopLoss = Number(trade.stopLoss);
    const takeProfit = Number(trade.takeProfit);
    const positionSize = Number(trade.positionSize);
    const riskPercent = Number(trade.riskPercent);

    let riskPerUnit: number;
    let rewardPerUnit: number;

    if (trade.direction === 'LONG') {
      riskPerUnit = entry - stopLoss;
      rewardPerUnit = takeProfit - entry;
    } else {
      riskPerUnit = stopLoss - entry;
      rewardPerUnit = entry - takeProfit;
    }

    const calculatedRR = riskPerUnit > 0 ? rewardPerUnit / riskPerUnit : 0;

    const riskRewardRatio =
      trade.riskRewardRatio !== undefined
        ? Number(trade.riskRewardRatio)
        : Number(calculatedRR.toFixed(2));

    let score = 50;

    if (riskRewardRatio >= 3) {
      score += 30;
    } else if (riskRewardRatio >= 2) {
      score += 20;
    } else if (riskRewardRatio >= 1.5) {
      score += 10;
    } else if (riskRewardRatio < 1) {
      score -= 25;
    }

    if (riskPercent <= 0.5) {
      score += 20;
    } else if (riskPercent <= 1) {
      score += 10;
    } else if (riskPercent > 2) {
      score -= 25;
    }

    if (riskPerUnit <= 0 || rewardPerUnit <= 0) {
      score -= 30;
    }

    score = Math.max(0, Math.min(100, score));

    let assessment: 'LOW_RISK' | 'MODERATE_RISK' | 'HIGH_RISK';

    if (score >= 75) {
      assessment = 'LOW_RISK';
    } else if (score >= 50) {
      assessment = 'MODERATE_RISK';
    } else {
      assessment = 'HIGH_RISK';
    }

    let analysis = 'Trade analysis completed.';

    const recommendations: string[] = [];

    if (riskPercent > 1) {
      recommendations.push('Consider reducing risk per trade.');
    }

    if (riskRewardRatio < 2) {
      recommendations.push('Consider waiting for a better risk-reward setup.');
    }

    if (riskRewardRatio >= 3) {
      recommendations.push('The calculated risk-reward ratio is strong.');
    }

    if (riskPerUnit <= 0) {
      recommendations.push(
        'Check the stop-loss placement relative to the entry.',
      );
    }

    if (recommendations.length === 0) {
      recommendations.push(
        'Maintain disciplined position sizing and follow your trading plan.',
      );
    }

    if (this.openai) {
      try {
        const completion = await this.openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content:
                'You are FundGuard AI. Analyze trading setups from a risk-management perspective. ' +
                'Do not guarantee profits. Keep the analysis concise and disciplined.',
            },
            {
              role: 'user',
              content: `
Analyze this trade:

Asset: ${trade.asset}
Direction: ${trade.direction}
Entry: ${entry}
Stop Loss: ${stopLoss}
Take Profit: ${takeProfit}
Position Size: ${positionSize}
Risk Percent: ${riskPercent}%
Risk Reward Ratio: ${riskRewardRatio}

Give a concise professional risk assessment.
                `,
            },
          ],
          temperature: 0.2,
        });

        analysis = completion.choices[0]?.message?.content?.trim() ?? analysis;
      } catch (error) {
        console.error('OpenAI trade analysis failed:', error);
      }
    }

    return {
      success: true,
      assessment,
      score,
      riskRewardRatio,
      riskPercent,
      analysis,
      recommendations,
    };
  }

  // ============================================================
  // 7.15 - RISK ANALYSIS
  // ============================================================

  async analyzeRisk(dto: AnalyzeRiskDto): Promise<RiskAnalysisResponseDto> {
    const accountBalance = Number(dto.accountBalance ?? 0);

    const dailyLossLimit = Number(dto.dailyLossLimit ?? 0);

    const currentDailyLoss = Number(dto.currentDailyLoss ?? 0);

    const maxDrawdown = Number(dto.maxDrawdown ?? 0);

    const currentDrawdown = Number(dto.currentDrawdown ?? 0);

    const tradesToday = Number(dto.tradesToday ?? 0);

    let dailyLossUsagePercent = 0;

    if (dailyLossLimit > 0) {
      dailyLossUsagePercent = (currentDailyLoss / dailyLossLimit) * 100;
    }

    let drawdownUsagePercent = 0;

    if (maxDrawdown > 0) {
      drawdownUsagePercent = (currentDrawdown / maxDrawdown) * 100;
    }

    let score = 100;

    if (dailyLossUsagePercent >= 90) {
      score -= 40;
    } else if (dailyLossUsagePercent >= 75) {
      score -= 25;
    } else if (dailyLossUsagePercent >= 50) {
      score -= 10;
    }

    if (drawdownUsagePercent >= 90) {
      score -= 40;
    } else if (drawdownUsagePercent >= 75) {
      score -= 25;
    } else if (drawdownUsagePercent >= 50) {
      score -= 10;
    }

    if (tradesToday >= 5) {
      score -= 25;
    } else if (tradesToday >= 3) {
      score -= 10;
    }

    if (dto.riskPercent > 1) {
      score -= 15;
    }

    score = Math.max(0, Math.min(100, score));

    let riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' = 'LOW';

    if (dailyLossUsagePercent >= 90 || drawdownUsagePercent >= 90) {
      riskLevel = 'CRITICAL';
    } else if (
      dailyLossUsagePercent >= 75 ||
      drawdownUsagePercent >= 75 ||
      dto.riskPercent > 2
    ) {
      riskLevel = 'HIGH';
    } else if (
      dailyLossUsagePercent >= 50 ||
      drawdownUsagePercent >= 50 ||
      tradesToday >= 3 ||
      dto.riskPercent > 1
    ) {
      riskLevel = 'MODERATE';
    }

    const riskRewardRatio =
      dto.riskRewardRatio !== undefined
        ? Number(dto.riskRewardRatio)
        : this.calculateRiskReward(
            dto.entryPrice,
            dto.stopLoss,
            dto.takeProfit,
            dto.direction,
          );

    const analysisParts: string[] = [];

    analysisParts.push(`Current risk level: ${riskLevel}.`);

    if (accountBalance > 0) {
      analysisParts.push(`Account balance: ${accountBalance}.`);
    }

    if (dailyLossLimit > 0) {
      analysisParts.push(
        `Daily loss usage is ${dailyLossUsagePercent.toFixed(1)}%.`,
      );
    }

    if (maxDrawdown > 0) {
      analysisParts.push(
        `Drawdown usage is ${drawdownUsagePercent.toFixed(1)}%.`,
      );
    }

    analysisParts.push(`Trades taken today: ${tradesToday}.`);

    const recommendations: string[] = [];

    if (dailyLossUsagePercent >= 75) {
      recommendations.push(
        'Avoid increasing risk while approaching the daily loss limit.',
      );
    }

    if (drawdownUsagePercent >= 75) {
      recommendations.push(
        'Reduce exposure and protect remaining account drawdown.',
      );
    }

    if (tradesToday >= 5) {
      recommendations.push(
        'Consider stopping for the day and reviewing your trading decisions.',
      );
    }

    if (dto.riskPercent > 1) {
      recommendations.push('Consider reducing risk per trade.');
    }

    if (riskRewardRatio < 2) {
      recommendations.push(
        'Consider waiting for a stronger risk-reward setup.',
      );
    }

    if (recommendations.length === 0) {
      recommendations.push(
        'Risk metrics are currently within a more controlled range. Continue following your trading plan.',
      );
    }

    const finalRiskLevel =
      riskLevel === 'LOW'
        ? 'LOW_RISK'
        : riskLevel === 'MODERATE'
          ? 'MODERATE_RISK'
          : 'HIGH_RISK';

    return {
      success: true,
      riskLevel: finalRiskLevel,
      score,
      riskRewardRatio,
      riskPercent: Number(dto.riskPercent),
      dailyLossUsagePercent: Number(dailyLossUsagePercent.toFixed(2)),
      drawdownUsagePercent: Number(drawdownUsagePercent.toFixed(2)),
      warnings: [],
      summary: analysisParts.join(' '),
      analysis: analysisParts.join(' '),
      recommendations,
    };
  }

  // ============================================================
  // 7.16 - AI COACHING
  // ============================================================

  async generateCoaching(dto: CoachingDto): Promise<CoachingResponseDto> {
    const experience = dto.experience ?? 'Not specified';

    const recentPerformance = dto.recentPerformance ?? 'Not specified';

    const mainChallenge = dto.mainChallenge ?? 'Not specified';

    const goal = dto.goal ?? 'Improve trading discipline';

    const tradesToday = dto.tradesToday ?? 0;

    let disciplineScore = 70;

    if (tradesToday >= 5) {
      disciplineScore -= 20;
    } else if (tradesToday >= 3) {
      disciplineScore -= 10;
    }

    if (
      dto.currentDailyLoss !== undefined &&
      dto.dailyLossLimit !== undefined &&
      dto.dailyLossLimit > 0
    ) {
      const usage = (dto.currentDailyLoss / dto.dailyLossLimit) * 100;

      if (usage >= 90) {
        disciplineScore -= 20;
      } else if (usage >= 75) {
        disciplineScore -= 10;
      }
    }

    disciplineScore = Math.max(0, Math.min(100, disciplineScore));

    let coachingLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' =
      'INTERMEDIATE';

    if (experience.toLowerCase().includes('begin')) {
      coachingLevel = 'BEGINNER';
    } else if (experience.toLowerCase().includes('advanced')) {
      coachingLevel = 'ADVANCED';
    }

    const strengths = [
      'You are actively reviewing your trading process.',
      'You are focusing on risk management.',
    ];

    const weaknesses: string[] = [];

    if (tradesToday >= 5) {
      weaknesses.push('Potential overtrading.');
    }

    if (dto.riskPercent !== undefined && dto.riskPercent > 1) {
      weaknesses.push('Risk per trade may be higher than necessary.');
    }

    if (weaknesses.length === 0) {
      weaknesses.push(
        'Continue monitoring consistency and emotional discipline.',
      );
    }

    const recommendations = [
      'Follow a predefined trading plan.',
      'Respect your stop-loss on every trade.',
      'Avoid revenge trading after a loss.',
      'Review your journal before taking another trade.',
    ];

    const actionPlan = [
      "Review today's trading journal.",
      'Identify one repeated mistake.',
      'Define one rule to prevent that mistake tomorrow.',
      'Keep risk consistent.',
    ];

    let coaching = 'Stay focused on process, risk management, and consistency.';

    if (this.openai) {
      try {
        const completion = await this.openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content:
                'You are FundGuard AI, a professional trading discipline coach. ' +
                'Help traders improve risk management, discipline, emotional control, ' +
                'and consistency. Never guarantee profits.',
            },
            {
              role: 'user',
              content: `
Trader experience: ${experience}

Recent performance:
${recentPerformance}

Main challenge:
${mainChallenge}

Goal:
${goal}

Trades today:
${tradesToday}

Risk percent:
${dto.riskPercent ?? 'Not specified'}%

Provide concise coaching focused on discipline and risk management.
                `,
            },
          ],
          temperature: 0.3,
        });

        coaching = completion.choices[0]?.message?.content?.trim() ?? coaching;
      } catch (error) {
        console.error('OpenAI coaching request failed:', error);
      }
    }

    return {
      coachingLevel,
      disciplineScore,
      summary: `Trading coaching generated for the goal: ${goal}.`,
      strengths,
      weaknesses,
      recommendations,
      coachMessage: coaching,
      improvements: weaknesses,
      actionPlan,
    };
  }

  // ============================================================
  // HELPER
  // ============================================================

  private calculateRiskReward(
    entryPrice: number,
    stopLoss: number,
    takeProfit: number,
    direction: 'LONG' | 'SHORT',
  ): number {
    const entry = Number(entryPrice);
    const stop = Number(stopLoss);
    const target = Number(takeProfit);

    let risk = 0;
    let reward = 0;

    if (direction === 'LONG') {
      risk = entry - stop;
      reward = target - entry;
    } else {
      risk = stop - entry;
      reward = entry - target;
    }

    if (risk <= 0) {
      return 0;
    }

    return Number((reward / risk).toFixed(2));
  }
}
