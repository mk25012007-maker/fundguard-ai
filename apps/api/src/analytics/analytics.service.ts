import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardAnalytics(userId: string) {
    const now = new Date();

    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const startOfSevenDays = new Date(startOfToday);
    startOfSevenDays.setDate(startOfSevenDays.getDate() - 6);

    const [trades, accounts] = await Promise.all([
      this.prisma.trades.findMany({
        where: {
          trading_accounts: {
            userId,
          },
        },
        select: {
          id: true,
          symbol: true,
          assetClass: true,
          side: true,
          status: true,
          quantity: true,
          totalValue: true,
          fees: true,
          createdAt: true,
          executedAt: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      }),

      this.prisma.trading_accounts.findMany({
        where: {
          userId,
        },
        select: {
          id: true,
          accountLabel: true,
          broker: true,
          status: true,
          baseCurrency: true,
          balance: true,
        },
      }),
    ]);

    const number = (value: unknown) => Number(value ?? 0);

    const totalTrades = trades.length;

    const filledTrades = trades.filter(
      (trade) => trade.status === 'FILLED',
    ).length;

    const partiallyFilledTrades = trades.filter(
      (trade) => trade.status === 'PARTIALLY_FILLED',
    ).length;

    const pendingTrades = trades.filter(
      (trade) => trade.status === 'PENDING',
    ).length;

    const cancelledTrades = trades.filter(
      (trade) => trade.status === 'CANCELLED',
    ).length;

    const rejectedTrades = trades.filter(
      (trade) => trade.status === 'REJECTED',
    ).length;

    const buyTrades = trades.filter((trade) => trade.side === 'BUY');

    const sellTrades = trades.filter((trade) => trade.side === 'SELL');

    const totalVolume = trades.reduce(
      (sum, trade) => sum + number(trade.totalValue),
      0,
    );

    const totalFees = trades.reduce(
      (sum, trade) => sum + number(trade.fees),
      0,
    );

    const buyVolume = buyTrades.reduce(
      (sum, trade) => sum + number(trade.totalValue),
      0,
    );

    const sellVolume = sellTrades.reduce(
      (sum, trade) => sum + number(trade.totalValue),
      0,
    );

    const todayTrades = trades.filter(
      (trade) => trade.createdAt >= startOfToday,
    );

    const todayVolume = todayTrades.reduce(
      (sum, trade) => sum + number(trade.totalValue),
      0,
    );

    const todayFees = todayTrades.reduce(
      (sum, trade) => sum + number(trade.fees),
      0,
    );

    const symbolMap = new Map<
      string,
      {
        symbol: string;
        trades: number;
        volume: number;
      }
    >();

    for (const trade of trades) {
      const existing = symbolMap.get(trade.symbol);

      if (existing) {
        existing.trades += 1;
        existing.volume += number(trade.totalValue);
      } else {
        symbolMap.set(trade.symbol, {
          symbol: trade.symbol,
          trades: 1,
          volume: number(trade.totalValue),
        });
      }
    }

    const topSymbols = Array.from(symbolMap.values())
      .sort((a, b) => b.volume - a.volume)
      .slice(0, 10);

    const assetClassMap = new Map<
      string,
      {
        assetClass: string;
        trades: number;
        volume: number;
      }
    >();

    for (const trade of trades) {
      const existing = assetClassMap.get(trade.assetClass);

      if (existing) {
        existing.trades += 1;
        existing.volume += number(trade.totalValue);
      } else {
        assetClassMap.set(trade.assetClass, {
          assetClass: trade.assetClass,
          trades: 1,
          volume: number(trade.totalValue),
        });
      }
    }

    const assetClassBreakdown = Array.from(assetClassMap.values()).sort(
      (a, b) => b.volume - a.volume,
    );

    const dailyActivity: Array<{
      date: string;
      trades: number;
      volume: number;
      fees: number;
    }> = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfSevenDays);

      date.setDate(startOfSevenDays.getDate() + i);

      const nextDate = new Date(date);
      nextDate.setDate(date.getDate() + 1);

      const dayTrades = trades.filter(
        (trade) => trade.createdAt >= date && trade.createdAt < nextDate,
      );

      dailyActivity.push({
        date: date.toISOString().slice(0, 10),

        trades: dayTrades.length,

        volume: dayTrades.reduce(
          (sum, trade) => sum + number(trade.totalValue),
          0,
        ),

        fees: dayTrades.reduce((sum, trade) => sum + number(trade.fees), 0),
      });
    }

    const totalBalance = accounts.reduce(
      (sum, account) => sum + number(account.balance),
      0,
    );

    const activeAccounts = accounts.filter(
      (account) => account.status === 'ACTIVE',
    ).length;

    return {
      generatedAt: now.toISOString(),

      summary: {
        totalTrades,
        filledTrades,
        partiallyFilledTrades,
        pendingTrades,
        cancelledTrades,
        rejectedTrades,
        totalVolume,
        totalFees,
        totalBalance,
        totalAccounts: accounts.length,
        activeAccounts,
      },

      today: {
        trades: todayTrades.length,
        volume: todayVolume,
        fees: todayFees,
        buyTrades: todayTrades.filter((trade) => trade.side === 'BUY').length,
        sellTrades: todayTrades.filter((trade) => trade.side === 'SELL').length,
      },

      sideBreakdown: {
        buyTrades: buyTrades.length,
        sellTrades: sellTrades.length,
        buyVolume,
        sellVolume,
      },

      topSymbols,

      assetClassBreakdown,

      dailyActivity,

      accounts: accounts.map((account) => ({
        id: account.id,
        accountLabel: account.accountLabel,
        broker: account.broker,
        status: account.status,
        baseCurrency: account.baseCurrency,
        balance: number(account.balance),
      })),

      dataLimitations: [
        'Realized P&L is unavailable because the current trade schema does not store exit price or realized P&L.',
        'Win rate is unavailable because completed trade outcomes are not stored.',
        'Historical equity drawdown cannot be calculated from trade outcomes with the current schema.',
      ],
    };
  }
}
