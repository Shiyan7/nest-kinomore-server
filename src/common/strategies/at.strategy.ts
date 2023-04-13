import { Injectable } from '@nestjs/common/decorators';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ACCESS_TOKEN } from 'src/common/token.const';

type JwtPayload = {
  sub: string;
  email: string;
};

const cookieExtractFromRequest = (req: any) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies[ACCESS_TOKEN];
  }
  return token;
};

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: cookieExtractFromRequest,
      secretOrKey: configService.get('AT_SECRET'),
    });
  }

  validate(payload: JwtPayload) {
    return payload;
  }
}
