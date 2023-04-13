import { Body, Controller, Post, Res } from '@nestjs/common';
import { HttpCode, UseGuards } from '@nestjs/common/decorators';
import { HttpStatus } from '@nestjs/common/enums';
import { Response } from 'express';
import {
  CurrUser,
  GetCurrentUser,
} from 'src/common/decorators/get-current-user.decorator';
import { GetCurrentUserId } from 'src/common/decorators/get-current-userId.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import {
  ACCESS_TOKEN,
  HALF_HOUR,
  ONE_DAY,
  REFRESH_TOKEN,
} from 'src/common/token.const';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { RtGuard } from './guards/rt.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('/sign-up')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.signup(dto);

    res.cookie(ACCESS_TOKEN, tokens.accessToken, {
      maxAge: HALF_HOUR * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });

    res.cookie(REFRESH_TOKEN, tokens.refreshToken, {
      maxAge: ONE_DAY * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });

    return tokens;
  }

  @Public()
  @Post('/sign-in')
  async login(@Body() dto: AuthDto, @Res({ passthrough: true }) res: Response) {
    const tokens = await this.authService.login(dto);

    res.cookie(ACCESS_TOKEN, tokens.accessToken, {
      maxAge: HALF_HOUR * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });

    res.cookie(REFRESH_TOKEN, tokens.refreshToken, {
      maxAge: ONE_DAY * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });

    return tokens;
  }

  @UseGuards(RtGuard)
  @Post('/refresh')
  async refreshToken(
    @GetCurrentUser() user: CurrUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.refreshToken(
      user.sub,
      user.refreshToken,
    );

    res.cookie(ACCESS_TOKEN, tokens.accessToken, {
      maxAge: HALF_HOUR * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });

    res.cookie(REFRESH_TOKEN, tokens.refreshToken, {
      maxAge: ONE_DAY * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });

    return tokens;
  }

  @UseGuards(RtGuard)
  @Post('/logout')
  async logout(
    @GetCurrentUserId() userId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    res.cookie(ACCESS_TOKEN, '', {
      maxAge: HALF_HOUR * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });

    res.cookie(REFRESH_TOKEN, '', {
      maxAge: ONE_DAY * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });

    return this.authService.logout(userId);
  }
}
