import { Controller, Get } from '@nestjs/common';

import { IntegrationsHealthService } from './integrations-health.service';

@Controller('integrations')
export class IntegrationsHealthController {
  constructor(
    private readonly integrationsHealthService: IntegrationsHealthService,
  ) {}

  @Get('health')
  getHealth() {
    return this.integrationsHealthService.getHealth();
  }

  @Get('configuration')
  getConfiguration() {
    return this.integrationsHealthService.getConfiguration();
  }
}
