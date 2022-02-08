import { CreateCustomerDto } from './dto/create-customer.dto';
import { CustomersService } from './customers.service';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('customers')
@Controller('customers')
export class CustomersController {
  constructor(private customersService: CustomersService) {}

  @Post()
  public async addCustomer(@Body() createCustomerDto: CreateCustomerDto) {
    const customerDto =
      typeof createCustomerDto === 'string'
        ? JSON.parse(createCustomerDto)
        : createCustomerDto;
    console.log(customerDto);

    try {
      const customer = await this.customersService.create(customerDto);
      return customer;
    } catch (err) {
      return err;
    }
  }
}
