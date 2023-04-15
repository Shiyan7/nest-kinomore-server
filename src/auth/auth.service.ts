import * as argon from 'argon2';
import { v4 as uuid } from 'uuid';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { HALF_HOUR, ONE_MONTH } from 'src/common/token.const';
import { UserService } from 'src/user/user.service';
import { AuthDto } from './dto/auth.dto';
import { Tokens } from './types/tokens.type';
import { User } from 'src/user/user.model';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signUp(dto: AuthDto): Promise<Tokens> {
    const isExist = await this.userService.findByEmail(dto.email);

    if (isExist) {
      throw new HttpException(
        { message: 'Пользователь с таким именем уже существует' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPass = await this.hashData(dto.password);

    const user = await this.userService.createUser(
      dto.email,
      hashedPass,
      this.getAvatar(),
    );

    const tokens = await this.generateTokens(user._id, user.email);
    await this.updateRtHash(user._id, tokens.refreshToken);

    return tokens;
  }

  async signIn(dto: AuthDto): Promise<Tokens> {
    const user = await this.userService.findByEmail(dto.email);

    if (!user) {
      throw new HttpException(
        { message: 'Пользователь с таким именем или паролем не найден' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const isPassMatch = await argon.verify(user.password, dto.password);

    if (!isPassMatch) {
      throw new HttpException(
        { message: 'Пользователь с таким именем или паролем не найден' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const tokens = await this.generateTokens(user._id, user.email);
    await this.updateRtHash(user._id, tokens.refreshToken);

    return tokens;
  }

  async checkEmail(email: string): Promise<{ status: boolean }> {
    const isExist = await this.userService.findByEmail(email);

    return { status: !isExist };
  }

  async refreshTokens(userId: string, rt: string): Promise<Tokens> {
    const user = await this.userService.findById(userId);

    if (!user || !user.hashedRt) {
      throw new HttpException(
        { message: 'Доступ запрещен' },
        HttpStatus.FORBIDDEN,
      );
    }

    const rtMatch = await argon.verify(user.hashedRt, rt);

    if (!rtMatch) {
      throw new HttpException(
        { message: 'Доступ запрещен' },
        HttpStatus.FORBIDDEN,
      );
    }

    const newTokens = await this.generateTokens(user._id, user.email);

    await this.updateRtHash(user._id, newTokens.refreshToken);

    return newTokens;
  }

  async logOut(userId: string): Promise<{ message: string }> {
    await this.userService.updateUser({ _id: userId, hashedRt: null });

    return { message: 'ok' };
  }

  private async generateTokens(userId: any, email: string): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email },
        { secret: this.configService.get('AT_SECRET'), expiresIn: HALF_HOUR },
      ),
      this.jwtService.signAsync(
        { sub: userId, email },
        { secret: this.configService.get('RT_SECRET'), expiresIn: ONE_MONTH },
      ),
    ]);

    return { accessToken, refreshToken };
  }

  private async updateRtHash(userId: any, rt: string): Promise<User> {
    const hashedRt = await this.hashData(rt);
    return this.userService.updateUser({ _id: userId, hashedRt });
  }

  private hashData(data: string): Promise<string> {
    return argon.hash(data);
  }

  private getAvatar(): string {
    const random = uuid();
    const apiKey = this.configService.get('MULTIAVATAR_API_KEY');

    return `https://api.multiavatar.com/${random}.png?apikey=${apiKey}`;
  }
}
