import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ versionKey: false, timestamps: true })
export class User extends Document {
  _id: string;

  @Prop()
  email: string;

  @Prop()
  photo: string;

  @Prop()
  password: string;

  @Prop()
  hashedRt: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
