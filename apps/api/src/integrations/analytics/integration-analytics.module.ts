import { Module } from '@nestjs/common';

import { IntegrationAnalyticsController } from './integration-analytics.controller';
import { IntegrationAnalyticsService } from './integration-analytics.service';
import { IntegrationLoggingModule } from '../logging/integration-logging.module';

@Module({
  imports: [IntegrationLoggingModule],
  controllers: [IntegrationAnalyticsController],
  providers: [IntegrationAnalyticsService],
})
export class IntegrationAnalyticsModule {}
