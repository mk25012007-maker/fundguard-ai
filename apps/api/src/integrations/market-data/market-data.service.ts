import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { IntegrationLoggingService } from '../logging/integration-logging.service';
import { IntegrationResilienceService } from '../resilience/integration-resilience.service';

@Injectable()
export class MarketDataService {
  private readonly apiUrl =
    process.env.MARKET_DATA_API_URL || 'https://api.twelvedata.com';

  private readonly apiKey = process.env.MARKET_DATA_API_KEY || '';

  constructor(
    private readonly resilienceService: IntegrationResilienceService,
    private readonly loggingService: IntegrationLoggingService,
  ) {}

  async getQuote(symbol: string) {
    const cleanSymbol = symbol?.trim().toUpperCase();

    if (!cleanSymbol) {
      throw new BadRequestException('Market data symbol is required');
    }

    if (!this.apiKey) {
      this.loggingService.error(
        'market-data',
        'QUOTE_ERROR',
        'Market data API key is not configured.',
        {
          symbol: cleanSymbol,
        },
      );

      throw new InternalServerErrorException(
        'Market data API key is not configured',
      );
    }

    this.loggingService.info(
      'market-data',
      'QUOTE_REQUESTED',
      'Market data quote requested.',
      {
        symbol: cleanSymbol,
      },
    );

    const url = new URL('/quote', this.apiUrl);

    url.searchParams.set('symbol', cleanSymbol);
    url.searchParams.set('apikey', this.apiKey);

    try {
      const quote = await this.resilienceService.execute(
        async () => {
          const response = await fetch(url);

          if (response.status === 429) {
            throw new HttpException(
              'Market data API rate limit exceeded. Please try again later.',
              HttpStatus.TOO_MANY_REQUESTS,
            );
          }

          if (!response.ok) {
            throw new Error(
              `Market data provider returned HTTP ${response.status}`,
            );
          }

          const data = await response.json();

          if (data.status === 'error') {
            throw new BadRequestException(
              data.message || 'Market data provider error',
            );
          }

          return {
            success: true,
            provider: 'Twelve Data',
            symbol: data.symbol,
            name: data.name,
            exchange: data.exchange,
            currency: data.currency,
            price: Number(data.close),
            open: Number(data.open),
            high: Number(data.high),
            low: Number(data.low),
            previousClose: Number(data.previous_close),
          };
        },
        {
          maxRetries: 3,
          retryDelayMs: 1000,
          timeoutMs: 5000,
        },
      );

      const hadErrors = await this.loggingService.hasErrors('market-data');
      if (hadErrors) {
        const clearedLogs =
          this.loggingService.clearLogsForIntegration('market-data');

        this.loggingService.success(
          'market-data',
          'INTEGRATION_RECOVERED',
          'Market data integration recovered successfully.',
          {
            symbol: cleanSymbol,
            provider: 'Twelve Data',
            clearedLogs,
          },
        );
      }

      this.loggingService.success(
        'market-data',
        'QUOTE_SUCCESS',
        'Market data quote fetched successfully.',
        {
          symbol: cleanSymbol,
          provider: 'Twelve Data',
        },
      );

      return quote;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unknown market data error';

      const isRateLimitError =
        error instanceof HttpException &&
        error.getStatus() === HttpStatus.TOO_MANY_REQUESTS;

      if (isRateLimitError) {
        this.loggingService.warning(
          'market-data',
          'QUOTE_RATE_LIMITED',
          message,
          {
            symbol: cleanSymbol,
          },
        );
      } else {
        this.loggingService.error('market-data', 'QUOTE_ERROR', message, {
          symbol: cleanSymbol,
        });
      }

      throw error;
    }
  }

  getProviderInfo() {
    return {
      provider: 'Twelve Data',
      configured: Boolean(this.apiUrl && this.apiKey),
      resilienceEnabled: true,
      retryEnabled: true,
      maxRetries: 3,
      retryDelayMs: 1000,
      timeoutMs: 5000,
      rateLimitHandling: true,
      integrationLoggingEnabled: true,
      automaticRecoveryEnabled: true,
    };
  }
}
