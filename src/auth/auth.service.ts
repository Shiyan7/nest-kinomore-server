import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import * as argon from 'argon2';
import { AuthDto } from './dto';
import { Token, Tokens } from './types';
import { UserService } from 'src/user/user.service';
import { User, UserDto } from 'src/db-schema/user.schema';
import { ConfigService } from '@nestjs/config';
import { HALF_HOUR, ONE_MONTH } from 'src/common/token.const';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserDto.name) private usersModel: Model<UserDto>,
    private jwtService: JwtService,
    private usersService: UserService,
    private config: ConfigService,
  ) {}

  async signUp(dto: AuthDto): Promise<Tokens> {
    const { email, password } = dto;

    const isExist = await this.usersService.userByEmail(email);
    if (isExist) throw new HttpException('Email in use', HttpStatus.CONFLICT);

    const hashPassword = await this.hashPassword(password);

    const user = await this.usersModel.create({
      ...dto,
      photo: this.getAvatar(),
      password: hashPassword,
    });

    const tokens = await this.generatorTokens(user._id);

    return tokens;
  }

  async signIn(dto: AuthDto): Promise<Tokens> {
    const { email, password } = dto;

    const user = await this.usersService.userByEmail(email);

    if (!user) {
      throw new HttpException('User does not exist', HttpStatus.UNAUTHORIZED);
    }

    await this.passwordIsValid(user.password, password);

    const tokens = await this.generatorTokens(user._id);

    return tokens;
  }

  async logOut(
    user: User,
    accessToken: string,
    refreshToken: string,
  ): Promise<void> {
    const id = user._id;
    const accessTokenDelete = user.accessToken.filter(
      (x) => x.token !== accessToken,
    );
    const refreshTokenDelete = user.refreshToken.filter((x) => {
      return x.token !== refreshToken;
    });
    await this.usersModel.findByIdAndUpdate(id, {
      access_token: accessTokenDelete,
      refresh_token: refreshTokenDelete,
    });

    return;
  }

  async refreshTokens(refreshToken: string): Promise<string> {
    try {
      if (!refreshToken) throw new Error();

      const isValid = await this.jwtService.verify(refreshToken, {
        secret: this.config.get('RT_SECRET'),
      });

      const user = await this.usersModel.findById(isValid.id);

      if (!user.refreshToken.find((x) => x.token === refreshToken))
        throw new Error();

      const accessToken = this.generatorToken(isValid.id, 'access');
      user.accessToken.push(accessToken);
      user.save();

      return accessToken.token;
    } catch (error) {
      const payload = await this.jwtService.decode(refreshToken);

      if (typeof payload === 'string' || !payload?.id) {
        throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
      }

      await this.clearTokens(payload.id, refreshToken);

      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
  }

  async checkEmail(email: string): Promise<{ status: boolean }> {
    const isExist = await this.usersService.userByEmail(email);
    return { status: !!isExist };
  }

  private getAvatar(): string {
    const random = uuid();

    return `https://api.multiavatar.com/${random}.png?apikey=PF1ujm8g5A7BNc`;
  }

  private async hashPassword(password: string): Promise<string> {
    return await argon.hash(password);
  }

  private async passwordIsValid(password: string, userPassword: string) {
    const passwordEquals = await argon.verify(password, userPassword);

    if (!passwordEquals) {
      throw new HttpException('Incorrect password', HttpStatus.UNAUTHORIZED);
    }
  }

  private generatorToken(id: ObjectId, type: 'access' | 'ref'): Token {
    const payload: { [key: string]: ObjectId } = { id };

    return {
      token: this.jwtService.sign(payload, {
        expiresIn: type === 'ref' ? ONE_MONTH : HALF_HOUR,
        secret:
          type === 'ref'
            ? this.config.get('RT_SECRET')
            : this.config.get('AT_SECRET'),
      }),
      date: Date.now(),
    };
  }

  private async generatorTokens(id: ObjectId): Promise<Tokens> {
    const access = this.generatorToken(id, 'access');
    const refresh = this.generatorToken(id, 'ref');

    const user = await this.usersModel.findById(id);

    user.accessToken.push(access);
    user.refreshToken.push(refresh);
    user.save();

    return { accessToken: access.token, refreshToken: refresh.token };
  }

  private async clearTokens(id: ObjectId, refCurrentToken: string) {
    const user = await this.usersModel.findById(id);

    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }

    const currentDate = Date.now();

    const accessToken = [];
    const refreshToken = user.refreshToken.filter(
      (x) =>
        currentDate - x.date <= 24 * 60 * 60 * 1000 &&
        x.token !== refCurrentToken,
    );

    user.accessToken = accessToken;
    user.refreshToken = refreshToken;

    user.save();
  }
}
