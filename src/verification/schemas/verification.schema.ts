import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Verification extends Document {
  @Prop({ required: true })
  code: number;

  @Prop({ required: true })
  phone: string;

  @Prop({ default: Date.now() })
  createdDate: number;

  @Prop({ default: 0 })
  attemptsNumber: number;
}

export const VerificationSchema = SchemaFactory.createForClass(Verification);
