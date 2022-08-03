import * as _ from 'lodash';
import { MongoClient } from 'mongodb';

import { mongoClientWrapper } from '../../api/mongo';
import { catalogConfig } from '../../config';

const fix = async (siteMongodbName: string, pricePrimary: string) => {
  const fixProductsCollection = async (error: Error, client: MongoClient) => {
    if (error) {
      console.log(`[Fix:fixProductsCollection] ${error.message}`, {
        error,
      });

      return;
    }

    const collection = client.db(siteMongodbName).collection('products');
    await collection.updateMany(
      {
        $or: [
          { categoryId: null },
          { name: { $exists: false } },
          { [`prices.${pricePrimary}`]: { $exists: false } },
        ],
      },
      { $set: { enabled: false } },
    );
  };

  const fixAttributesCollection = async (error: Error, client: MongoClient) => {
    if (error) {
      console.log(`[Fix:fixAttributesCollection] ${error.message}`, {
        error,
      });

      return;
    }

    const collection = client.db(siteMongodbName).collection('attributes');
    await collection.deleteMany({ size: 0, type: 'pim_catalog_text' });
  };

  const fixCategoriesCollection = async (error: Error, client: MongoClient) => {
    if (error) {
      console.log(`[Fix:fixCategoriesCollection] ${error.message}`, {
        error,
      });

      return;
    }

    const categoriesCollection = client
      .db(siteMongodbName)
      .collection('categories');

    const categories = await categoriesCollection
      .find({ childrens: [] })
      .project({ _id: 1 })
      .map((item) => _.get(item, '_id'))
      .toArray();

    const productsCollection = client
      .db(siteMongodbName)
      .collection('products');

    for (const c of categories) {
      const p = await productsCollection.findOne({
        categoryId: c,
        enabled: true,
      });
      if (!p) {
        await categoriesCollection.updateOne(
          { _id: c },
          { $set: { enabled: false } },
        );
      }
    }

    await categoriesCollection.updateOne(
      { _id: 'nonactive' },
      { $set: { enabled: false } },
    );
  };

  await mongoClientWrapper(fixProductsCollection);
  await mongoClientWrapper(fixAttributesCollection);
  await mongoClientWrapper(fixCategoriesCollection);
};

export const runFix = async () => {
  await fix(catalogConfig.b2b.dbName, catalogConfig.b2b.price.primary);
};
