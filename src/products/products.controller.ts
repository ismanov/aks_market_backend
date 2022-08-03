import { ProductSearchDto } from 'products/dto/productSearch.dto';
import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Param, Query, StreamableFile } from '@nestjs/common';
import { ProductsService } from './products.service';
import { createReadStream } from 'fs';
import { join } from 'path';
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

  @Get(':id')
  async getProductById(@Param('id') id: string) {
    return this.productsService.getProductById(id);
  }

  @Get('image/:filePath')
  getFile(@Param('filePath') filePath: string): StreamableFile {
    const file = createReadStream(join(process.cwd(), `static/big`, filePath));
    return new StreamableFile(file);
  }
}
