import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getRoot() {
    return {
      name: 'FundGuard AI API',
      status: 'ok',
      message: 'API is running',
    };
  }

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      service: 'fundguard-ai-api',
      timestamp: new Date().toISOString(),
    };
  }
}
