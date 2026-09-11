export class TradeAnalysisResponseDto {
  success!: boolean;

  assessment!: 'LOW_RISK' | 'MODERATE_RISK' | 'HIGH_RISK';

  score!: number;

  riskRewardRatio!: number;

  riskPercent!: number;

  analysis!: string;

  recommendations!: string[];
}
