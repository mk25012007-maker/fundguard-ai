import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class AnalyzeRiskDto {
  @IsString()
  asset!: string;

  @IsString()
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
  riskPercent!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  riskRewardRatio?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  accountBalance?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  currentDailyLoss?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  dailyLossLimit?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxDrawdown?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  currentDrawdown?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  tradesToday?: number;
}
