import { CreateVerificationDto } from './dto/create-verification.dto';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Verification } from './schemas/verification.schema';
import { ConfirmVerificationDto } from './dto/confirm-verification.dto';

@Injectable()
export class VerificationService {
  constructor(
    @InjectModel('VerificationCodes')
    private readonly verificationModel: Model<Verification>,
  ) {}

  async create(createVerificationDto: CreateVerificationDto) {
    const createdVerification = new this.verificationModel({
      code: createVerificationDto.code,
      phone: createVerificationDto.phone,
    });
    return await createdVerification.save();
  }

  async confirm(confirmVerificationDto: ConfirmVerificationDto) {
    const verification = await this.verificationModel.findById({
      _id: confirmVerificationDto.verificationId,
    });

    if (verification) {
      if (
        verification._id.toString() === confirmVerificationDto.verificationId &&
        verification.code === confirmVerificationDto.code
      ) {
        if (Date.now() - verification.createdDate > 90000) {
          await verification.remove();
          throw new HttpException(
            {
              status: HttpStatus.NOT_FOUND,
              error: 'Time out',
            },
            HttpStatus.NOT_FOUND,
          );
        }
        const pNumber = String(verification.phone);
        verification.remove();
        return pNumber;
      }
      verification.attemptsNumber += 1;
      await verification.save();
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error:
            verification.code === confirmVerificationDto.code
              ? 'bad request'
              : 'Invalid confirmation code',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    throw new HttpException(
      {
        status: HttpStatus.NOT_FOUND,
        error: 'Time out',
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
