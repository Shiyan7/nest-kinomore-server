import { Get, Body, Controller, Post, Res, Query } from '@nestjs/common';
import { HttpCode, UseGuards } from '@nestjs/common/decorators';
import { HttpStatus } from '@nestjs/common/enums';
import { Response } from 'express';
import {
  CurrUser,
  GetCurrentUser,
  GetCurrentUserId,
  Public,
} from 'src/common/decorators';
import { ACCESS_TOKEN, REFRESH_TOKEN } from 'src/common/token.const';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { RtGuard } from './guards/rt.guard';
import { Tokens } from './types/tokens.type';
import { accessTokenConfig, refreshTokenConfig } from './cookie.config';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('/sign-up')
  @HttpCode(HttpStatus.CREATED)
  async signUp(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.signUp(dto);

    this.setCookies(res, tokens);

    return { message: 'ok' };
  }

  @Public()
  @Post('/sign-in')
  @HttpCode(HttpStatus.OK)
  async signIn(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.signIn(dto);

    this.setCookies(res, tokens);

    return { message: 'ok' };
  }

  @Public()
  @Get('/check-email')
  @HttpCode(HttpStatus.OK)
  async checkEmail(@Query('email') email: string) {
    const isExist = await this.authService.checkEmail(email);
    return isExist;
  }

  @UseGuards(RtGuard)
  @Post('/refresh')
  async refreshTokens(
    @GetCurrentUser() user: CurrUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.refreshTokens(
      user.sub,
      user.refreshToken,
    );

    this.setCookies(res, tokens);

    return { message: 'ok' };
  }

  @UseGuards(RtGuard)
  @Post('/logout')
  async logOut(
    @GetCurrentUserId() userId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    this.clearCookies(res);
    return this.authService.logOut(userId);
  }

  private async setCookies(res: Response, tokens: Tokens): Promise<Response> {
    res.cookie(ACCESS_TOKEN, tokens.accessToken, accessTokenConfig);

    res.cookie(REFRESH_TOKEN, tokens.refreshToken, refreshTokenConfig);

    return res;
  }

  private async clearCookies(res: Response): Promise<Response> {
    res.cookie(ACCESS_TOKEN, '', accessTokenConfig);

    res.cookie(REFRESH_TOKEN, '', refreshTokenConfig);

    return res;
  }
}
