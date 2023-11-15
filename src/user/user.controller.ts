import { Controller, Get, UseGuards } from '@nestjs/common';
import { GetCurrentUserId } from 'src/common/decorators';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { UserService } from './user.service';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/me')
  async getMe(@GetCurrentUserId() userId: string) {
    return this.userService.getMe(userId);
  }
}
