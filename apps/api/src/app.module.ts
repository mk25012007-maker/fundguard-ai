import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TradingAccountsModule } from './trading-accounts/trading-accounts.module';
import { TradesModule } from './trades/trades.module';
import { RiskRulesModule } from './risk-rules/risk-rules.module';
import { AiModule } from './ai/ai.module';
import { AiAnalysisModule } from './ai-analysis/ai-analysis.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),

    PrismaModule,
    AuthModule,
    UsersModule,
    TradingAccountsModule,
    TradesModule,
    RiskRulesModule,
    AiModule,
    AiAnalysisModule,
    AnalyticsModule,
    NotificationsModule,
  ],

  controllers: [AppController],

  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
