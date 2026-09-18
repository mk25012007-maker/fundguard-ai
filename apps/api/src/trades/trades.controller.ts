import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { TradesService } from './trades.service';
import { CreateTradeDto } from './dto/create-trade.dto';
import { UpdateTradeDto } from './dto/update-trade.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('trades')
@UseGuards(JwtAuthGuard)
export class TradesController {
  constructor(private readonly tradesService: TradesService) {}

  @Get()
  async findAll(@CurrentUser() currentUser: { id: string }) {
    return this.tradesService.findAll(currentUser.id);
  }

  @Get(':id')
  async findOne(
    @CurrentUser() currentUser: { id: string },
    @Param('id') id: string,
  ) {
    return this.tradesService.findOne(currentUser.id, id);
  }

  @Post()
  async create(
    @CurrentUser() currentUser: { id: string },
    @Body() dto: CreateTradeDto,
  ) {
    return this.tradesService.create(currentUser.id, dto);
  }

  @Patch(':id')
  async update(
    @CurrentUser() currentUser: { id: string },
    @Param('id') id: string,
    @Body() dto: UpdateTradeDto,
  ) {
    return this.tradesService.update(currentUser.id, id, dto);
  }

  @Delete(':id')
  async delete(
    @CurrentUser() currentUser: { id: string },
    @Param('id') id: string,
  ) {
    return this.tradesService.delete(currentUser.id, id);
  }
}
