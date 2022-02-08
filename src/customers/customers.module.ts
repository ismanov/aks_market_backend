import { VerificationModule } from './../verification/verification.module';
import { CustomerSchema } from './schemas/customer.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';

import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Customers', schema: CustomerSchema }]),
    VerificationModule,
  ],
  controllers: [CustomersController],
  providers: [CustomersService],
})
export class CustomersModule {}
