import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AtStrategy } from 'src/common/strategies/at.strategy';
import { RtStrategy } from 'src/common/strategies/rt.strategy';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  providers: [AuthService, AtStrategy, RtStrategy],
  controllers: [AuthController],
  imports: [
    forwardRef(() => UserModule),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY || '',
    }),
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
