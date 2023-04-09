import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserDto, UsersSchema } from 'src/db-schema/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserDto.name, schema: UsersSchema }]),
    JwtModule,
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
