import { Module } from '@nestjs/common';

import { IntegrationLoggingModule } from '../logging/integration-logging.module';
import { IntegrationMonitoringController } from './integration-monitoring.controller';
import { IntegrationMonitoringService } from './integration-monitoring.service';

@Module({
  imports: [IntegrationLoggingModule],
  controllers: [IntegrationMonitoringController],
  providers: [IntegrationMonitoringService],
  exports: [IntegrationMonitoringService],
})
export class IntegrationMonitoringModule {}
