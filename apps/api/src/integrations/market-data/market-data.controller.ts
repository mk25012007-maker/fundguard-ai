import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { MarketDataService } from './market-data.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GetQuoteDto } from './dto/get-quote.dto';

@Controller('market-data')
@UseGuards(JwtAuthGuard)
export class MarketDataController {
  constructor(private readonly marketDataService: MarketDataService) {}

  @Get('quote')
  getQuote(@Query() query: GetQuoteDto) {
    return this.marketDataService.getQuote(query.symbol);
  }

  @Get('provider')
  getProviderInfo() {
    return this.marketDataService.getProviderInfo();
  }
}
