import { Injectable } from '@nestjs/common';

import { IntegrationConfigurationService } from '../configuration/integration-configuration.service';
import { IntegrationMonitoringService } from '../monitoring/integration-monitoring.service';
import { IntegrationResilienceService } from '../resilience/integration-resilience.service';
import { MarketDataService } from '../market-data/market-data.service';

@Injectable()
export class IntegrationDashboardService {
  constructor(
    private readonly configurationService: IntegrationConfigurationService,
    private readonly monitoringService: IntegrationMonitoringService,
    private readonly resilienceService: IntegrationResilienceService,
    private readonly marketDataService: MarketDataService,
  ) {}

  async getDashboard() {
    const configuration = this.configurationService.getConfigurationHealth();

    const monitoring = await this.monitoringService.getMonitoring();

    const resilience = this.resilienceService.getHealth();

    const marketData = this.marketDataService.getProviderInfo();

    const statuses = [
      configuration.overallStatus,
      monitoring.overallStatus,
      resilience.status,
    ];

    let overallStatus = 'healthy';

    if (statuses.includes('critical')) {
      overallStatus = 'critical';
    } else if (statuses.includes('warning')) {
      overallStatus = 'warning';
    }

    return {
      success: true,
      service: 'integration-dashboard',
      overallStatus,
      configuration,
      monitoring,
      resilience,
      marketData,
      timestamp: new Date().toISOString(),
    };
  }
}
