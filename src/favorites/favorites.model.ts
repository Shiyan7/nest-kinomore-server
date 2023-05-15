import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FavoriteDocument = Favorite & Document;

@Schema({ versionKey: false, timestamps: true })
export class Favorite extends Document {
  @Prop()
  userId: string;

  @Prop()
  items: string[];
}

export const FavoriteSchema = SchemaFactory.createForClass(Favorite);
