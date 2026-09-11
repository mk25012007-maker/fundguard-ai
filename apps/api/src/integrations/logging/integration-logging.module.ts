import { Module } from '@nestjs/common';

import { IntegrationLoggingController } from './integration-logging.controller';
import { IntegrationLoggingService } from './integration-logging.service';

@Module({
  controllers: [IntegrationLoggingController],
  providers: [IntegrationLoggingService],
  exports: [IntegrationLoggingService],
})
export class IntegrationLoggingModule {}
