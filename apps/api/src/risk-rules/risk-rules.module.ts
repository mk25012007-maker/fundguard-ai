import { Module } from '@nestjs/common';

import { RiskRulesController } from './risk-rules.controller';
import { RiskRulesService } from './risk-rules.service';

import { PrismaModule } from '../prisma/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [PrismaModule, NotificationsModule],
  controllers: [RiskRulesController],
  providers: [RiskRulesService],
})
export class RiskRulesModule {}
