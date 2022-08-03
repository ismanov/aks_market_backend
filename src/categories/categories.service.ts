import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Category } from 'categories/schemas/category.schema';
import { Model } from 'mongoose';

@Injectable()
export class CategoriesService {
  private categoriesTotalCount;
  constructor(
    @InjectModel('categories') private categoriesModel: Model<Category>,
  ) {
    this.categoriesModel.count({}, (err, count) => {
      this.categoriesTotalCount = count;
    });
  }

  async getCategoriesList(page = 1, limit = 20, search = '') {
    const findQuery = await this.categoriesModel.aggregate([
      {
        $match: {
          enabled: true,
          ...(search
            ? { name: { $regex: new RegExp(search, 'i') } }
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
          name: 1,
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

    const res = {
      data: findQuery[0].data,
      total: 0,
      page,
      limit,
      ...findQuery[0].totalRecords[0],
    };

    return res;
  }
}
