import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PasswordService } from './password.service';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { AuthGuard } from './auth.guard';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  providers: [AuthService, PasswordService, JwtStrategy, AuthGuard],
  controllers: [AuthController],
  imports: [UserModule, PassportModule, JwtModule],
  exports: [AuthService],
})
export class AuthModule {}
