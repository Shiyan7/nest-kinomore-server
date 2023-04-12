import { Injectable } from '@nestjs/common/decorators';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';
import { REFRESH_TOKEN } from 'src/common/token.const';

const cookieExtractFromRequest = (req: any) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies[REFRESH_TOKEN];
  }
  return token;
};

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: cookieExtractFromRequest,
      secretOrKey: 'superSecretRt',
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: any) {
    const refreshToken = cookieExtractFromRequest(req);
    return {
      ...payload,
      refreshToken,
    };
  }
}
