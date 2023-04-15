import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.model';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async getMe(id: string): Promise<User> {
    return this.userModel.findById(id).select('-password -hashedRt').exec();
  }

  async findByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }

  async createUser(
    email: string,
    password: string,
    photo: string,
  ): Promise<User> {
    const user = new this.userModel({ email, password, photo });
    return user.save();
  }

  async updateUser(user: Partial<User>): Promise<User> {
    return this.userModel
      .findByIdAndUpdate(user._id, user, { new: true })
      .exec();
  }
}
