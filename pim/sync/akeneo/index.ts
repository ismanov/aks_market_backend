import * as _ from 'lodash';
import api from '../../api/akeneo';
import { transformCategory } from '../../api/akeneo/categories';
import { transformProduct } from '../../api/akeneo/products';
import { transformAttribute } from '../../api/akeneo/attributes';
import { MongoClient } from 'mongodb';
import { mongoClientWrapper } from '../../api/mongo';
import { syncMongoTask } from '../../utils';

export const syncProducts = async (dbName: string) => {
  const { data: clientData } = await api.authentificationByPassword();

  await mongoClientWrapper(async (error: Error, client: MongoClient) => {
    if (error) {
      console.log(error);
      return;
    }
    await client
      .db(dbName)
      .collection('categories')
      .drop()
      .catch((err) => {
        console.log(err.message);
      });
    await client
      .db(dbName)
      .collection('products')
      .drop()
      .catch((err) => {
        console.log(err.message);
      });
    await client
      .db(dbName)
      .collection('attributes')
      .drop()
      .catch((err) => {
        console.log(err.message);
      });
  });

  await syncMongoTask(
    clientData,
    mongoClientWrapper,
    dbName,
    'categories',
    'code',
    'page',
    100,
    api.getCategories,
    transformCategory,
  );

  await syncMongoTask(
    clientData,
    mongoClientWrapper,
    dbName,
    'products',
    'identifier',
    'search_after',
    100,
    api.getProducts,
    transformProduct,
  );

  await syncMongoTask(
    clientData,
    mongoClientWrapper,
    dbName,
    'attributes',
    'code',
    'page',
    100,
    api.getAttributes,
    transformAttribute,
  );
  return mongoClientWrapper;
};

// sync(akeneoConfig.dbName)
//   .then(() => process.exit(0))
//   .catch((error: Error) => {
//     console.log(`[Sync: ERROR] ${error.message}`, { error });
//     process.exit(1);
//   });
