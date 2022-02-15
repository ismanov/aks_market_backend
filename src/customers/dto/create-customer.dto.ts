import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty()
  readonly fullName: string;

  @ApiProperty()
  readonly phone: string;
}
