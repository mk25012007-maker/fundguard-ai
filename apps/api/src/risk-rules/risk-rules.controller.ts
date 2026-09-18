import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { RiskRulesService } from './risk-rules.service';

import { CreateRiskRuleDto } from './dto/create-risk-rule.dto';
import { UpdateRiskRuleDto } from './dto/update-risk-rule.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('risk-rules')
@UseGuards(JwtAuthGuard)
export class RiskRulesController {
  constructor(private readonly riskRulesService: RiskRulesService) {}

  // =========================================================
  // GET ALL RISK RULES
  // =========================================================

  @Get()
  async findAll(@CurrentUser() currentUser: { id: string }) {
    return this.riskRulesService.findAll(currentUser.id);
  }

  // =========================================================
  // GET RISK RULE SUMMARY
  // =========================================================

  @Get('summary')
  async getSummary(@CurrentUser() currentUser: { id: string }) {
    return this.riskRulesService.getSummary(currentUser.id);
  }

  // =========================================================
  // GET RISK DASHBOARD SUMMARY
  // =========================================================

  @Get('dashboard')
  async getDashboard(@CurrentUser() currentUser: { id: string }) {
    return this.riskRulesService.getDashboardSummary(currentUser.id);
  }

  // =========================================================
  // GET ONE RISK RULE
  // =========================================================

  @Get(':id')
  async findOne(
    @CurrentUser() currentUser: { id: string },
    @Param('id') id: string,
  ) {
    return this.riskRulesService.findOne(currentUser.id, id);
  }

  // =========================================================
  // CREATE RISK RULE
  // =========================================================

  @Post()
  async create(
    @CurrentUser() currentUser: { id: string },
    @Body() dto: CreateRiskRuleDto,
  ) {
    return this.riskRulesService.create(currentUser.id, dto);
  }

  // =========================================================
  // UPDATE RISK RULE
  // =========================================================

  @Patch(':id')
  async update(
    @CurrentUser() currentUser: { id: string },
    @Param('id') id: string,
    @Body() dto: UpdateRiskRuleDto,
  ) {
    return this.riskRulesService.update(currentUser.id, id, dto);
  }

  // =========================================================
  // DELETE RISK RULE
  // =========================================================

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(
    @CurrentUser() currentUser: { id: string },
    @Param('id') id: string,
  ) {
    return this.riskRulesService.remove(currentUser.id, id);
  }
}
