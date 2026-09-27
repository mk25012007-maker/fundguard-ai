import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getRoot() {
    return {
      name: 'Quantivo AI API',
      status: 'ok',
      message: 'API is running',
    };
  }

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      service: 'quantivo-ai-api',
      timestamp: new Date().toISOString(),
    };
  }
}
