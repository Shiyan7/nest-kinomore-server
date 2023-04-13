import mongoose, { Schema, Document } from 'mongoose';

export interface User {
  _id: string;
  email: string;
  photo: string;
  password: string;
  hashedRt?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    hashedRt: { type: String },
    photo: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    collection: 'users',
    versionKey: false,
  },
);

export const UserDto = mongoose.model<User & Document>('User', UserSchema);
