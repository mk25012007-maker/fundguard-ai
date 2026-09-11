import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async getStatus() {
    const userCount = await this.prisma.users.count();
    const tradeCount = await this.prisma.trades.count();

    const traderWithRelations = await this.prisma.users.findFirst({
      where: {
        role: 'TRADER',
      },
      include: {
        trading_accounts: true,
      },
    });

    return {
      message: 'FundGuard AI API is running',
      database: 'connected',
      counts: {
        users: userCount,
        trades: tradeCount,
      },
      sampleTrader: traderWithRelations
        ? {
            id: traderWithRelations.id,
            email: traderWithRelations.email,
            firstName: traderWithRelations.firstName,
            lastName: traderWithRelations.lastName,
          }
        : null,
    };
  }
}
