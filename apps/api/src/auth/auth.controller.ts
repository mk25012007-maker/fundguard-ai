import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import { Throttle } from '@nestjs/throttler';

import type { Request, Response } from 'express';

import { AuthService } from './auth.service';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { RolesGuard } from './guards/roles.guard';

const ACCESS_COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'none' as const,
  maxAge: 15 * 60 * 1000,
  path: '/',
};

const REFRESH_COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'none' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/auth/refresh',
};

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true })
    res: Response,
  ) {
    const { accessToken, refreshToken, user } = await this.authService.login(
      dto,
      {
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip,
      },
    );

    res.cookie('access_token', accessToken, ACCESS_COOKIE_OPTS);

    res.cookie('refresh_token', refreshToken, REFRESH_COOKIE_OPTS);

    // JWT tokens are stored only in httpOnly cookies.
    return {
      user,
    };
  }

  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true })
    res: Response,
  ) {
    const rawRefreshToken = req.cookies?.['refresh_token'];

    if (!rawRefreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }

    const { accessToken, refreshToken } =
      await this.authService.refreshAccessToken(rawRefreshToken, {
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip,
      });

    res.cookie('access_token', accessToken, ACCESS_COOKIE_OPTS);

    res.cookie('refresh_token', refreshToken, REFRESH_COOKIE_OPTS);

    // JWT tokens are stored only in httpOnly cookies.
    return {
      success: true,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('me')
  async me(
    @CurrentUser()
    currentUser: {
      id: string;
      email: string;
      role: string;
    },
  ) {
    return this.authService.getCurrentUser(currentUser.id);
  }

  @Post('logout')
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true })
    res: Response,
  ) {
    const rawRefreshToken = req.cookies?.['refresh_token'];

    await this.authService.logout(rawRefreshToken);

    res.clearCookie('access_token', {
      path: '/',
    });

    res.clearCookie('refresh_token', {
      path: '/auth/refresh',
    });

    return {
      success: true,
    };
  }

  @Throttle({
    default: {
      limit: 3,
      ttl: 60000,
    },
  })
  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }
}
