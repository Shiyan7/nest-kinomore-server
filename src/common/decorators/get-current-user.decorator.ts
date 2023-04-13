import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type CurrUser = {
  sub: string;
  email: string;
  iat: number;
  exp: number;
  refreshToken: string;
};

export const GetCurrentUser = createParamDecorator(
  (data: string | undefined, context: ExecutionContext): CurrUser => {
    const request = context.switchToHttp().getRequest();

    if (!data) {
      return request.user;
    }

    return request.user[data];
  },
);
