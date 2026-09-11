import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const verificationLink = `${process.env.CORS_ORIGIN ?? 'http://localhost:3000'}/verify-email?token=${token}`;

    console.log(
      `[DEV ONLY] Verification email for ${email}: ${verificationLink}`,
    );
  }
}
