import { ConfirmVerificationDto } from './../verification/dto/confirm-verification.dto';
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
    const verificationId = await this.verificationService.create(
      createCustomerDto,
    );

    if (verificationId) {
      return verificationId._id.toString();
    }
    throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
  }

  // confirm user phone number
  public async confirmCustomer(confirmVerificationDto: ConfirmVerificationDto) {
    const customer = await this.verificationService.confirm(
      confirmVerificationDto,
    );
    if (customer.phone) {
      const newCustomer = new this.customerModel({ ...customer, active: true });
      console.log(newCustomer);
      return newCustomer.save();
    }
    throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
