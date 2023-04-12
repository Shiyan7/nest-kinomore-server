import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserDto, UsersSchema } from 'src/db-schema/user.schema';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserDto.name, schema: UsersSchema }]),
  ],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
