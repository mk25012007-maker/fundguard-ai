import { Controller, Get, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('cache-test')
  async cacheTest() {
    const cached = await this.cacheManager.get<string>('test-key');

    if (cached) {
      return { source: 'cache', value: cached };
    }

    const value = `generated at ${new Date().toISOString()}`;
    await this.cacheManager.set('test-key', value);

    return { source: 'fresh', value };
  }
}
