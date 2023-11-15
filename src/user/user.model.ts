import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ versionKey: false, timestamps: true })
export class User extends Document {
  _id: ObjectId;

  @Prop()
  googleId: string;

  @Prop()
  email: string;

  @Prop()
  name: string;

  @Prop()
  avatar: string;

  @Prop()
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
