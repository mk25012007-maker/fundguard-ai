import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';

export type IntegrationLogLevel = 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';

export interface IntegrationLogEntry {
  id: string;
  timestamp: string;
  level: IntegrationLogLevel;
  integration: string;
  event: string;
  message: string;
  metadata?: Record<string, unknown>;
}

@Injectable()
export class IntegrationLoggingService {
  private readonly maxLogs = 100;

  constructor(private readonly prisma: PrismaService) {}

  async log(
    level: IntegrationLogLevel,
    integration: string,
    event: string,
    message: string,
    metadata?: Record<string, unknown>,
  ): Promise<IntegrationLogEntry> {
    const entry = await this.prisma.integration_events.create({
      data: {
        level,
        integration,
        event,
        message,
        metadata: metadata ? (metadata as Prisma.InputJsonValue) : undefined,
      },
    });

    const totalLogs = await this.prisma.integration_events.count();

    if (totalLogs > this.maxLogs) {
      const oldLogs = await this.prisma.integration_events.findMany({
        orderBy: {
          timestamp: 'asc',
        },
        take: totalLogs - this.maxLogs,
        select: {
          id: true,
        },
      });

      if (oldLogs.length > 0) {
        await this.prisma.integration_events.deleteMany({
          where: {
            id: {
              in: oldLogs.map((log) => log.id),
            },
          },
        });
      }
    }

    const result: IntegrationLogEntry = {
      id: entry.id,
      timestamp: entry.timestamp.toISOString(),
      level: entry.level as IntegrationLogLevel,
      integration: entry.integration,
      event: entry.event,
      message: entry.message,
      metadata:
        entry.metadata &&
        typeof entry.metadata === 'object' &&
        !Array.isArray(entry.metadata)
          ? (entry.metadata as Record<string, unknown>)
          : undefined,
    };

    console.log(`[INTEGRATION ${level}]`, JSON.stringify(result));

    return result;
  }

  async info(
    integration: string,
    event: string,
    message: string,
    metadata?: Record<string, unknown>,
  ) {
    return this.log('INFO', integration, event, message, metadata);
  }

  async success(
    integration: string,
    event: string,
    message: string,
    metadata?: Record<string, unknown>,
  ) {
    return this.log('SUCCESS', integration, event, message, metadata);
  }

  async warning(
    integration: string,
    event: string,
    message: string,
    metadata?: Record<string, unknown>,
  ) {
    return this.log('WARNING', integration, event, message, metadata);
  }

  async error(
    integration: string,
    event: string,
    message: string,
    metadata?: Record<string, unknown>,
  ) {
    return this.log('ERROR', integration, event, message, metadata);
  }

  async getLogs(): Promise<IntegrationLogEntry[]> {
    const logs = await this.prisma.integration_events.findMany({
      orderBy: {
        timestamp: 'desc',
      },
    });

    return logs.map((log) => ({
      id: log.id,
      timestamp: log.timestamp.toISOString(),
      level: log.level as IntegrationLogLevel,
      integration: log.integration,
      event: log.event,
      message: log.message,
      metadata:
        log.metadata &&
        typeof log.metadata === 'object' &&
        !Array.isArray(log.metadata)
          ? (log.metadata as Record<string, unknown>)
          : undefined,
    }));
  }

  async getRecentLogs(limit = 20): Promise<IntegrationLogEntry[]> {
    const safeLimit = Math.min(Math.max(limit, 1), this.maxLogs);

    const logs = await this.prisma.integration_events.findMany({
      orderBy: {
        timestamp: 'desc',
      },
      take: safeLimit,
    });

    return logs.map((log) => ({
      id: log.id,
      timestamp: log.timestamp.toISOString(),
      level: log.level as IntegrationLogLevel,
      integration: log.integration,
      event: log.event,
      message: log.message,
      metadata:
        log.metadata &&
        typeof log.metadata === 'object' &&
        !Array.isArray(log.metadata)
          ? (log.metadata as Record<string, unknown>)
          : undefined,
    }));
  }

  async hasErrors(integration: string): Promise<boolean> {
    const errorCount = await this.prisma.integration_events.count({
      where: {
        integration,
        level: 'ERROR',
      },
    });

    return errorCount > 0;
  }

  async clearLogsForIntegration(integration: string): Promise<number> {
    const result = await this.prisma.integration_events.deleteMany({
      where: {
        integration,
      },
    });

    return result.count;
  }

  async getSummary() {
    const logs = await this.getLogs();

    return {
      total: logs.length,
      info: logs.filter((log) => log.level === 'INFO').length,
      success: logs.filter((log) => log.level === 'SUCCESS').length,
      warning: logs.filter((log) => log.level === 'WARNING').length,
      error: logs.filter((log) => log.level === 'ERROR').length,
      maxLogs: this.maxLogs,
    };
  }
}
