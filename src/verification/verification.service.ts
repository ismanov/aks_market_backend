import { CreateVerificationDto } from './dto/create-verification.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Verification } from './schemas/verification.schema';

@Injectable()
export class VerificationService {
  constructor(
    @InjectModel('VerificationCodes')
    private readonly verificationModel: Model<Verification>,
  ) {}

  async create(createVerificationDto: CreateVerificationDto) {
    const createdVerification = new this.verificationModel({
      code: createVerificationDto.code,
    });
    return await createdVerification.save();
  }
}
