import { IsIn, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class AnalyzeTradeDto {
  @IsString()
  asset!: string;

  @IsIn(['LONG', 'SHORT'])
  direction!: 'LONG' | 'SHORT';

  @IsNumber()
  @Min(0)
  entryPrice!: number;

  @IsNumber()
  @Min(0)
  stopLoss!: number;

  @IsNumber()
  @Min(0)
  takeProfit!: number;

  @IsNumber()
  @Min(0)
  positionSize!: number;

  @IsNumber()
  @Min(0)
  riskPercent!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  riskRewardRatio?: number;
}
