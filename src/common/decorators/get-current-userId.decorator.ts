import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/user/user.model';

export const GetCurrentUserId = createParamDecorator(
  (_, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as User;

    return user._id;
  },
);
