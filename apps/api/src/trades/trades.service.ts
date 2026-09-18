import { Injectable, NotFoundException } from '@nestjs/common';

import { randomUUID } from 'crypto';

import { PrismaService } from '../prisma/prisma.service';

import { CreateTradeDto } from './dto/create-trade.dto';
import { UpdateTradeDto } from './dto/update-trade.dto';

@Injectable()
export class TradesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.trades.findMany({
      where: {
        trading_accounts: {
          userId,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(userId: string, id: string) {
    const trade = await this.prisma.trades.findFirst({
      where: {
        id,
        trading_accounts: {
          userId,
        },
      },
    });

    if (!trade) {
      throw new NotFoundException('Trade not found');
    }

    return trade;
  }

  async create(userId: string, dto: CreateTradeDto) {
    const account = await this.prisma.trading_accounts.findFirst({
      where: {
        id: dto.tradingAccountId,
        userId,
      },
    });

    if (!account) {
      throw new NotFoundException('Trading account not found');
    }

    const totalValue = dto.totalValue ?? dto.quantity * dto.price;

    return this.prisma.trades.create({
      data: {
        id: randomUUID(),
        tradingAccountId: dto.tradingAccountId,
        symbol: dto.symbol.toUpperCase(),
        assetClass: dto.assetClass,
        side: dto.side,
        status: dto.status ?? 'PENDING',
        quantity: dto.quantity,
        price: dto.price,
        totalValue,
        fees: dto.fees ?? 0,
        externalOrderId: dto.externalOrderId,
        executedAt: dto.executedAt ? new Date(dto.executedAt) : null,
        updatedAt: new Date(),
      },
    });
  }

  async update(userId: string, id: string, dto: UpdateTradeDto) {
    const trade = await this.prisma.trades.findFirst({
      where: {
        id,
        trading_accounts: {
          userId,
        },
      },
    });

    if (!trade) {
      throw new NotFoundException('Trade not found');
    }

    const quantity = dto.quantity ?? Number(trade.quantity);

    const price = dto.price ?? Number(trade.price);

    const totalValue = dto.totalValue ?? quantity * price;

    return this.prisma.trades.update({
      where: {
        id,
      },
      data: {
        symbol: dto.symbol !== undefined ? dto.symbol.toUpperCase() : undefined,

        assetClass: dto.assetClass,

        side: dto.side,

        status: dto.status,

        quantity: dto.quantity,

        price: dto.price,

        totalValue,

        fees: dto.fees,

        externalOrderId: dto.externalOrderId,

        executedAt:
          dto.executedAt !== undefined
            ? dto.executedAt
              ? new Date(dto.executedAt)
              : null
            : undefined,

        updatedAt: new Date(),
      },
    });
  }

  async delete(userId: string, id: string) {
    const trade = await this.prisma.trades.findFirst({
      where: {
        id,
        trading_accounts: {
          userId,
        },
      },
    });

    if (!trade) {
      throw new NotFoundException('Trade not found');
    }

    await this.prisma.trades.delete({
      where: {
        id,
      },
    });

    return {
      success: true,
      message: 'Trade deleted successfully',
    };
  }
}
