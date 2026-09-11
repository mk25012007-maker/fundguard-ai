export class AiCoachingResponseDto {
  success!: boolean;

  coachingLevel!: 'HIGH_RISK' | 'STABLE' | 'NEEDS_ATTENTION';

  disciplineScore!: number;

  summary!: string;

  strengths!: string[];

  improvements!: string[];

  actionPlan!: string[];

  coachMessage!: string;
}
