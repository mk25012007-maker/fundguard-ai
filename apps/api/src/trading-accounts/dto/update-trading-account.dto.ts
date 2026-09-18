import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { AccountStatus } from '@prisma/client';

export class UpdateTradingAccountDto {
  @IsOptional()
  @IsString()
  accountLabel?: string;

  @IsOptional()
  @IsString()
  baseCurrency?: string;

  @IsOptional()
  @IsEnum(AccountStatus)
  status?: AccountStatus;

  @IsOptional()
  @IsNumber()
  balance?: number;
}
