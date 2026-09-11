import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';

import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

import { comparePassword, hashPassword } from './utils/password.util';

import {
  hashToken,
  signRefreshToken,
  verifyRefreshToken,
} from './utils/refresh-token.util';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly mailService: MailService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.users.findUnique({
      where: {
        email: dto.email.toLowerCase(),
      },
    });

    if (existingUser) {
      throw new ConflictException('An account with this email already exists');
    }

    const passwordHash = await hashPassword(dto.password);

    const verificationToken = randomBytes(32).toString('hex');

    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const user = await this.prisma.users.create({
      data: {
        id: crypto.randomUUID(),
        email: dto.email,
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        role: 'TRADER',
        isActive: true,
        emailVerified: false,
        emailVerificationToken: verificationToken,
        emailVerificationExpires: verificationExpires,
        updatedAt: new Date(),
      },
    });

    await this.mailService.sendVerificationEmail(user.email, verificationToken);

    return {
      success: true,
      message: 'Registration successful. Please verify your email.',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        emailVerified: user.emailVerified,
      },
    };
  }

  async login(
    dto: LoginDto,
    meta: {
      userAgent?: string;
      ipAddress?: string;
    } = {},
  ) {
    const user = await this.validateUser(dto.email, dto.password);

    const now = new Date();

    await this.prisma.users.update({
      where: {
        id: user.id,
      },
      data: {
        lastLoginAt: now,
        updatedAt: now,
      },
    });

    const accessToken = this.generateAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = await this.generateRefreshToken(user.id, meta);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        emailVerified: user.emailVerified,
      },
    };
  }

  private async validateUser(email: string, password: string) {
    const user = await this.prisma.users.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordValid = await comparePassword(password, user.passwordHash);

    if (!passwordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return user;
  }

  private generateAccessToken(payload: {
    sub: string;
    email: string;
    role: string;
  }) {
    return this.jwtService.sign(payload);
  }

  private async generateRefreshToken(
    userId: string,
    meta: {
      userAgent?: string;
      ipAddress?: string;
    } = {},
  ) {
    const token = signRefreshToken({
      sub: userId,
    });

    const tokenHash = hashToken(token);

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash,
        userAgent: meta.userAgent,
        ipAddress: meta.ipAddress,
        expiresAt,
      },
    });

    return token;
  }

  async refreshAccessToken(
    rawRefreshToken: string,
    meta: {
      userAgent?: string;
      ipAddress?: string;
    } = {},
  ) {
    let payload: { sub: string };

    try {
      payload = verifyRefreshToken(rawRefreshToken);
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const tokenHash = hashToken(rawRefreshToken);

    const storedToken = await this.prisma.refreshToken.findUnique({
      where: {
        tokenHash,
      },
    });

    if (
      !storedToken ||
      storedToken.isRevoked ||
      storedToken.expiresAt < new Date()
    ) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    if (storedToken.userId !== payload.sub) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    await this.prisma.refreshToken.update({
      where: {
        id: storedToken.id,
      },
      data: {
        isRevoked: true,
      },
    });

    const user = await this.prisma.users.findUnique({
      where: {
        id: payload.sub,
      },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Account not found or inactive');
    }

    const accessToken = this.generateAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = await this.generateRefreshToken(user.id, meta);

    return {
      accessToken,
      refreshToken,
    };
  }

  async getCurrentUser(userId: string) {
    const user = await this.prisma.users.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        lastLoginAt: true,
      },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found or inactive');
    }

    return user;
  }

  async logout(rawRefreshToken?: string) {
    if (!rawRefreshToken) {
      return {
        success: true,
      };
    }

    const tokenHash = hashToken(rawRefreshToken);

    await this.prisma.refreshToken.updateMany({
      where: {
        tokenHash,
        isRevoked: false,
      },
      data: {
        isRevoked: true,
      },
    });

    return {
      success: true,
    };
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.users.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    });

    /*
     * Always return the same response whether the account
     * exists or not. This prevents email enumeration.
     */
    if (!user) {
      return {
        success: true,
        message: 'If an account exists, a password reset email will be sent.',
      };
    }

    const resetToken = randomBytes(32).toString('hex');

    const resetExpires = new Date(Date.now() + 60 * 60 * 1000);

    await this.prisma.users.update({
      where: {
        id: user.id,
      },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpires: resetExpires,
        updatedAt: new Date(),
      },
    });

    console.log(
      `[DEV ONLY] Password reset token for ${user.email}: ${resetToken}`,
    );

    return {
      success: true,
      message: 'If an account exists, a password reset email will be sent.',
    };
  }
}
