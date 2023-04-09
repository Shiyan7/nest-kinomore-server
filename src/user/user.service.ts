import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDto, User } from 'src/db-schema/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(UserDto.name) private usersModel: Model<User>) {}

  async userByEmail(email: string): Promise<User> {
    const regex = new RegExp(email, 'i');
    return await this.usersModel.findOne({ email: regex });
  }
}
