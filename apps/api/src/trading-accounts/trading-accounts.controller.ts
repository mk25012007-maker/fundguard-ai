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
import { TradingAccountsService } from './trading-accounts.service';
import { CreateTradingAccountDto } from './dto/create-trading-account.dto';
import { UpdateTradingAccountDto } from './dto/update-trading-account.dto';
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

  @Get(':id')
  async findOne(
    @CurrentUser() currentUser: { id: string },
    @Param('id') id: string,
  ) {
    return this.tradingAccountsService.findOne(currentUser.id, id);
  }

  @Post()
  async create(
    @CurrentUser() currentUser: { id: string },
    @Body() dto: CreateTradingAccountDto,
  ) {
    return this.tradingAccountsService.create(currentUser.id, dto);
  }

  @Patch(':id')
  async update(
    @CurrentUser() currentUser: { id: string },
    @Param('id') id: string,
    @Body() dto: UpdateTradingAccountDto,
  ) {
    return this.tradingAccountsService.update(currentUser.id, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(
    @CurrentUser() currentUser: { id: string },
    @Param('id') id: string,
  ) {
    return this.tradingAccountsService.remove(currentUser.id, id);
  }
}
