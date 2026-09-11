import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class AiCoachingDto {
  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsString()
  experience?: string;

  @IsOptional()
  @IsString()
  recentPerformance?: string;

  @IsOptional()
  @IsString()
  mainChallenge?: string;

  @IsOptional()
  @IsString()
  goal?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  accountBalance?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  dailyLossLimit?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  currentDailyLoss?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  riskPercent?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  tradesToday?: number;
}
