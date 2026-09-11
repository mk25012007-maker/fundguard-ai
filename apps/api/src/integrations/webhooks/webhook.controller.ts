import {
  Body,
  Controller,
  Headers,
  HttpCode,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';

import { WebhookService } from './webhook.service';
import type { WebhookPayload } from './webhook.service';

@Controller('webhooks')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post('receive')
  @HttpCode(200)
  async receiveWebhook(
    @Body() payload: WebhookPayload,
    @Headers('x-webhook-signature')
    signature: string | undefined,
    @Req() request: Request,
  ) {
    const secret = process.env.WEBHOOK_SECRET;

    if (!secret) {
      throw new UnauthorizedException('Webhook secret is not configured.');
    }

    const rawPayload = JSON.stringify(request.body);

    const isValid = this.webhookService.validateSignature(
      rawPayload,
      signature ?? '',
      secret,
    );

    if (!isValid) {
      throw new UnauthorizedException('Invalid webhook signature.');
    }

    return this.webhookService.processWebhook(payload);
  }
}
