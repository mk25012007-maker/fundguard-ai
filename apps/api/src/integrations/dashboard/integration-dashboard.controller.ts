import { Controller, Get } from '@nestjs/common';

import { IntegrationDashboardService } from './integration-dashboard.service';

@Controller('integrations/dashboard')
export class IntegrationDashboardController {
  constructor(private readonly dashboardService: IntegrationDashboardService) {}

  @Get()
  getDashboard() {
    return this.dashboardService.getDashboard();
  }
}
