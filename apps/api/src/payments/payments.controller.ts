import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RazorpayService } from './razorpay.service';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly razorpayService: RazorpayService) {}

  @Post('subscription')
  async createSubscription(@Req() req: Request) {
    return this.razorpayService.createSubscription();
  }

  @Post('verify')
  async verifyPayment(
    @Req() req: Request,
    @Body()
    body: {
      razorpay_payment_id: string;
      razorpay_subscription_id: string;
      razorpay_signature: string;
    },
  ) {
    const user = req.user as {
      id: string;
      email: string;
      role: string;
    };

    return this.razorpayService.verifyPayment(user.id, body);
  }
}
