import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common/decorators';

@Injectable()
export class AuthGuard extends PassportAuthGuard('jwt') {
  constructor() {
    super();
  }
}
