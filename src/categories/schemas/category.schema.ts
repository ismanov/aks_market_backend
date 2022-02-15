import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { Document } from 'mongoose';

@Schema()
export class Category extends Document {
  @Transform(({ value }) => value.toString())
  _id: string;

  @Prop()
  enabled: boolean;

  @Prop()
  name: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
