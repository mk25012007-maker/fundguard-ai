import { Injectable, Logger } from '@nestjs/common';

export interface IntegrationResilienceOptions {
  maxRetries?: number;
  retryDelayMs?: number;
  timeoutMs?: number;
}

@Injectable()
export class IntegrationResilienceService {
  private readonly logger = new Logger(IntegrationResilienceService.name);

  private readonly defaultMaxRetries = 3;
  private readonly defaultRetryDelayMs = 500;
  private readonly defaultTimeoutMs = 5000;

  async execute<T>(
    operation: () => Promise<T>,
    options: IntegrationResilienceOptions = {},
  ): Promise<T> {
    const maxRetries = options.maxRetries ?? this.defaultMaxRetries;

    const retryDelayMs = options.retryDelayMs ?? this.defaultRetryDelayMs;

    const timeoutMs = options.timeoutMs ?? this.defaultTimeoutMs;

    let lastError: unknown;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await this.executeWithTimeout(operation, timeoutMs);
      } catch (error) {
        lastError = error;

        this.logger.warn(
          `Integration failed on attempt ` +
            `${attempt}/${maxRetries}: ` +
            `${error instanceof Error ? error.message : 'Unknown error'}`,
        );

        if (attempt < maxRetries) {
          await this.delay(attempt * retryDelayMs);
        }
      }
    }

    this.logger.error(`Integration failed after ${maxRetries} attempts`);

    throw lastError;
  }

  private async executeWithTimeout<T>(
    operation: () => Promise<T>,
    timeoutMs: number,
  ): Promise<T> {
    let timeoutHandle: ReturnType<typeof setTimeout> | undefined;

    try {
      const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutHandle = setTimeout(() => {
          reject(
            new Error(`Integration request timed out after ${timeoutMs}ms`),
          );
        }, timeoutMs);
      });

      return await Promise.race([operation(), timeoutPromise]);
    } finally {
      if (timeoutHandle) {
        clearTimeout(timeoutHandle);
      }
    }
  }

  getHealth() {
    return {
      success: true,
      service: 'integration-resilience',
      status: 'healthy',
      retryEnabled: true,
      timeoutEnabled: true,
      maxRetries: this.defaultMaxRetries,
      retryDelayMs: this.defaultRetryDelayMs,
      timeoutMs: this.defaultTimeoutMs,
      timestamp: new Date().toISOString(),
    };
  }

  getConfiguration() {
    return {
      success: true,
      service: 'integration-resilience',
      resilienceEnabled: true,
      retry: {
        enabled: true,
        maxRetries: this.defaultMaxRetries,
        retryDelayMs: this.defaultRetryDelayMs,
      },
      timeout: {
        enabled: true,
        timeoutMs: this.defaultTimeoutMs,
      },
      timestamp: new Date().toISOString(),
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
}
