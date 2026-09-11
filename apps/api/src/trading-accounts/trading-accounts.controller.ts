import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { TradingAccountsService } from './trading-accounts.service';
import { CreateTradingAccountDto } from './dto/create-trading-account.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('trading-accounts')
@UseGuards(JwtAuthGuard)
export class TradingAccountsController {
  constructor(
    private readonly tradingAccountsService: TradingAccountsService,
  ) {}

  @Get()
  async findAll(@CurrentUser() currentUser: { id: string }) {
    return this.tradingAccountsService.findAll(currentUser.id);
  }

  @Post()
  async create(
    @CurrentUser() currentUser: { id: string },
    @Body() dto: CreateTradingAccountDto,
  ) {
    return this.tradingAccountsService.create(currentUser.id, dto);
  }
}
