import { Injectable } from '@nestjs/common';

import { MarketDataService } from '../market-data/market-data.service';
import { TradingService } from '../trading/trading.service';

@Injectable()
export class IntegrationsHealthService {
  constructor(
    private readonly marketDataService: MarketDataService,
    private readonly tradingService: TradingService,
  ) {}

  getHealth() {
    const marketData = this.marketDataService.getProviderInfo();
    const trading = this.tradingService.getProviderInfo();

    const webhookConfigured = Boolean(process.env.WEBHOOK_SECRET);

    const notificationConfigured = Boolean(
      process.env.EMAIL_HOST &&
      process.env.EMAIL_PORT &&
      process.env.EMAIL_USER &&
      process.env.EMAIL_PASSWORD &&
      process.env.EMAIL_FROM,
    );

    const integrations = {
      marketData: {
        status: marketData.configured ? 'healthy' : 'not_configured',
        ...marketData,
      },

      trading: {
        status: trading.configured ? 'healthy' : 'not_configured',
        ...trading,
      },

      webhook: {
        status: webhookConfigured ? 'healthy' : 'not_configured',
        configured: webhookConfigured,
        signatureValidation: true,
      },

      notifications: {
        status: notificationConfigured ? 'healthy' : 'not_configured',
        configured: notificationConfigured,
      },
    };

    const healthyCount = Object.values(integrations).filter(
      (integration) => integration.status === 'healthy',
    ).length;

    const totalCount = Object.keys(integrations).length;

    return {
      success: true,
      service: 'integrations',
      overallStatus:
        healthyCount === totalCount
          ? 'healthy'
          : healthyCount > 0
            ? 'partial'
            : 'not_configured',

      summary: {
        healthy: healthyCount,
        total: totalCount,
      },

      integrations,

      timestamp: new Date().toISOString(),
    };
  }

  getConfiguration() {
    const configuration = {
      api: {
        status:
          process.env.PORT && process.env.NODE_ENV
            ? 'configured'
            : 'missing_configuration',

        required: [
          {
            name: 'PORT',
            configured: Boolean(process.env.PORT),
          },
          {
            name: 'NODE_ENV',
            configured: Boolean(process.env.NODE_ENV),
          },
        ],
      },

      database: {
        status: process.env.DATABASE_URL
          ? 'configured'
          : 'missing_configuration',

        required: [
          {
            name: 'DATABASE_URL',
            configured: Boolean(process.env.DATABASE_URL),
          },
        ],
      },

      marketData: {
        status:
          process.env.MARKET_DATA_API_URL && process.env.MARKET_DATA_API_KEY
            ? 'configured'
            : 'missing_configuration',

        required: [
          {
            name: 'MARKET_DATA_API_URL',
            configured: Boolean(process.env.MARKET_DATA_API_URL),
          },
          {
            name: 'MARKET_DATA_API_KEY',
            configured: Boolean(process.env.MARKET_DATA_API_KEY),
          },
        ],
      },

      trading: {
        status:
          process.env.TRADING_PROVIDER &&
          process.env.TRADING_PROVIDER !== 'NONE'
            ? 'configured'
            : 'not_configured',

        provider: process.env.TRADING_PROVIDER ?? 'NONE',

        required: [
          {
            name: 'TRADING_PROVIDER',
            configured:
              Boolean(process.env.TRADING_PROVIDER) &&
              process.env.TRADING_PROVIDER !== 'NONE',
          },
          {
            name: 'TRADING_API_URL',
            configured: Boolean(process.env.TRADING_API_URL),
          },
          {
            name: 'TRADING_API_KEY',
            configured: Boolean(process.env.TRADING_API_KEY),
          },
        ],
      },

      webhook: {
        status: process.env.WEBHOOK_SECRET
          ? 'configured'
          : 'missing_configuration',

        required: [
          {
            name: 'WEBHOOK_SECRET',
            configured: Boolean(process.env.WEBHOOK_SECRET),
          },
        ],
      },

      notifications: {
        status:
          process.env.EMAIL_HOST &&
          process.env.EMAIL_PORT &&
          process.env.EMAIL_USER &&
          process.env.EMAIL_PASSWORD &&
          process.env.EMAIL_FROM
            ? 'configured'
            : 'not_configured',

        required: [
          {
            name: 'EMAIL_HOST',
            configured: Boolean(process.env.EMAIL_HOST),
          },
          {
            name: 'EMAIL_PORT',
            configured: Boolean(process.env.EMAIL_PORT),
          },
          {
            name: 'EMAIL_USER',
            configured: Boolean(process.env.EMAIL_USER),
          },
          {
            name: 'EMAIL_PASSWORD',
            configured: Boolean(process.env.EMAIL_PASSWORD),
          },
          {
            name: 'EMAIL_FROM',
            configured: Boolean(process.env.EMAIL_FROM),
          },
        ],
      },
    };

    const sections = Object.values(configuration);

    const configuredCount = sections.filter(
      (section) => section.status === 'configured',
    ).length;

    return {
      success: true,
      service: 'integrations',
      summary: {
        configured: configuredCount,
        total: sections.length,
      },
      configuration,
      timestamp: new Date().toISOString(),
    };
  }
}
