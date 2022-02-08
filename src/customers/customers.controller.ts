import { CreateCustomerDto } from './dto/create-customer.dto';
import { CustomersService } from './customers.service';
import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('customers')
@Controller('customers')
export class CustomersController {
  constructor(private customersService: CustomersService) {}

  @Post()
  @ApiBody({ type: CreateCustomerDto })
  public async addCustomer(
    @Req() req,
    @Body() createCustomerDto: CreateCustomerDto,
  ) {
    console.log(req, 'req >>>>>>');

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
