import { PrismaService } from '../prisma/prisma.service';
import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import Razorpay from 'razorpay';
import * as crypto from 'crypto';

@Injectable()
export class RazorpayService {
  private readonly razorpay: Razorpay;

  constructor(private readonly prisma: PrismaService) {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      throw new InternalServerErrorException(
        'Razorpay configuration is missing',
      );
    }

    this.razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  }

  async createSubscription(userId: string) {
    const planId = process.env.RAZORPAY_PLAN_ID;

    if (!planId) {
      throw new InternalServerErrorException('Razorpay plan ID is missing');
    }

    console.log('[RAZORPAY] Creating subscription with configured plan');

    try {
      const subscription = await this.razorpay.subscriptions.create({
        plan_id: planId,
        total_count: 12,
        customer_notify: 1,
      });

      console.log('[RAZORPAY] Subscription created:', subscription.id);

      await this.prisma.subscriptions.upsert({
        where: {
          userId,
        },
        update: {
          externalSubscriptionId: subscription.id,
          status: 'TRIALING',
          updatedAt: new Date(),
        },
        create: {
          id: crypto.randomUUID(),
          userId,
          tier: 'FREE',
          status: 'TRIALING',
          externalSubscriptionId: subscription.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      return {
        id: subscription.id,
        status: subscription.status,
        short_url: subscription.short_url,
      };
    } catch (error) {
      console.error('[RAZORPAY] Subscription creation failed:', error);
      throw error;
    }
  }

  async verifyPayment(
    userId: string,
    data: {
      razorpay_payment_id: string;
      razorpay_subscription_id: string;
      razorpay_signature: string;
    },
  ) {
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keySecret) {
      throw new InternalServerErrorException(
        'Razorpay configuration is missing',
      );
    }

    const payload = `${data.razorpay_payment_id}|${data.razorpay_subscription_id}`;

    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(payload)
      .digest('hex');

    if (expectedSignature !== data.razorpay_signature) {
      throw new UnauthorizedException('Invalid Razorpay payment signature');
    }

    await this.prisma.subscriptions.update({
      where: {
        userId,
      },
      data: {
        tier: 'PRO',
        status: 'ACTIVE',
        externalSubscriptionId: data.razorpay_subscription_id,
        updatedAt: new Date(),
      },
    });

    return {
      success: true,
      userId,
      paymentId: data.razorpay_payment_id,
      subscriptionId: data.razorpay_subscription_id,
      message: 'Payment verified successfully',
    };
  }
}
