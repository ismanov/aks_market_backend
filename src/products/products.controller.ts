import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Query, Res } from '@nestjs/common';
import { PaginationQueryDto } from 'common/dto/pagination-query.dto';
import { ProductsService } from './products.service';
@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getAllPosts(@Query() { page, limit }: PaginationQueryDto) {
    return this.productsService.findAll(page, limit);
  }
}
