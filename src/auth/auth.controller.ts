import { Get, Body, Controller, Post, Res } from '@nestjs/common';
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
  async register(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.signup(dto);

    this.setCookies(res, tokens);

    return tokens;
  }

  @Public()
  @Post('/sign-in')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: AuthDto, @Res({ passthrough: true }) res: Response) {
    const tokens = await this.authService.login(dto);

    this.setCookies(res, tokens);

    return tokens;
  }

  @Public()
  @Get('/check-email')
  @HttpCode(HttpStatus.OK)
  async checkEmail(@Body('email') email: string) {
    return await this.authService.checkEmail(email);
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

    this.setCookies(res, tokens);

    return tokens;
  }

  @UseGuards(RtGuard)
  @Post('/logout')
  async logout(
    @GetCurrentUserId() userId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    this.clearCookies(res);
    return this.authService.logout(userId);
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
