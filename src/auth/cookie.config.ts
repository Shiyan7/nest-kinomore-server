import { CookieOptions } from 'express';
import { HALF_HOUR, ONE_MONTH } from 'src/common/token.const';

export const refreshTokenConfig: CookieOptions = {
  maxAge: ONE_MONTH * 1000,
  httpOnly: true,
  secure: false,
  sameSite: 'lax',
};

export const accessTokenConfig: CookieOptions = {
  maxAge: HALF_HOUR * 1000,
  httpOnly: true,
  secure: false,
  sameSite: 'lax',
};
