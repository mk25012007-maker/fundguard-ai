import { Injectable } from '@nestjs/common';

import {
  IntegrationLoggingService,
  IntegrationLogEntry,
} from '../logging/integration-logging.service';

@Injectable()
export class IntegrationAnalyticsService {
  constructor(private readonly loggingService: IntegrationLoggingService) {}

  async getAnalytics() {
    const logs = await this.loggingService.getLogs();

    const totalEvents = logs.length;

    const infoEvents = logs.filter((log) => log.level === 'INFO').length;

    const successEvents = logs.filter((log) => log.level === 'SUCCESS').length;

    const warningEvents = logs.filter((log) => log.level === 'WARNING').length;

    const errorEvents = logs.filter((log) => log.level === 'ERROR').length;

    const recoveryEvents = logs.filter(
      (log) => log.event === 'INTEGRATION_RECOVERED',
    ).length;

    const requestEvents = logs.filter(
      (log) => log.event === 'QUOTE_REQUESTED',
    ).length;

    const completedEvents = successEvents + errorEvents + warningEvents;

    const successRate =
      completedEvents > 0
        ? Number(((successEvents / completedEvents) * 100).toFixed(2))
        : 0;

    const errorRate =
      completedEvents > 0
        ? Number(((errorEvents / completedEvents) * 100).toFixed(2))
        : 0;

    return {
      success: true,
      service: 'integration-analytics',

      summary: {
        totalEvents,
        requestEvents,
        infoEvents,
        successEvents,
        warningEvents,
        errorEvents,
        recoveryEvents,
        completedEvents,
      },

      rates: {
        successRate,
        errorRate,
      },

      integrations: this.getIntegrationAnalytics(logs),

      recentRecoveries: this.getRecentRecoveries(logs),

      timestamp: new Date().toISOString(),
    };
  }

  private getIntegrationAnalytics(logs: IntegrationLogEntry[]) {
    const integrations = [...new Set(logs.map((log) => log.integration))];

    return integrations.map((integration) => {
      const integrationLogs = logs.filter(
        (log) => log.integration === integration,
      );

      const successes = integrationLogs.filter(
        (log) => log.level === 'SUCCESS',
      ).length;

      const errors = integrationLogs.filter(
        (log) => log.level === 'ERROR',
      ).length;

      const warnings = integrationLogs.filter(
        (log) => log.level === 'WARNING',
      ).length;

      const completed = successes + errors + warnings;

      const successRate =
        completed > 0 ? Number(((successes / completed) * 100).toFixed(2)) : 0;

      return {
        integration,
        totalEvents: integrationLogs.length,
        successes,
        errors,
        warnings,
        successRate,
      };
    });
  }

  private getRecentRecoveries(logs: IntegrationLogEntry[]) {
    return logs
      .filter((log) => log.event === 'INTEGRATION_RECOVERED')
      .slice(0, 10);
  }
}
