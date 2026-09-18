import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { RiskRuleAction, RiskRuleType } from '@prisma/client';

export class UpdateRiskRuleDto {
  @IsOptional()
  @IsString()
  tradingAccountId?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(RiskRuleType)
  type?: RiskRuleType;

  @IsOptional()
  @IsEnum(RiskRuleAction)
  action?: RiskRuleAction;

  @IsOptional()
  @IsNumber()
  thresholdValue?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
