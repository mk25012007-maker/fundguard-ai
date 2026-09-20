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

  constructor() {
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

  async createSubscription() {
    const planId = process.env.RAZORPAY_PLAN_ID;

    if (!planId) {
      throw new InternalServerErrorException('Razorpay plan ID is missing');
    }

    const subscription = await this.razorpay.subscriptions.create({
      plan_id: planId,
      total_count: 12,
      customer_notify: 1,
    });

    return {
      id: subscription.id,
      status: subscription.status,
      short_url: subscription.short_url,
    };
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

    return {
      success: true,
      userId,
      paymentId: data.razorpay_payment_id,
      subscriptionId: data.razorpay_subscription_id,
      message: 'Payment verified successfully',
    };
  }
}
