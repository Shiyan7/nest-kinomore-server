import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthDto } from './dto/auth.dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt/dist';
import { Tokens } from './types/tokens.type';
import { HALF_HOUR, ONE_DAY } from 'src/common/token.const';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signup(dto: AuthDto) {
    const isExist = await this.userService.findByEmail(dto.email);

    if (isExist) {
      throw new HttpException(
        { message: 'Пользователь с таким именем уже существует' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPass = await this.hashData(dto.password);

    const user = await this.userService.createUser(dto.email, hashedPass);

    const tokens = await this.generateTokens(user._id, user.email);
    await this.updateRtHash(user._id, tokens.refreshToken);

    return tokens;
  }

  async login(dto: AuthDto): Promise<Tokens> {
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

  async refreshToken(userId: string, rt: string): Promise<Tokens> {
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

  async logout(userId: string) {
    await this.userService.updateUser({ id: userId, hashedRt: null });

    return { message: 'ok' };
  }

  async generateTokens(userId: any, email: string): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email },
        { secret: 'superSecretAt', expiresIn: HALF_HOUR },
      ),
      this.jwtService.signAsync(
        { sub: userId, email },
        { secret: 'superSecretRt', expiresIn: ONE_DAY },
      ),
    ]);

    return { accessToken, refreshToken };
  }

  async updateRtHash(userId: any, rt: string) {
    const hashedRt = await this.hashData(rt);
    return this.userService.updateUser({ _id: userId, hashedRt });
  }

  hashData(data: string) {
    return argon.hash(data);
  }
}
