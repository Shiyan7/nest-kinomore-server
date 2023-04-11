import { CookieOptions } from 'express';
import { HALF_HOUR, ONE_MONTH } from 'src/common/token.const';

export const refreshTokenConfig: CookieOptions = {
  maxAge: ONE_MONTH,
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
};

export const accessTokenConfig: CookieOptions = {
  maxAge: HALF_HOUR,
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
};
