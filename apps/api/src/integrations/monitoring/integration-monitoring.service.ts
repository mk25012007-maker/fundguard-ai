import { Injectable } from '@nestjs/common';

import { IntegrationLoggingService } from '../logging/integration-logging.service';

@Injectable()
export class IntegrationMonitoringService {
  private readonly warningErrors = 1;

  private readonly criticalErrors = 3;

  constructor(private readonly loggingService: IntegrationLoggingService) {}

  async getMonitoring() {
    const logs = await this.loggingService.getLogs();

    const integrations = [...new Set(logs.map((log) => log.integration))];

    const integrationStatuses = integrations.map((integration) => {
      const integrationLogs = logs.filter(
        (log) => log.integration === integration,
      );

      const errors = integrationLogs.filter(
        (log) => log.level === 'ERROR',
      ).length;

      const warnings = integrationLogs.filter(
        (log) => log.level === 'WARNING',
      ).length;

      let status = 'healthy';
      let alertLevel = 'none';

      if (errors >= this.criticalErrors) {
        status = 'critical';
        alertLevel = 'critical';
      } else if (errors >= this.warningErrors) {
        status = 'warning';
        alertLevel = 'warning';
      } else if (warnings > 0) {
        status = 'warning';
        alertLevel = 'warning';
      }

      return {
        integration,
        status,
        alertLevel,
        totalLogs: integrationLogs.length,
        errors,
        warnings,

        thresholds: {
          warningErrors: this.warningErrors,
          criticalErrors: this.criticalErrors,
        },
      };
    });

    const alerts = integrationStatuses
      .filter((item) => item.alertLevel !== 'none')
      .map((item) => ({
        integration: item.integration,

        level: item.alertLevel,

        message:
          item.alertLevel === 'critical'
            ? `${item.integration} has reached the critical failure threshold.`
            : `${item.integration} has failures requiring attention.`,

        errorCount: item.errors,
      }));

    const totalErrors = logs.filter((log) => log.level === 'ERROR').length;

    const totalWarnings = logs.filter((log) => log.level === 'WARNING').length;

    let overallStatus = 'healthy';

    if (integrationStatuses.some((item) => item.status === 'critical')) {
      overallStatus = 'critical';
    } else if (integrationStatuses.some((item) => item.status === 'warning')) {
      overallStatus = 'warning';
    }

    return {
      success: true,
      service: 'integration-monitoring',

      overallStatus,

      summary: {
        totalLogs: logs.length,
        errors: totalErrors,
        warnings: totalWarnings,
        integrations: integrationStatuses.length,
        activeAlerts: alerts.length,
      },

      thresholds: {
        warningErrors: this.warningErrors,
        criticalErrors: this.criticalErrors,
      },

      alerts,

      integrations: integrationStatuses,

      timestamp: new Date().toISOString(),
    };
  }
}
