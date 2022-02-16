import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './schemas/product.schema';
import { Model } from 'mongoose';

@Injectable()
export class ProductsService {
  private productTotalCount;
  constructor(@InjectModel('products') private productModel: Model<Product>) {
    this.productModel.count({}, (err, count) => {
      this.productTotalCount = count;
    });
  }

  async getProductsList(
    page = 1,
    limit = 20,
    search = '',
    categoryId?: string,
  ) {
    const findQuery = await this.productModel.aggregate([
      {
        $match: {
          ...(categoryId ? { categories: categoryId } : undefined),
          ...(search
            ? { fullName: { $regex: new RegExp(search, 'i') } }
            : undefined),
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
      {
        $project: {
          _id: 1,
          fullName: 1,
        },
      },
      {
        $facet: {
          totalRecords: [
            {
              $count: 'total',
            },
          ],
          data: [
            {
              $skip: ((page || 1) - 1) * limit,
            },
            {
              $limit: Number(limit || 0),
            },
          ],
        },
      },
    ]);
    const res = findQuery[0];
    res.totalRecords = { total: 0, page, limit, ...res.totalRecords[0] };

    return res;
  }

  async getProductById(id: string) {
    const product = await this.productModel.findById(id);

    if (!product) {
      throw new NotFoundException('product not found');
    }

    return product;
  }
}
