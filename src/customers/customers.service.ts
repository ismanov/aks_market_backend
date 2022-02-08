import { VerificationService } from './../verification/verification.service';
import { Customer } from './schemas/customer.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel('Customers') private readonly customerModel: Model<Customer>,
    private verificationService: VerificationService,
  ) {}

  public async create(createCustomerDto: CreateCustomerDto) {
    const verificationId = await this.verificationService.create({
      code: '1235',
      phone: createCustomerDto.phone,
    });
    if (verificationId) {
      const newCustomer = new this.customerModel(createCustomerDto);
      await newCustomer.save();
      return verificationId;
    }
    throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
