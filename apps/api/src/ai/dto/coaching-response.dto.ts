export class CoachingResponseDto {
  coachingLevel!: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  disciplineScore!: number;
  summary!: string;
  strengths!: string[];
  weaknesses!: string[];
  improvements!: string[];
  actionPlan!: string[];
  coachMessage!: string;
  recommendations!: string[];
}
