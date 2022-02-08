import { ApiProperty } from '@nestjs/swagger';
import { MaxLength, IsNotEmpty, IsString } from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty()
  readonly fullName: string;

  @ApiProperty()
  readonly phone: string;
}
