import { ApiTags } from '@nestjs/swagger';
import { PaginationQueryDto } from 'common/dto/pagination-query.dto';
import { CategoriesService } from 'categories/categories.service';
import { Controller, Get, Query } from '@nestjs/common';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoryService: CategoriesService) {}

  @Get()
  async getCategories(@Query() queryParams: PaginationQueryDto) {
    const { page, limit, search } = queryParams;
    return this.categoryService.getCategoriesList(page, limit, search);
  }
}
