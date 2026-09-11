import { Injectable, BadRequestException } from '@nestjs/common';

export interface BrokerOrderRequest {
  symbol: string;
  side: 'BUY' | 'SELL';
  quantity: number;
  orderType?: 'MARKET' | 'LIMIT';
  price?: number;
}

export interface BrokerAccount {
  id: string;
  provider: string;
  connected: boolean;
  accountType: string;
}

@Injectable()
export class TradingService {
  private readonly provider = process.env.TRADING_PROVIDER ?? 'NONE';

  private readonly apiUrl = process.env.TRADING_API_URL ?? '';

  private readonly apiKey = process.env.TRADING_API_KEY ?? '';

  getProviderInfo() {
    const configured =
      Boolean(this.apiUrl) && Boolean(this.apiKey) && this.provider !== 'NONE';

    return {
      provider: this.provider,
      configured,
      tradingEnabled: false,
      errorHandling: true,
      timeoutMs: 5000,
      message:
        'Broker integration layer is configured for safe connection testing. Real order execution is disabled.',
    };
  }

  getConnectionStatus() {
    const configured =
      Boolean(this.apiUrl) && Boolean(this.apiKey) && this.provider !== 'NONE';

    return {
      provider: this.provider,
      configured,
      connected: false,
      tradingEnabled: false,
    };
  }

  async getAccount(): Promise<BrokerAccount> {
    const status = this.getConnectionStatus();

    if (!status.configured) {
      return {
        id: 'demo-account',
        provider: 'NONE',
        connected: false,
        accountType: 'DEMO',
      };
    }

    return {
      id: 'pending',
      provider: this.provider,
      connected: false,
      accountType: 'UNKNOWN',
    };
  }

  validateOrder(order: BrokerOrderRequest) {
    if (!order.symbol?.trim()) {
      throw new BadRequestException('Trading symbol is required.');
    }

    if (!['BUY', 'SELL'].includes(order.side)) {
      throw new BadRequestException('Order side must be BUY or SELL.');
    }

    if (!Number.isFinite(order.quantity) || order.quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than zero.');
    }

    const orderType = order.orderType ?? 'MARKET';

    if (!['MARKET', 'LIMIT'].includes(orderType)) {
      throw new BadRequestException('Order type must be MARKET or LIMIT.');
    }

    if (
      orderType === 'LIMIT' &&
      (!Number.isFinite(order.price) || Number(order.price) <= 0)
    ) {
      throw new BadRequestException('Limit orders require a valid price.');
    }

    const normalizedOrder = {
      symbol: order.symbol.trim().toUpperCase(),
      side: order.side,
      quantity: order.quantity,
      orderType,
      price: order.price ?? null,
    };

    this.writeAuditLog(normalizedOrder);

    return {
      valid: true,
      order: normalizedOrder,
      execution: 'DISABLED',
      auditLogged: true,
      message:
        'Order validation successful. Real broker execution is disabled.',
    };
  }

  private writeAuditLog(order: {
    symbol: string;
    side: 'BUY' | 'SELL';
    quantity: number;
    orderType: 'MARKET' | 'LIMIT';
    price: number | null;
  }): void {
    const auditEntry = {
      event: 'TRADING_ORDER_VALIDATED',
      timestamp: new Date().toISOString(),
      provider: this.provider,
      execution: 'DISABLED',
      order,
    };

    console.log('[TRADING AUDIT]', JSON.stringify(auditEntry));
  }
}
