import { Module } from '@nestjs/common';

import { MarketDataModule } from '../market-data/market-data.module';
import { TradingModule } from '../trading/trading.module';

import { IntegrationsHealthController } from './integrations-health.controller';
import { IntegrationsHealthService } from './integrations-health.service';

@Module({
  imports: [MarketDataModule, TradingModule],
  controllers: [IntegrationsHealthController],
  providers: [IntegrationsHealthService],
})
export class IntegrationsHealthModule {}
