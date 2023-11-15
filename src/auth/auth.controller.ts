import { Get, Body, Controller, Post, Query } from '@nestjs/common';
import { HttpCode } from '@nestjs/common/decorators';
import { HttpStatus } from '@nestjs/common/enums';
import { AuthService } from './auth.service';
import { SignUpInput } from './dto/sign-up.input';
import { SignInInput } from './dto/sign-in.input';
import { RefreshTokenInput } from './dto/refresh-token.input';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('/sign-up')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() dto: SignUpInput) {
    const tokens = await this.auth.signUp(dto);

    return tokens;
  }

  @Post('/sign-in')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() { email, password }: SignInInput) {
    const tokens = await this.auth.signIn(email, password);

    return tokens;
  }

  @Post('/google')
  @HttpCode(HttpStatus.OK)
  async signInGoogle(@Body('code') code: string) {
    const tokens = await this.auth.signInGoogle(code);

    return tokens;
  }

  @Get('/check-user')
  @HttpCode(HttpStatus.OK)
  async checkEmail(@Query('email') email: string) {
    const status = await this.auth.checkIsNewUser(email);

    return status;
  }

  @Post('/refresh')
  async refreshTokens(@Body() { token }: RefreshTokenInput) {
    const tokens = this.auth.refreshToken(token);

    return tokens;
  }
}
