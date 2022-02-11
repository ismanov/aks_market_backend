import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { VerificationSchema } from 'verification/schemas/verification.schema';
import { VerificationService } from './verification.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'VerificationCodes', schema: VerificationSchema },
    ]),
  ],
  providers: [VerificationService],
  exports: [VerificationService],
})
export class VerificationModule {}
