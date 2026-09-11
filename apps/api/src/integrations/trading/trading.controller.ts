import { Body, Controller, Get, Post } from '@nestjs/common';

import { TradingService } from './trading.service';
import type { BrokerOrderRequest } from './trading.service';

@Controller('trading')
export class TradingController {
  constructor(private readonly tradingService: TradingService) {}

  @Get('provider')
  getProviderInfo() {
    return this.tradingService.getProviderInfo();
  }

  @Get('connection')
  getConnectionStatus() {
    return this.tradingService.getConnectionStatus();
  }

  @Get('account')
  async getAccount() {
    return this.tradingService.getAccount();
  }

  @Get('health')
  getTradingHealth() {
    const connection = this.tradingService.getConnectionStatus();

    return {
      service: 'trading',
      status: 'healthy',
      executionEnabled: false,
      brokerConnected: connection.connected,
      message:
        'Trading integration is healthy. Real broker execution is disabled.',
    };
  }

  @Get('configuration')
  getTradingConfiguration() {
    return this.tradingService.getProviderInfo();
  }

  @Post('validate-order')
  validateOrder(@Body() order: BrokerOrderRequest) {
    return this.tradingService.validateOrder(order);
  }

  @Post('preview-order')
  previewOrder(@Body() order: BrokerOrderRequest) {
    return {
      ...this.tradingService.validateOrder(order),
      preview: true,
      message:
        'Order preview generated successfully. No real broker order was placed.',
    };
  }
}
