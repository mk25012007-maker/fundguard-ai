import { Module } from '@nestjs/common';

import { IntegrationDashboardController } from './integration-dashboard.controller';
import { IntegrationDashboardService } from './integration-dashboard.service';

import { IntegrationConfigurationModule } from '../configuration/integration-configuration.module';
import { IntegrationMonitoringModule } from '../monitoring/integration-monitoring.module';
import { IntegrationResilienceModule } from '../resilience/integration-resilience.module';
import { MarketDataModule } from '../market-data/market-data.module';

@Module({
  imports: [
    IntegrationConfigurationModule,
    IntegrationMonitoringModule,
    IntegrationResilienceModule,
    MarketDataModule,
  ],
  controllers: [IntegrationDashboardController],
  providers: [IntegrationDashboardService],
})
export class IntegrationDashboardModule {}
