import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { RiskRuleAction, RiskRuleType } from '@prisma/client';

export class CreateRiskRuleDto {
  @IsOptional()
  @IsString()
  tradingAccountId?: string;

  @IsString()
  name!: string;

  @IsEnum(RiskRuleType)
  type!: RiskRuleType;

  @IsOptional()
  @IsEnum(RiskRuleAction)
  action?: RiskRuleAction;

  @IsNumber()
  thresholdValue!: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
