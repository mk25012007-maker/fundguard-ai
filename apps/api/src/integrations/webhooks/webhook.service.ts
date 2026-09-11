import { Injectable, BadRequestException } from '@nestjs/common';
import * as crypto from 'crypto';

export interface WebhookPayload {
  event: string;
  id?: string;
  timestamp?: string;
  data?: Record<string, unknown>;
  [key: string]: unknown;
}

@Injectable()
export class WebhookService {
  /**
   * 8.13 - Validate webhook signature
   *
   * Uses HMAC-SHA256 to verify that the webhook
   * was signed with the configured webhook secret.
   */
  validateSignature(
    payload: string,
    signature: string,
    secret: string,
  ): boolean {
    if (!payload || !signature || !secret) {
      return false;
    }

    try {
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(payload, 'utf8')
        .digest('hex');

      const receivedSignature = signature.replace(/^sha256=/i, '').trim();

      if (expectedSignature.length !== receivedSignature.length) {
        return false;
      }

      return crypto.timingSafeEqual(
        Buffer.from(expectedSignature, 'utf8'),
        Buffer.from(receivedSignature, 'utf8'),
      );
    } catch (error) {
      console.error('Webhook signature validation failed:', error);

      return false;
    }
  }

  /**
   * Process a validated webhook.
   */
  async processWebhook(payload: WebhookPayload) {
    if (!payload || typeof payload !== 'object') {
      throw new BadRequestException('Invalid webhook payload.');
    }

    if (!payload.event) {
      throw new BadRequestException('Webhook event is required.');
    }

    console.log(`[Webhook] Event received: ${payload.event}`);

    return {
      success: true,
      message: 'Webhook received and validated.',
      event: payload.event,
      id: payload.id ?? null,
      timestamp: payload.timestamp ?? null,
    };
  }
}
