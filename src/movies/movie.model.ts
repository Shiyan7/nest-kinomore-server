import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false, timestamps: true })
export class Movie {
  @Prop()
  id: number;

  @Prop()
  year: number;

  @Prop()
  rating: string;

  @Prop()
  title: string;

  @Prop()
  genre: string;

  @Prop()
  scale: string;

  @Prop()
  image: string;

  @Prop()
  trailer: string;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
