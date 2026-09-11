import { Module } from '@nestjs/common';

import { IntegrationResilienceController } from './integration-resilience.controller';
import { IntegrationResilienceService } from './integration-resilience.service';

@Module({
  controllers: [IntegrationResilienceController],
  providers: [IntegrationResilienceService],
  exports: [IntegrationResilienceService],
})
export class IntegrationResilienceModule {}
