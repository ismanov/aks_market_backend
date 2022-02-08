import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Verification extends Document {
  @Prop({ required: true })
  code: string;

  @Prop({ default: Date.now() })
  createdDate: number;
}

export const VerificationSchema = SchemaFactory.createForClass(Verification);
