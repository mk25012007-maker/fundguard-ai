import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTradingAccountDto } from './dto/create-trading-account.dto';
import { UpdateTradingAccountDto } from './dto/update-trading-account.dto';

@Injectable()
export class TradingAccountsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.trading_accounts.findMany({
      where: {
        userId,
      },
      orderBy: {
        connectedAt: 'desc',
      },
    });
  }

  async findOne(userId: string, id: string) {
    const account = await this.prisma.trading_accounts.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!account) {
      throw new NotFoundException('Trading account not found');
    }

    return account;
  }

  async create(userId: string, dto: CreateTradingAccountDto) {
    return this.prisma.trading_accounts.create({
      data: {
        id: randomUUID(),
        userId,
        broker: dto.broker,
        accountLabel: dto.accountLabel,
        externalId: dto.externalId,
        baseCurrency: dto.baseCurrency ?? 'USD',
        apiKeyEncrypted: dto.apiKeyEncrypted,
        updatedAt: new Date(),
      },
    });
  }

  async update(userId: string, id: string, dto: UpdateTradingAccountDto) {
    await this.findOne(userId, id);

    return this.prisma.trading_accounts.update({
      where: {
        id,
      },
      data: {
        accountLabel: dto.accountLabel,
        baseCurrency: dto.baseCurrency,
        status: dto.status,
        balance: dto.balance,
        updatedAt: new Date(),
      },
    });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);

    await this.prisma.trading_accounts.delete({
      where: {
        id,
      },
    });

    return {
      success: true,
      message: 'Trading account deleted successfully',
    };
  }
}
