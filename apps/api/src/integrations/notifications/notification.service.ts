import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Expo, ExpoPushMessage, ExpoPushTicket } from 'expo-server-sdk';

export interface NotificationPayload {
  type: 'email' | 'push';
  to: string;
  subject?: string;
  message: string;
  pushToken?: string;
}

@Injectable()
export class NotificationService {
  private readonly transporter: nodemailer.Transporter;
  private readonly expo: Expo;

  constructor(private readonly configService: ConfigService) {
    this.expo = new Expo();

    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_HOST'),
      port: this.configService.get<number>('EMAIL_PORT', 587),
      secure: this.configService.get<boolean>('EMAIL_SECURE', false),
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASSWORD'),
      },
    });
  }

  async sendNotification(notification: NotificationPayload) {
    if (notification.type === 'push') {
      return this.sendPushNotification(notification);
    }

    return this.sendEmailNotification(notification);
  }

  private async sendEmailNotification(notification: NotificationPayload) {
    const user = this.configService.get<string>('EMAIL_USER');

    if (!user) {
      throw new InternalServerErrorException(
        'Email SMTP credentials are not configured',
      );
    }

    const from = this.configService.get<string>('EMAIL_FROM') || user;

    const result = await this.transporter.sendMail({
      from,
      to: notification.to,
      subject: notification.subject || 'FundGuard AI Notification',
      text: notification.message,
    });

    return {
      success: true,
      type: 'email',
      message: 'Email notification sent successfully',
      messageId: result.messageId,
    };
  }

  private async sendPushNotification(notification: NotificationPayload) {
    const pushToken = notification.pushToken || notification.to;

    if (!Expo.isExpoPushToken(pushToken)) {
      throw new InternalServerErrorException('Invalid Expo push token');
    }

    const message: ExpoPushMessage = {
      to: pushToken,
      sound: 'default',
      title: notification.subject || 'FundGuard AI',
      body: notification.message,
      data: {
        source: 'fundguard-ai',
      },
    };

    const chunks = this.expo.chunkPushNotifications([message]);

    const tickets: ExpoPushTicket[] = [];

    for (const chunk of chunks) {
      const ticketChunk = await this.expo.sendPushNotificationsAsync(chunk);

      tickets.push(...ticketChunk);
    }

    return {
      success: true,
      type: 'push',
      message: 'Push notification sent successfully',
      tickets,
    };
  }
}
