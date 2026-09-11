import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserRole } from '@prisma/client';

import { IntegrationConfigurationService } from './integration-configuration.service';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller('integrations/configuration')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class IntegrationConfigurationController {
  constructor(
    private readonly configurationService: IntegrationConfigurationService,
  ) {}

  @Get()
  getConfigurationHealth() {
    return this.configurationService.getConfigurationHealth();
  }

  @Get('market-data')
  getMarketDataConfiguration() {
    return this.configurationService.getMarketDataConfiguration();
  }
}
