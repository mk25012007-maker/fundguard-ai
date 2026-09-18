import { Injectable, NotFoundException } from '@nestjs/common';

import { randomUUID } from 'crypto';

import { NotificationChannel, NotificationType } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async createNotification(params: {
    userId: string;
    type: NotificationType;
    title: string;
    body: string;
    channel?: NotificationChannel;
    linkedInsightId?: string;
  }) {
    return this.prisma.notifications.create({
      data: {
        id: randomUUID(),
        userId: params.userId,

        type: params.type,
        title: params.title,
        body: params.body,
        channel: params.channel ?? NotificationChannel.IN_APP,
        linkedInsightId: params.linkedInsightId,
        sentAt: new Date(),
      },
    });
  }

  async getNotifications(userId: string) {
    return this.prisma.notifications.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50,
      include: {
        ai_insights: {
          select: {
            id: true,
            type: true,
            severity: true,
            title: true,
          },
        },
      },
    });
  }

  async getUnreadNotifications(userId: string) {
    return this.prisma.notifications.findMany({
      where: {
        userId,
        isRead: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50,
    });
  }

  async getUnreadCount(userId: string) {
    const count = await this.prisma.notifications.count({
      where: {
        userId,
        isRead: false,
      },
    });

    return {
      count,
    };
  }

  async markAsRead(userId: string, notificationId: string) {
    const notification = await this.prisma.notifications.findFirst({
      where: {
        id: notificationId,
        userId,
      },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return this.prisma.notifications.update({
      where: {
        id: notificationId,
      },
      data: {
        isRead: true,
      },
    });
  }

  async markAllAsRead(userId: string) {
    const result = await this.prisma.notifications.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    return {
      updated: result.count,
    };
  }

  async deleteNotification(userId: string, notificationId: string) {
    const notification = await this.prisma.notifications.findFirst({
      where: {
        id: notificationId,
        userId,
      },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    await this.prisma.notifications.delete({
      where: {
        id: notificationId,
      },
    });

    return {
      success: true,
      message: 'Notification deleted',
    };
  }
}
