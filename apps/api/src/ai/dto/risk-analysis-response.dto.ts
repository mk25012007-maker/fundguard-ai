export class RiskAnalysisResponseDto {
  success!: boolean;
  riskLevel!: 'LOW_RISK' | 'MODERATE_RISK' | 'HIGH_RISK';
  score!: number;
  riskRewardRatio!: number;
  riskPercent!: number;
  dailyLossUsagePercent!: number;
  drawdownUsagePercent!: number;
  analysis!: string;
  warnings!: string[];
  recommendations!: string[];
  summary!: string;
}
