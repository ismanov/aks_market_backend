import { PaginationQueryDto } from 'common/dto/pagination-query.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPositive } from 'class-validator';

export class ProductSearchDto extends PaginationQueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsPositive()
  categoryId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsPositive()
  search: string;
}
