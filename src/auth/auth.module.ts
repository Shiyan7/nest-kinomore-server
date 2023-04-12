import { forwardRef } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserDto, UsersSchema } from 'src/db-schema/user.schema';
import { AtStrategy, RtStrategy } from 'src/common/strategies';

@Module({
  providers: [AuthService, AtStrategy, RtStrategy],
  controllers: [AuthController],
  imports: [
    forwardRef(() => UserModule),
    MongooseModule.forFeature([{ name: UserDto.name, schema: UsersSchema }]),
    JwtModule,
    UserModule,
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
