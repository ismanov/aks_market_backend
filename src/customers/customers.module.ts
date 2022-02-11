import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';

import { VerificationModule } from 'verification/verification.module';
import { CustomerSchema } from 'customers/schemas/customer.schema';

import { CustomersController } from 'customers/customers.controller';
import { CustomersService } from 'customers/customers.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Customers', schema: CustomerSchema }]),
    VerificationModule,
  ],
  controllers: [CustomersController],
  providers: [CustomersService],
  exports: [CustomersService],
})
export class CustomersModule {}
