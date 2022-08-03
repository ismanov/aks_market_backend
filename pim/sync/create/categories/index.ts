import * as _ from 'lodash';
import { MongoClient } from 'mongodb';
import { mongoClientWrapper } from '../../../api/mongo';
import { mongoUpsertMany } from '../../../utils';

const addChildrenCatigories = async (akeneoMongodbName: string) => {
  const getCategories = async (error: Error, client: MongoClient) => {
    if (error) {
      console.log(`[Sync:getCategories CATEGORIES] ${error.message}`, {
        error,
      });

      return;
    }

    const collection = client.db(akeneoMongodbName).collection('categories');
    return collection.find().toArray();
  };

  const items = await mongoClientWrapper(getCategories);
  const igp = _.groupBy(items, 'parent');

  const ic = _.map(items, (i: {}) => {
    return _.assign(i, {
      childrens: _.map(_.get(igp, _.get(i, '_id')), (g: {}) => {
        return _.get(g, '_id');
      }),
    });
  });

  return mongoClientWrapper(
    mongoUpsertMany(akeneoMongodbName, 'categories', '_id', ic),
  );
};

const addCategoriesHierarchy = async (
  akeneoMongodbName: string,
  rootCategory: string,
) => {
  const getCategoryChildrens =
    (id: string) => async (error: Error, client: MongoClient) => {
      if (error) {
        console.log(`[Sync:getCategoryChildrens CATEGORIES] ${error.message}`, {
          error,
        });

        return;
      }

      const collection = client.db(akeneoMongodbName).collection('categories');
      const category = await collection.findOne(
        {
          _id: id,
        },
        {
          projection: {
            childrens: 1,
          },
        },
      );

      return _.get(category, 'childrens', []);
    };

  // const removeCategoriesWithoutRoot = async (
  //   error: Error,
  //   client: MongoClient
  // ) => {
  //   if (error) {
  //     console.log(
  //       `[Sync:removeCategoriesWithoutRoot CATEGORIES] ${error.message}`,
  //       {
  //         error
  //       }
  //     );

  //     return;
  //   }

  //   const collection = client.db(akeneoMongodbName).collection("categories");
  //   return collection.remove({
  //     root: {
  //       $exists: false
  //     }
  //   });
  // };

  const setCategoryHierarchy =
    (ch: [string], lv: number) => async (error: Error, client: MongoClient) => {
      if (error) {
        console.log(`[Sync:setCategoryHierarchy CATEGORIES] ${error.message}`, {
          error,
        });

        return;
      }

      const collection = client.db(akeneoMongodbName).collection('categories');
      const batch = collection.initializeUnorderedBulkOp();

      for (const id of ch) {
        batch
          .find({ _id: id })
          .upsert()
          .updateOne({
            $set: {
              root: rootCategory,
              level: lv,
              enabled: true,
            },
          });
      }

      return batch.execute();
    };

  const run = async (ch: [string], lv: number) => {
    if (ch.length > 0) {
      await mongoClientWrapper(setCategoryHierarchy(ch, lv));

      for (const id of ch) {
        const c = await mongoClientWrapper(getCategoryChildrens(id));
        await run(c, lv + 1);
      }
    }

    // await mongoClientWrapper(removeCategoriesWithoutRoot);
  };

  const childrens = await mongoClientWrapper(
    getCategoryChildrens(rootCategory),
  );

  return run(childrens, 1);
};

const addAttributesCategories = async (akeneoMongodbName: string) => {
  const getAttributesIds = async (error: Error, client: MongoClient) => {
    if (error) {
      console.log(
        `[Sync:addAttributesCategories CATEGORIES] ${error.message}`,
        { error },
      );

      return;
    }

    const collection = client.db(akeneoMongodbName).collection('attributes');
    return collection
      .find()
      .project({ _id: 1 })
      .map((item) => _.get(item, '_id'))
      .toArray();
  };

  const getAttributeCategories =
    (id: string) => async (error: Error, client: MongoClient) => {
      if (error) {
        console.log(
          `[Sync:getAttributeCategories CATEGORIES] ${error.message}`,
          {
            error,
            id,
          },
        );

        return;
      }

      const collection = client.db(akeneoMongodbName).collection('products');

      const categories: string[] = await collection
        .find({ [`attributes.${id}`]: { $exists: true } })
        .project({ categories: 1 })
        .map((item) => _.get(item, 'categories'))
        .toArray();

      return _.uniq(_.flatten(categories));
    };

  const setArrtibutesCategories =
    (id: string, categories: []) =>
    async (error: Error, client: MongoClient) => {
      if (error) {
        console.log(
          `[Sync:setArrtibutesCategories CATEGORIES] ${error.message}`,
          { error },
        );

        return;
      }

      const collection = client.db(akeneoMongodbName).collection('attributes');

      return collection.updateOne(
        { _id: id },
        {
          $set: {
            categories,
          },
        },
      );
    };

  const attributesIds = await mongoClientWrapper(getAttributesIds);

  for (const id of attributesIds) {
    const categories = await mongoClientWrapper(getAttributeCategories(id));
    if (categories) {
      await mongoClientWrapper(setArrtibutesCategories(id, categories));
    }
  }
};

const copyCategories = async (
  akeneoMongodbName: string,
  siteMongodbName: string,
  rootCategory: string,
) => {
  const getCollection =
    (collName: string) => async (error: Error, client: MongoClient) => {
      if (error) {
        console.log(`[Sync:getCollection CATEGORIES] ${error.message}`, {
          error,
        });

        return;
      }

      const collection = client.db(akeneoMongodbName).collection(collName);
      return collection.find({ root: rootCategory }).toArray();
    };
  const categories = await mongoClientWrapper(getCollection('categories'));

  return mongoClientWrapper(
    mongoUpsertMany(siteMongodbName, 'categories', '_id', categories, true),
  );
};

export {
  addChildrenCatigories,
  addCategoriesHierarchy,
  addAttributesCategories,
  copyCategories,
};
