import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';

import { sendSms } from 'api/sms';

import { generateRandomCode } from 'common/utils';

import { CreateVerificationDto } from 'verification/dto/create-verification.dto';
import { ConfirmVerificationDto } from 'verification/dto/confirm-verification.dto';
import { Verification } from 'verification/schemas/verification.schema';

@Injectable()
export class VerificationService {
  private logger = new Logger();
  constructor(
    @InjectModel('VerificationCodes')
    private readonly verificationModel: Model<Verification>,
  ) {}

  async create(createVerificationDto: CreateVerificationDto) {
    try {
      const verificationCode = generateRandomCode(5);
      this.logger.debug(verificationCode);
      const createdVerification = new this.verificationModel({
        code: verificationCode,
        ...createVerificationDto,
      });
      const res: any = await sendSms(
        createVerificationDto.phone,
        String(verificationCode),
      );
      console.log(res);
      if (res.status === 'OK') {
        return await createdVerification.save();
      } else {
        throw new Error(
          String(res.sms[createVerificationDto.phone]['status_text']),
        );
      }
    } catch (error) {
      this.logger.error(String(error.message));
      console.log(error);
    }
  }

  async confirm(confirmVerificationDto: ConfirmVerificationDto) {
    const verification = await this.verificationModel.findById(
      confirmVerificationDto.verificationId,
    );

    if (verification) {
      console.log(verification);

      if (
        verification._id.toString() === confirmVerificationDto.verificationId &&
        String(verification.code) === String(confirmVerificationDto.code)
      ) {
        console.log(Date.now() - verification.createdDate);
        // if (Date.now() - verification.createdDate > 180000) {
        //   await verification.remove();
        //   throw new HttpException(
        //     {
        //       status: HttpStatus.NOT_FOUND,
        //       error: 'Time out',
        //     },
        //     HttpStatus.NOT_FOUND,
        //   );
        // }
        const res = {
          phone: verification.phone,
          fullName: verification.fullName,
        };

        verification.remove();
        console.log('>>>user>>', res);
        return res;
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
