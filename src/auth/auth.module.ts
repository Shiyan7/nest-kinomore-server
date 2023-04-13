import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AtStrategy, RtStrategy } from 'src/common/strategies';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  providers: [AuthService, AtStrategy, RtStrategy],
  controllers: [AuthController],
  imports: [UserModule, JwtModule],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
