import {
  IsEnum,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export enum TradeAssetClass {
  EQUITY = 'EQUITY',
  CRYPTO = 'CRYPTO',
  FOREX = 'FOREX',
  OPTION = 'OPTION',
  FUTURE = 'FUTURE',
}

export enum TradeSide {
  BUY = 'BUY',
  SELL = 'SELL',
}

export class CreateTradeDto {
  @IsUUID()
  tradingAccountId!: string;

  @IsString()
  symbol!: string;

  @IsEnum(TradeAssetClass)
  assetClass!: TradeAssetClass;

  @IsEnum(TradeSide)
  side!: TradeSide;

  @IsNumberString()
  quantity!: string;

  @IsNumberString()
  price!: string;

  @IsOptional()
  @IsNumberString()
  fees?: string;

  @IsOptional()
  @IsString()
  externalOrderId?: string;
}
