import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BrokerType } from '@prisma/client';

export class CreateTradingAccountDto {
  @IsEnum(BrokerType)
  broker!: BrokerType;

  @IsString()
  @IsNotEmpty()
  accountLabel!: string;

  @IsString()
  @IsNotEmpty()
  externalId!: string;

  @IsOptional()
  @IsString()
  baseCurrency?: string;

  @IsOptional()
  @IsString()
  apiKeyEncrypted?: string;
}
