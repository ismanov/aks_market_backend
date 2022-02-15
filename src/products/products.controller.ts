import { ProductSearchDto } from 'products/dto/productSearch.dto';
import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getProducts(@Query() queryParams: ProductSearchDto) {
    const { page, limit, search, categoryId } = queryParams;
    return this.productsService.getProductsList(
      page,
      limit,
      search,
      categoryId,
    );
  }
}
