import { Controller, Get, UseGuards } from '@nestjs/common';
import { AtGuard } from 'src/auth/guards/at.guard';
import { GetCurrentUser } from 'src/common/decorators/get-current-user.decorator';
import { UserService } from './user.service';
import { User } from 'src/db-schema/user.schema';

@Controller('user')
export class UserController {
  constructor(private userSerivce: UserService) {}

  @UseGuards(AtGuard)
  @Get('me')
  getMe(@GetCurrentUser() user: User) {
    return this.userSerivce.getMe(user.id);
  }
}
