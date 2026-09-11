import { Module } from '@nestjs/common';

import { IntegrationConfigurationController } from './integration-configuration.controller';
import { IntegrationConfigurationService } from './integration-configuration.service';

@Module({
  controllers: [IntegrationConfigurationController],
  providers: [IntegrationConfigurationService],
  exports: [IntegrationConfigurationService],
})
export class IntegrationConfigurationModule {}
