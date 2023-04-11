import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import * as argon from 'argon2';
import { AuthDto } from './dto';
import { Tokens } from './types';
import { UserService } from 'src/user/user.service';
import { UserDto } from 'src/db-schema/user.schema';
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

  async signupLocal(newUserDto: AuthDto): Promise<Tokens> {
    const { email, password } = newUserDto;

    const isEmail = await this.usersService.userByEmail(email);
    if (isEmail) throw new HttpException('Email in use', HttpStatus.CONFLICT);

    const hashPassword = await this.hashPassword(password);

    const user = await this.usersModel.create({
      ...newUserDto,
      photo: this.getAvatar(),
      password: hashPassword,
    });

    const tokens = await this.getTokens(user._id, user.email);

    return tokens;
  }

  async signinLocal(dto: AuthDto): Promise<Tokens> {
    return {
      accessToken: '123',
      refreshToken: '123',
    };
  }

  async logout(userId: number): Promise<boolean> {
    return true;
  }

  async refreshTokens(userId: number, rt: string): Promise<Tokens> {
    return {
      accessToken: '123',
      refreshToken: '123',
    };
  }

  private getAvatar(): string {
    const random = uuid();

    return `https://api.multiavatar.com/${random}.png?apikey=PF1ujm8g5A7BNc`;
  }

  private async hashPassword(password: string): Promise<string> {
    return await argon.hash(password);
  }

  private async getTokens(userId: ObjectId, email: string): Promise<Tokens> {
    const jwtPayload = {
      id: userId,
      email: email,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get<string>('AT_SECRET'),
        expiresIn: HALF_HOUR,
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get<string>('RT_SECRET'),
        expiresIn: ONE_MONTH,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
