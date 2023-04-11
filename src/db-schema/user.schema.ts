import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';

@Schema({ versionKey: false, timestamps: true })
export class UserDto {
  _id: ObjectId;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({
    type: String,
    required: true,
  })
  password: string;

  @Prop({ type: String, default: '' })
  photo: string;
}

export const UsersSchema = SchemaFactory.createForClass(UserDto);

export type User = UserDto & Document;
