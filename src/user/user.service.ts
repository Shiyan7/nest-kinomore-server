import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './user.model';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async getMe(id: string): Promise<UserDocument> {
    return this.userModel.findById(id).select('-password -_id').exec();
  }

  async findByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<UserDocument> {
    return this.userModel.findById(id).exec();
  }

  async createUser(dto: CreateUserDto): Promise<UserDocument> {
    const user = new this.userModel(dto);
    return user.save();
  }
}
