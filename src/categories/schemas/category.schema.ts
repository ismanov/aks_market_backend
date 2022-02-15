import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { Document } from 'mongoose';

@Schema()
export class Product extends Document {
  @Transform(({ value }) => value.toString())
  _id: string;

  @Prop()
  prices: string;

  @Prop()
  images: Array<string>;

  @Prop()
  fullName: string;

  @Prop()
  categories: string[];
}

export const ProductsSchema = SchemaFactory.createForClass(Product);
