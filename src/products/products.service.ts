import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
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

  async findAll(page = 1, limit = 20) {
    const findQuery = await this.productModel.aggregate([
      {
        $match: {
          categories: 'f860b324e7a137edb2aae5b65f966a05',
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
              $skip: page * limit,
            },
            {
              $limit: limit,
            },
          ],
        },
      },
    ]);

    return findQuery[0];
  }
}
