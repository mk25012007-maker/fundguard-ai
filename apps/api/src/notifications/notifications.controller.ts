import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';

import { NotificationsService } from './notifications.service';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async getNotifications(@CurrentUser() currentUser: { id: string }) {
    return this.notificationsService.getNotifications(currentUser.id);
  }

  @Get('unread')
  async getUnreadNotifications(@CurrentUser() currentUser: { id: string }) {
    return this.notificationsService.getUnreadNotifications(currentUser.id);
  }

  @Get('unread-count')
  async getUnreadCount(@CurrentUser() currentUser: { id: string }) {
    return this.notificationsService.getUnreadCount(currentUser.id);
  }

  @Patch('read-all')
  async markAllAsRead(@CurrentUser() currentUser: { id: string }) {
    return this.notificationsService.markAllAsRead(currentUser.id);
  }

  @Patch(':id/read')
  async markAsRead(
    @CurrentUser()
    currentUser: {
      id: string;
    },
    @Param('id') notificationId: string,
  ) {
    return this.notificationsService.markAsRead(currentUser.id, notificationId);
  }

  @Delete(':id')
  async deleteNotification(
    @CurrentUser()
    currentUser: {
      id: string;
    },
    @Param('id') notificationId: string,
  ) {
    return this.notificationsService.deleteNotification(
      currentUser.id,
      notificationId,
    );
  }
}
