import {
  Controller,
  Get,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';

import { IntegrationLoggingService } from './integration-logging.service';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller('integrations/logs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class IntegrationLoggingController {
  constructor(
    private readonly integrationLoggingService: IntegrationLoggingService,
  ) {}

  @Get()
  async getLogs() {
    const logs = await this.integrationLoggingService.getLogs();

    return {
      success: true,
      service: 'integration-logging',
      logs,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('recent')
  async getRecentLogs(
    @Query(
      'limit',
      new ParseIntPipe({
        optional: true,
      }),
    )
    limit?: number,
  ) {
    const logs = await this.integrationLoggingService.getRecentLogs(
      limit ?? 20,
    );

    return {
      success: true,
      service: 'integration-logging',
      logs,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('summary')
  async getSummary() {
    const summary = await this.integrationLoggingService.getSummary();

    return {
      success: true,
      service: 'integration-logging',
      summary,
      timestamp: new Date().toISOString(),
    };
  }
}
