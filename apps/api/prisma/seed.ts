import 'dotenv/config';

import {
  PrismaClient,
  UserRole,
  BrokerType,
  TradeSide,
  TradeStatus,
  AssetClass,
  RiskRuleType,
  RiskRuleAction,
  InsightType,
  InsightSeverity,
  NotificationType,
  PlanTier,
} from '@prisma/client';

import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  const passwordHash = await bcrypt.hash('password123', 12);

  // -----------------------------
  // ADMIN USER
  // -----------------------------
  const admin = await prisma.users.upsert({
    where: {
      email: 'admin@fundguard.ai',
    },
    update: {},
    create: {
      id: randomBytes(16).toString('hex'),
      email: 'admin@fundguard.ai',
      passwordHash,
      firstName: 'Ava',
      lastName: 'Reyes',
      role: UserRole.ADMIN,
      emailVerified: true,
      updatedAt: new Date(),
    },
  });

  // -----------------------------
  // TRADER USER
  // -----------------------------
  const trader = await prisma.users.upsert({
    where: {
      email: 'trader@fundguard.ai',
    },
    update: {},
    create: {
      id: randomBytes(16).toString('hex'),
      email: 'trader@fundguard.ai',
      passwordHash,
      firstName: 'Miles',
      lastName: 'Chen',
      role: UserRole.TRADER,
      isActive: true,
      emailVerified: true,
      lastLoginAt: new Date(),
      updatedAt: new Date(),
    },
  });

  // -----------------------------
  // TRADING ACCOUNT
  // -----------------------------
  const account = await prisma.trading_accounts.upsert({
    where: {
      userId_broker_externalId: {
        userId: trader.id,
        broker: BrokerType.ALPACA,
        externalId: 'alpaca-acct-001',
      },
    },
    update: {},
    create: {
      id: randomBytes(16).toString('hex'),
      userId: trader.id,
      broker: BrokerType.ALPACA,
      accountLabel: 'Alpaca Paper Trading',
      externalId: 'alpaca-acct-001',
      balance: 25000,
      updatedAt: new Date(),
    },
  });

  // -----------------------------
  // TRADES
  // -----------------------------
  const existingTrades = await prisma.trades.count({
    where: {
      tradingAccountId: account.id,
    },
  });

  if (existingTrades === 0) {
    await prisma.trades.createMany({
      data: [
        {
          id: randomBytes(16).toString('hex'),
          tradingAccountId: account.id,
          symbol: 'AAPL',
          assetClass: AssetClass.EQUITY,
          side: TradeSide.BUY,
          status: TradeStatus.FILLED,
          quantity: 10,
          price: 225.5,
          totalValue: 2255,
          fees: 1.5,
          executedAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: randomBytes(16).toString('hex'),
          tradingAccountId: account.id,
          symbol: 'BTC',
          assetClass: AssetClass.CRYPTO,
          side: TradeSide.BUY,
          status: TradeStatus.FILLED,
          quantity: 0.05,
          price: 62000,
          totalValue: 3100,
          fees: 3.1,
          executedAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    });
  }

  // -----------------------------
  // RISK RULE
  // -----------------------------
  const existingRiskRule = await prisma.risk_rules.findFirst({
    where: {
      userId: trader.id,
      name: 'Max 10% position size',
    },
  });

  if (!existingRiskRule) {
    await prisma.risk_rules.create({
      data: {
        id: randomBytes(16).toString('hex'),
        userId: trader.id,
        tradingAccountId: account.id,
        name: 'Max 10% position size',
        type: RiskRuleType.MAX_POSITION_SIZE,
        action: RiskRuleAction.WARN,
        thresholdValue: 10,
        updatedAt: new Date(),
      },
    });
  }

  // -----------------------------
  // AI INSIGHT
  // -----------------------------
  let insight = await prisma.ai_insights.findFirst({
    where: {
      userId: trader.id,
      title: 'Elevated crypto concentration',
    },
  });

  if (!insight) {
    insight = await prisma.ai_insights.create({
      data: {
        id: randomBytes(16).toString('hex'),
        userId: trader.id,
        tradingAccountId: account.id,
        type: InsightType.PORTFOLIO_SUGGESTION,
        severity: InsightSeverity.MEDIUM,
        title: 'Elevated crypto concentration',
        summary: "BTC now makes up over 12% of this account's total value.",
        modelVersion: 'fundguard-risk-v1.0',
      },
    });
  }

  // -----------------------------
  // NOTIFICATION
  // -----------------------------
  const existingNotification = await prisma.notifications.findFirst({
    where: {
      userId: trader.id,
      linkedInsightId: insight.id,
    },
  });

  if (!existingNotification) {
    await prisma.notifications.create({
      data: {
        id: randomBytes(16).toString('hex'),
        userId: trader.id,
        type: NotificationType.AI_INSIGHT,
        title: 'New portfolio insight',
        body: insight.summary,
        linkedInsightId: insight.id,
      },
    });
  }

  // -----------------------------
  // ADMIN SUBSCRIPTION
  // -----------------------------
  await prisma.subscriptions.upsert({
    where: {
      userId: admin.id,
    },
    update: {
      tier: PlanTier.ENTERPRISE,
      updatedAt: new Date(),
    },
    create: {
      id: randomBytes(16).toString('hex'),
      userId: admin.id,
      tier: PlanTier.ENTERPRISE,
      updatedAt: new Date(),
    },
  });

  // -----------------------------
  // TRADER SUBSCRIPTION
  // -----------------------------
  await prisma.subscriptions.upsert({
    where: {
      userId: trader.id,
    },
    update: {
      tier: PlanTier.PRO,
      updatedAt: new Date(),
    },
    create: {
      id: randomBytes(16).toString('hex'),
      userId: trader.id,
      tier: PlanTier.PRO,
      updatedAt: new Date(),
    },
  });

  console.log('Seed complete.');
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
