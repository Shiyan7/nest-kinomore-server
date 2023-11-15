import { v4 as uuid } from 'uuid';
import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { PasswordService } from './password.service';
import { Tokens } from './models/tokens.model';
import { SignUpInput } from './dto/sign-up.input';
import { User } from 'src/user/user.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordService,
    private readonly configService: ConfigService,
  ) {}

  async signUp(payload: SignUpInput): Promise<Tokens> {
    const hashedPassword = await this.passwordService.hashPassword(
      payload.password,
    );

    const isExist = await this.userService.findByEmail(payload.email);

    if (isExist) {
      throw new HttpException(
        { message: 'Пользователь с таким email уже существует' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.userService.createUser({
      email: payload.email,
      password: hashedPassword,
      avatar: this.getAvatar(),
      name: this.getName(payload.email),
    });

    return this.generateTokens({
      userId: user._id,
    });
  }

  async signIn(email: string, password: string): Promise<Tokens> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new HttpException(
        { message: 'Неправильный логин или пароль' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const passwordValid = await this.passwordService.validatePassword(
      password,
      user.password,
    );

    if (!passwordValid) {
      throw new HttpException(
        { message: 'Неправильный логин или пароль' },
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.generateTokens({
      userId: user.id,
    });
  }

  async signInGoogle(code: string): Promise<Tokens> {
    const oAuth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'postmessage',
    );

    const { tokens } = await oAuth2Client.getToken(code);

    const decodedUser = this.jwtService.decode(tokens.id_token) as any;

    const user = await this.userService.findByEmail(decodedUser.email);

    if (!user) {
      const newUser = await this.userService.createUser({
        googleId: decodedUser.sub,
        name: decodedUser.name,
        email: decodedUser.email,
        avatar: decodedUser.picture,
      });

      return this.generateTokens({
        userId: newUser._id,
      });
    }

    return this.generateTokens({
      userId: user._id,
    });
  }

  async validateUser(userId: string): Promise<User> {
    return await this.userService.findById(userId);
  }

  async checkIsNewUser(email: string): Promise<{ isNewUser: boolean }> {
    const user = await this.userService.findByEmail(email);
    const isNewUser = !user;

    return { isNewUser };
  }

  getName(email: string): string {
    const [name] = email.split('@');

    return name;
  }

  private generateAccessToken(payload: { userId: string }): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get('AT_SECRET'),
      expiresIn: '30m',
    });
  }

  private generateRefreshToken(payload: { userId: string }): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get('RT_SECRET'),
      expiresIn: '30d',
    });
  }

  getUserFromToken(token: string): Promise<User> {
    const id = this.jwtService.decode(token)['userId'];
    return this.userService.findById(id);
  }

  generateTokens(payload: { userId: string }): Tokens {
    const tokens = {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };

    return tokens;
  }

  refreshToken(token: string) {
    try {
      const { userId } = this.jwtService.verify(token, {
        secret: this.configService.get('RT_SECRET'),
      });

      return this.generateTokens({ userId });
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  private getAvatar(): string {
    const random = uuid();
    const apiKey = this.configService.get('MULTIAVATAR_API_KEY');

    return `https://api.multiavatar.com/${random}.png?apikey=${apiKey}`;
  }
}
