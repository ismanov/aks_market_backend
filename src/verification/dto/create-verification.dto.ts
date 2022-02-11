import { CreateCustomerDto } from './../../customers/dto/create-customer.dto';
import { MaxLength, IsNotEmpty, IsString } from 'class-validator';

export class CreateVerificationDto extends CreateCustomerDto {
  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  readonly phone: string;
}
