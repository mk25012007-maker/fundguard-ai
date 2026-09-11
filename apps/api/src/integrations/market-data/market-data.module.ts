import { Module } from '@nestjs/common';

import { IntegrationLoggingModule } from '../logging/integration-logging.module';
import { IntegrationResilienceModule } from '../resilience/integration-resilience.module';
import { MarketDataController } from './market-data.controller';
import { MarketDataService } from './market-data.service';

@Module({
  imports: [IntegrationResilienceModule, IntegrationLoggingModule],
  controllers: [MarketDataController],
  providers: [MarketDataService],
  exports: [MarketDataService],
})
export class MarketDataModule {}
