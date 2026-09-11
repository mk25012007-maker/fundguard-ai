import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { AppController } from './app.controller';
import { SanitizeInputMiddleware } from './common/middleware/sanitize-input.middleware';

import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { TradingAccountsModule } from './trading-accounts/trading-accounts.module';
import { TradesModule } from './trades/trades.module';
import { AiModule } from './ai/ai.module';

import { MarketDataModule } from './integrations/market-data/market-data.module';
import { NotificationModule } from './integrations/notifications/notification.module';
import { WebhookModule } from './integrations/webhooks/webhook.module';
import { TradingModule } from './integrations/trading/trading.module';

import { IntegrationResilienceModule } from './integrations/resilience/integration-resilience.module';
import { IntegrationLoggingModule } from './integrations/logging/integration-logging.module';
import { IntegrationMonitoringModule } from './integrations/monitoring/integration-monitoring.module';
import { IntegrationConfigurationModule } from './integrations/configuration/integration-configuration.module';
import { IntegrationDashboardModule } from './integrations/dashboard/integration-dashboard.module';
import { IntegrationAnalyticsModule } from './integrations/analytics/integration-analytics.module';

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => {
        const requiredJwtVariables = [
          'JWT_ACCESS_SECRET',
          'JWT_REFRESH_SECRET',
        ];

        for (const variable of requiredJwtVariables) {
          if (!config[variable]) {
            throw new Error(
              `Missing required environment variable: ${variable}`,
            );
          }
        }

        if (config.JWT_ACCESS_SECRET === 'change-this-access-secret') {
          throw new Error(
            'JWT_ACCESS_SECRET must be changed from the default value',
          );
        }

        if (config.JWT_REFRESH_SECRET === 'change-this-refresh-secret') {
          throw new Error(
            'JWT_REFRESH_SECRET must be changed from the default value',
          );
        }

        return config;
      },
    }),

    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 20,
      },
    ]),

    PrismaModule,
    AuthModule,
    UsersModule,
    TradingAccountsModule,
    TradesModule,
    AiModule,

    MarketDataModule,
    NotificationModule,
    WebhookModule,
    TradingModule,

    IntegrationResilienceModule,
    IntegrationLoggingModule,
    IntegrationMonitoringModule,
    IntegrationConfigurationModule,
    IntegrationDashboardModule,
    IntegrationAnalyticsModule,
  ],

  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SanitizeInputMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
