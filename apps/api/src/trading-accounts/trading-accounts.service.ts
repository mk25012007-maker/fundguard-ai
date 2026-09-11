import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTradingAccountDto } from './dto/create-trading-account.dto';

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

  async create(userId: string, dto: CreateTradingAccountDto) {
    try {
      return await this.prisma.trading_accounts.create({
        data: {
          id: crypto.randomUUID(),
          userId,
          broker: dto.broker,
          accountLabel: dto.accountLabel,
          externalId: dto.externalId,
          baseCurrency: dto.baseCurrency ?? 'USD',
          apiKeyEncrypted: dto.apiKeyEncrypted,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'Trading account already exists for this broker and external ID',
        );
      }

      throw error;
    }
  }
}
