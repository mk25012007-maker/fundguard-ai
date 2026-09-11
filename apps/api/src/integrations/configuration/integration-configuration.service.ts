import { Injectable } from '@nestjs/common';

export interface IntegrationConfigurationStatus {
  integration: string;
  configured: boolean;
  status: 'healthy' | 'warning';
  checks: {
    apiUrlConfigured: boolean;
    apiKeyConfigured: boolean;
  };
  missing: string[];
}

@Injectable()
export class IntegrationConfigurationService {
  getMarketDataConfiguration(): IntegrationConfigurationStatus {
    const apiUrl = process.env.MARKET_DATA_API_URL || '';

    const apiKey = process.env.MARKET_DATA_API_KEY || '';

    const apiUrlConfigured = apiUrl.trim().length > 0;

    const apiKeyConfigured = apiKey.trim().length > 0;

    const missing: string[] = [];

    if (!apiUrlConfigured) {
      missing.push('MARKET_DATA_API_URL');
    }

    if (!apiKeyConfigured) {
      missing.push('MARKET_DATA_API_KEY');
    }

    return {
      integration: 'market-data',
      configured: apiUrlConfigured && apiKeyConfigured,
      status: apiUrlConfigured && apiKeyConfigured ? 'healthy' : 'warning',
      checks: {
        apiUrlConfigured,
        apiKeyConfigured,
      },
      missing,
    };
  }

  getConfigurationHealth() {
    const marketData = this.getMarketDataConfiguration();

    const integrations = [marketData];

    const configuredCount = integrations.filter(
      (integration) => integration.configured,
    ).length;

    const warningCount = integrations.filter(
      (integration) => integration.status === 'warning',
    ).length;

    return {
      success: true,
      service: 'integration-configuration',
      overallStatus: warningCount > 0 ? 'warning' : 'healthy',
      summary: {
        totalIntegrations: integrations.length,
        configured: configuredCount,
        warnings: warningCount,
      },
      integrations,
      timestamp: new Date().toISOString(),
    };
  }
}
