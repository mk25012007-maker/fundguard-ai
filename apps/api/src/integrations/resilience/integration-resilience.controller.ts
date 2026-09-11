import { Controller, Get } from '@nestjs/common';

import { IntegrationResilienceService } from './integration-resilience.service';

@Controller('integrations/resilience')
export class IntegrationResilienceController {
  constructor(
    private readonly integrationResilienceService: IntegrationResilienceService,
  ) {}

  @Get('health')
  getHealth() {
    return this.integrationResilienceService.getHealth();
  }

  @Get('configuration')
  getConfiguration() {
    return this.integrationResilienceService.getConfiguration();
  }
}
