import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPositive } from 'class-validator';

export class PaginationQueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsPositive()
  limit: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsPositive()
  page: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsPositive()
  search: string;
}
