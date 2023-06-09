import { Controller, Get, UseGuards } from '@nestjs/common';
import { AtGuard } from 'src/auth/guards/at.guard';
import { UserService } from './user.service';
import { GetCurrentUserId } from 'src/common/decorators/get-current-userId.decorator';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AtGuard)
  @Get('/me')
  async getMe(@GetCurrentUserId() userId: string) {
    return this.userService.getMe(userId);
  }
}
