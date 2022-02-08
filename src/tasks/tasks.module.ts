import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VerificationSchema } from 'src/verification/schemas/verification.schema';
import { TasksService } from './tasks.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'VerificationCodes', schema: VerificationSchema },
    ]),
  ],
  providers: [TasksService],
})
export class TasksModule {}
