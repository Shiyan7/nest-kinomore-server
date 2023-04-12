import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Public } from 'src/common/decorators';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { Tokens } from './types';
import { Response } from 'express';
import { ACCESS_TOKEN, REFRESH_TOKEN } from 'src/common/token.const';
import { accessTokenConfig, refreshTokenConfig } from './cookie.config';
import { RtGuard } from './guards';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  async signUpLocal(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Tokens> {
    const tokens = await this.authService.signUp(dto);

    res.cookie(REFRESH_TOKEN, tokens.refreshToken, refreshTokenConfig);

    res.cookie(ACCESS_TOKEN, tokens.accessToken, accessTokenConfig);

    return tokens;
  }

  @Public()
  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  async signInLocal(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Tokens> {
    const tokens = await this.authService.signIn(dto);

    res.cookie(REFRESH_TOKEN, tokens.refreshToken, refreshTokenConfig);

    res.cookie(ACCESS_TOKEN, tokens.accessToken, accessTokenConfig);

    return tokens;
  }

  @UseGuards(RtGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logOut(@Req() userId: number): Promise<boolean> {
    return this.authService.logout(userId);
  }

  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    @Req() userId: number,
    @Req() refreshToken: string,
  ): Promise<Tokens> {
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @Public()
  @Get('check-email')
  @HttpCode(HttpStatus.OK)
  async check(@Body('email') email: string): Promise<{ status: boolean }> {
    return await this.authService.checkEmail(email);
  }
}
