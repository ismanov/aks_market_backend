import { Cron } from '@nestjs/schedule';
import { Verification } from './../verification/schemas/verification.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel('VerificationCodes')
    private readonly verificationModel: Model<Verification>,
  ) {}

  private readonly logger = new Logger(TasksService.name);
  @Cron('0 10 * * * *')
  private async deleteVerificationCodes() {
    const currentTime = Date.now();
    try {
      const deletedCodes = await this.verificationModel.deleteMany({
        createdDate: { $lt: currentTime - 300000 },
      });
      this.logger.debug(deletedCodes);
    } catch (error) {}
  }
}
