import { Controller, Get } from '@nestjs/common';

import { IntegrationMonitoringService } from './integration-monitoring.service';

@Controller('integrations/monitoring')
export class IntegrationMonitoringController {
  constructor(
    private readonly monitoringService: IntegrationMonitoringService,
  ) {}

  @Get()
  getMonitoring() {
    return this.monitoringService.getMonitoring();
  }
}
