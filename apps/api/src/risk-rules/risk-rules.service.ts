import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';

import { NotificationType } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

import { CreateRiskRuleDto } from './dto/create-risk-rule.dto';
import { UpdateRiskRuleDto } from './dto/update-risk-rule.dto';

@Injectable()
export class RiskRulesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async findAll(userId: string) {
    return this.prisma.risk_rules.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(userId: string, id: string) {
    const rule = await this.prisma.risk_rules.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!rule) {
      throw new NotFoundException('Risk rule not found');
    }

    return rule;
  }

  async create(userId: string, dto: CreateRiskRuleDto) {
    return this.prisma.risk_rules.create({
      data: {
        id: randomUUID(),
        userId,
        tradingAccountId: dto.tradingAccountId,
        name: dto.name,
        type: dto.type,
        action: dto.action ?? 'WARN',
        thresholdValue: dto.thresholdValue,
        isActive: dto.isActive ?? true,
        updatedAt: new Date(),
      },
    });
  }

  async update(userId: string, id: string, dto: UpdateRiskRuleDto) {
    await this.findOne(userId, id);

    return this.prisma.risk_rules.update({
      where: {
        id,
      },
      data: {
        tradingAccountId: dto.tradingAccountId,
        name: dto.name,
        type: dto.type,
        action: dto.action,
        thresholdValue: dto.thresholdValue,
        isActive: dto.isActive,
        updatedAt: new Date(),
      },
    });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);

    await this.prisma.risk_rules.delete({
      where: {
        id,
      },
    });

    return {
      success: true,
      message: 'Risk rule deleted successfully',
    };
  }

  async getSummary(userId: string) {
    const rules = await this.prisma.risk_rules.findMany({
      where: {
        userId,
      },
      select: {
        action: true,
        isActive: true,
      },
    });

    const totalRules = rules.length;

    const activeRules = rules.filter((rule) => rule.isActive).length;

    const warningRules = rules.filter(
      (rule) => rule.isActive && rule.action === 'WARN',
    ).length;

    const blockingRules = rules.filter(
      (rule) => rule.isActive && rule.action === 'BLOCK',
    ).length;

    const notifyOnlyRules = rules.filter(
      (rule) => rule.isActive && rule.action === 'NOTIFY_ONLY',
    ).length;

    return {
      totalRules,
      activeRules,
      warningRules,
      blockingRules,
      notifyOnlyRules,
    };
  }

  async getDashboardSummary(userId: string) {
    const startOfDay = new Date();

    startOfDay.setHours(0, 0, 0, 0);

    const [trades, activeRules, accounts, dailyTradesRule, positionSizeRule] =
      await Promise.all([
        this.prisma.trades.findMany({
          where: {
            trading_accounts: {
              userId,
            },
            createdAt: {
              gte: startOfDay,
            },
          },
          select: {
            side: true,
            totalValue: true,
            fees: true,
          },
        }),

        this.prisma.risk_rules.count({
          where: {
            userId,
            isActive: true,
          },
        }),

        this.prisma.trading_accounts.findMany({
          where: {
            userId,
            status: 'ACTIVE',
          },
          select: {
            id: true,
            accountLabel: true,
            baseCurrency: true,
            balance: true,
          },
          orderBy: {
            connectedAt: 'desc',
          },
        }),

        this.prisma.risk_rules.findFirst({
          where: {
            userId,
            type: 'MAX_DAILY_TRADES',
            isActive: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          select: {
            thresholdValue: true,
            action: true,
            name: true,
          },
        }),

        this.prisma.risk_rules.findFirst({
          where: {
            userId,
            type: 'MAX_POSITION_SIZE',
            isActive: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          select: {
            thresholdValue: true,
            action: true,
            name: true,
          },
        }),
      ]);

    const tradesToday = trades.length;

    const buyTrades = trades.filter((trade) => trade.side === 'BUY').length;

    const sellTrades = trades.filter((trade) => trade.side === 'SELL').length;

    const dailyTradedValue = trades.reduce((total, trade) => {
      return total + Number(trade.totalValue);
    }, 0);

    const dailyFees = trades.reduce((total, trade) => {
      return total + Number(trade.fees);
    }, 0);

    const dailyBuyValue = trades
      .filter((trade) => trade.side === 'BUY')
      .reduce((total, trade) => total + Number(trade.totalValue), 0);

    const dailySellValue = trades
      .filter((trade) => trade.side === 'SELL')
      .reduce((total, trade) => total + Number(trade.totalValue), 0);

    const netTradeValue = dailyBuyValue - dailySellValue;

    const totalAccountBalance = accounts.reduce(
      (total, account) => total + Number(account.balance),
      0,
    );

    const peakAccountBalance =
      accounts.length > 0
        ? Math.max(...accounts.map((account) => Number(account.balance)))
        : 0;

    const drawdownAmount = Math.max(
      peakAccountBalance - totalAccountBalance,
      0,
    );

    const drawdownPercentage =
      peakAccountBalance > 0 ? (drawdownAmount / peakAccountBalance) * 100 : 0;

    const maximumDailyTrades = dailyTradesRule
      ? Number(dailyTradesRule.thresholdValue)
      : null;

    const remainingTrades =
      maximumDailyTrades !== null
        ? Math.max(maximumDailyTrades - tradesToday, 0)
        : null;

    const tradeLimitUtilization =
      maximumDailyTrades !== null && maximumDailyTrades > 0
        ? (tradesToday / maximumDailyTrades) * 100
        : null;

    const tradeLimitExceeded =
      maximumDailyTrades !== null ? tradesToday > maximumDailyTrades : false;

    const maximumPositionSize = positionSizeRule
      ? Number(positionSizeRule.thresholdValue)
      : null;

    const currentPositionExposure = trades.reduce(
      (total, trade) => total + Number(trade.totalValue),
      0,
    );

    const positionUtilization =
      maximumPositionSize !== null && maximumPositionSize > 0
        ? (currentPositionExposure / maximumPositionSize) * 100
        : null;

    const remainingPositionCapacity =
      maximumPositionSize !== null
        ? Math.max(maximumPositionSize - currentPositionExposure, 0)
        : null;

    const positionLimitExceeded =
      maximumPositionSize !== null
        ? currentPositionExposure > maximumPositionSize
        : false;

    /*
     * =========================================================
     * STEP 4.8 — RULE VIOLATIONS
     * =========================================================
     */

    type RuleViolation = {
      type: string;
      severity: 'WARNING' | 'CRITICAL';
      ruleName: string;
      action: string;
      message: string;
      currentValue: number;
      thresholdValue: number;
      utilizationPercentage: number | null;
    };

    const ruleViolations: RuleViolation[] = [];

    /*
     * MAX_DAILY_TRADES
     */
    if (dailyTradesRule && maximumDailyTrades !== null) {
      if (tradeLimitExceeded) {
        ruleViolations.push({
          type: 'MAX_DAILY_TRADES',
          severity: dailyTradesRule.action === 'BLOCK' ? 'CRITICAL' : 'WARNING',
          ruleName: dailyTradesRule.name,
          action: dailyTradesRule.action,
          message: 'Daily trade limit has been exceeded.',
          currentValue: tradesToday,
          thresholdValue: maximumDailyTrades,
          utilizationPercentage: tradeLimitUtilization,
        });
      } else if (
        tradeLimitUtilization !== null &&
        tradeLimitUtilization >= 90
      ) {
        ruleViolations.push({
          type: 'MAX_DAILY_TRADES',
          severity: 'WARNING',
          ruleName: dailyTradesRule.name,
          action: dailyTradesRule.action,
          message: 'Daily trade limit is almost reached.',
          currentValue: tradesToday,
          thresholdValue: maximumDailyTrades,
          utilizationPercentage: tradeLimitUtilization,
        });
      }
    }

    /*
     * MAX_POSITION_SIZE
     */
    if (positionSizeRule && maximumPositionSize !== null) {
      if (positionLimitExceeded) {
        ruleViolations.push({
          type: 'MAX_POSITION_SIZE',
          severity:
            positionSizeRule.action === 'BLOCK' ? 'CRITICAL' : 'WARNING',
          ruleName: positionSizeRule.name,
          action: positionSizeRule.action,
          message: 'Maximum position size has been exceeded.',
          currentValue: currentPositionExposure,
          thresholdValue: maximumPositionSize,
          utilizationPercentage: positionUtilization,
        });
      } else if (positionUtilization !== null && positionUtilization >= 90) {
        ruleViolations.push({
          type: 'MAX_POSITION_SIZE',
          severity: 'WARNING',
          ruleName: positionSizeRule.name,
          action: positionSizeRule.action,
          message: 'Position exposure is almost at the configured limit.',
          currentValue: currentPositionExposure,
          thresholdValue: maximumPositionSize,
          utilizationPercentage: positionUtilization,
        });
      }
    }

    /*
     * Rule violation summary
     */
    const violationCount = ruleViolations.length;

    const criticalViolationCount = ruleViolations.filter(
      (violation) => violation.severity === 'CRITICAL',
    ).length;

    const warningViolationCount = ruleViolations.filter(
      (violation) => violation.severity === 'WARNING',
    ).length;

    const hasViolations = violationCount > 0;

    const hasCriticalViolations = criticalViolationCount > 0;

    /*
     * =========================================================
     * RISK ALERT NOTIFICATIONS
     * =========================================================
     */

    if (hasViolations) {
      for (const violation of ruleViolations) {
        const notificationTitle = `Risk Alert: ${violation.ruleName}`;

        const recentNotification = await this.prisma.notifications.findFirst({
          where: {
            userId,
            type: NotificationType.RISK_ALERT,
            title: notificationTitle,
            createdAt: {
              gte: new Date(Date.now() - 15 * 60 * 1000),
            },
          },
        });

        if (!recentNotification) {
          await this.notificationsService.createNotification({
            userId,
            type: NotificationType.RISK_ALERT,
            title: notificationTitle,
            body: violation.message,
          });
        }
      }
    }

    /*
     * =========================================================
     * RISK SCORE
     * =========================================================
     */

    let riskScore = 100;

    const riskScoreReasons: string[] = [];

    /*
     * 1. No active rules
     */
    if (activeRules === 0) {
      riskScore -= 40;

      riskScoreReasons.push('No active risk protection rules are configured.');
    } else {
      riskScoreReasons.push(
        `${activeRules} active risk protection rule${
          activeRules === 1 ? '' : 's'
        } configured.`,
      );
    }

    /*
     * 2. Daily trade utilization
     */
    if (tradeLimitUtilization !== null) {
      if (tradeLimitExceeded) {
        riskScore -= 30;

        riskScoreReasons.push('Daily trade limit has been exceeded.');
      } else if (tradeLimitUtilization >= 90) {
        riskScore -= 20;

        riskScoreReasons.push('Daily trade limit utilization is above 90%.');
      } else if (tradeLimitUtilization >= 75) {
        riskScore -= 10;

        riskScoreReasons.push('Daily trade limit utilization is above 75%.');
      } else if (tradeLimitUtilization >= 50) {
        riskScore -= 5;

        riskScoreReasons.push('Daily trade limit utilization is above 50%.');
      } else {
        riskScoreReasons.push(
          'Daily trade limit utilization is within a safe range.',
        );
      }
    }

    /*
     * 3. Position utilization
     */
    if (positionUtilization !== null) {
      if (positionLimitExceeded) {
        riskScore -= 30;

        riskScoreReasons.push('Position size limit has been exceeded.');
      } else if (positionUtilization >= 90) {
        riskScore -= 20;

        riskScoreReasons.push(
          'Position exposure is above 90% of the configured limit.',
        );
      } else if (positionUtilization >= 75) {
        riskScore -= 10;

        riskScoreReasons.push(
          'Position exposure is above 75% of the configured limit.',
        );
      } else if (positionUtilization >= 50) {
        riskScore -= 5;

        riskScoreReasons.push(
          'Position exposure is above 50% of the configured limit.',
        );
      } else {
        riskScoreReasons.push('Position exposure is within a safe range.');
      }
    }

    /*
     * 4. Drawdown
     */
    if (drawdownPercentage > 0) {
      if (drawdownPercentage >= 10) {
        riskScore -= 20;

        riskScoreReasons.push('Current account drawdown is significant.');
      } else if (drawdownPercentage >= 5) {
        riskScore -= 10;

        riskScoreReasons.push('Current account drawdown requires attention.');
      }
    } else {
      riskScoreReasons.push('No current account drawdown detected.');
    }

    /*
     * 5. Clamp score
     */
    riskScore = Math.max(0, Math.min(100, riskScore));

    /*
     * 6. Risk level
     */
    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

    if (riskScore >= 90) {
      riskLevel = 'LOW';
    } else if (riskScore >= 70) {
      riskLevel = 'MEDIUM';
    } else if (riskScore >= 40) {
      riskLevel = 'HIGH';
    } else {
      riskLevel = 'CRITICAL';
    }

    /*
     * Protection status
     */
    const riskStatus = activeRules > 0 ? 'PROTECTED' : 'NO_RULES';

    return {
      /*
       * Daily trading metrics
       */
      tradesToday,
      buyTrades,
      sellTrades,

      dailyTradedValue,
      dailyFees,
      dailyBuyValue,
      dailySellValue,
      netTradeValue,

      /*
       * Risk protection
       */
      activeRules,
      riskStatus,

      /*
       * Risk score
       */
      riskScore,
      riskLevel,
      riskScoreReasons,

      /*
       * Rule violations
       */
      hasViolations,
      hasCriticalViolations,
      violationCount,
      criticalViolationCount,
      warningViolationCount,
      ruleViolations,

      /*
       * Account metrics
       */
      totalAccountBalance,
      peakAccountBalance,
      drawdownAmount,
      drawdownPercentage,

      /*
       * Historical drawdown
       */
      drawdownAvailable: false,
      drawdownMessage:
        'Historical maximum drawdown is unavailable because equity history is not stored yet.',

      /*
       * Daily trade limit
       */
      maximumDailyTrades,
      remainingTrades,
      tradeLimitUtilization,
      tradeLimitExceeded,

      tradeLimitRule: dailyTradesRule
        ? {
            name: dailyTradesRule.name,
            action: dailyTradesRule.action,
          }
        : null,

      /*
       * Position risk
       */
      maximumPositionSize,
      currentPositionExposure,
      positionUtilization,
      remainingPositionCapacity,
      positionLimitExceeded,

      positionLimitRule: positionSizeRule
        ? {
            name: positionSizeRule.name,
            action: positionSizeRule.action,
          }
        : null,

      /*
       * P&L
       */
      pnlAvailable: false,
      pnlMessage:
        'Realized P&L is unavailable until trade exit/P&L data is stored.',
    };
  }
}
