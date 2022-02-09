import * as _ from 'lodash';
import { FilterQuery, MongoClient } from 'mongodb';

import { mongoClientWrapper } from '../../../api/mongo';
import { akeneoConfig, catalogConfig } from '../../../config';

import { IAttribute } from '../../../types';
import { mongoUpsertMany } from '../../../utils';

const normalizeProductAttributes = async (
  akeneoMongodbName: string,
  siteMongodbName: string,
  categoriesRoot: string,
) => {
  const getCollection =
    (collName: string, query?: FilterQuery<any>) =>
    async (error: Error, client: MongoClient) => {
      if (error) {
        console.log(`[Sync:getCollection ${collName}] ${error.message}`, {
          error,
        });

        return;
      }

      const collection = client.db(akeneoMongodbName).collection(collName);
      return collection.find(query || {}).toArray();
    };

  const dropCollection =
    (collName: string) => async (error: Error, client: MongoClient) => {
      if (error) {
        console.log(`[Sync:dropCollection ${collName}] ${error.message}`, {
          error,
        });

        return;
      }

      const collection = client.db(siteMongodbName).collection(collName);
      return collection.drop();
    };

  const getCategoriesByLevel =
    (level: number) => async (error: Error, client: MongoClient) => {
      if (error) {
        console.log(
          `[Sync:getCategoriesIdsByLevel CATEGORIES] ${error.message}`,
          { error },
        );

        return;
      }

      const collection = client.db(akeneoMongodbName).collection('categories');
      return collection.find({ level, root: categoriesRoot }).toArray();
    };

  const createAtttibute = (
    na: any[],
    fm: any[],
    attribute: any,
    productId: string,
    categoryId: string,
    key: string,
    value: string,
    type: string,
    suffix: string,
  ) => {
    const id = `${key}_${suffix}`;
    const family = _.find(fm, ['_id', categoryId]);
    const val = _.trim(value).normalize().replace(/\s+/g, ' ');

    let newAttribute = _.find(na, ['_id', id]);

    if (!newAttribute) {
      newAttribute = _.defaults(
        {
          _id: id,
          [type]: suffix,
          values: {},
        },
        _.pick(attribute, ['group', 'name', 'type']),
      );

      na.push(newAttribute);
    }

    if (family && _.includes(_.get(family, 'attributes', []), key)) {
      _.assign(newAttribute, {
        filter: true,
      });
    }

    if (val) {
      if (!newAttribute.values[val]) {
        switch (newAttribute.type) {
          case 'pim_catalog_text':
            newAttribute.values[val] = [productId];
            break;
          case 'pim_catalog_boolean':
            newAttribute.values[val] = [productId];
            break;

          default:
            break;
        }
      } else {
        switch (newAttribute.type) {
          case 'pim_catalog_text':
            newAttribute.values[val].push(productId);
            break;
          case 'pim_catalog_boolean':
            newAttribute.values[val].push(productId);
            break;

          default:
            break;
        }
      }
    }
  };

  const newAttributes: any[] = [];
  const categories = await mongoClientWrapper(getCategoriesByLevel(2));
  const attributes = await mongoClientWrapper(getCollection('attributes'));
  const families = await mongoClientWrapper(getCollection('families'));

  const numericAttributes = _.compact(
    _.map(attributes, (attribute, key) => {
      if (_.get(attribute, 'type') === 'pim_catalog_number') {
        return _.get(attribute, '_id');
      }
    }),
  );

  const products = await mongoClientWrapper(getCollection('products'));

  const ps = _.concat(
    _.compact(
      _.map(akeneoConfig.products.attributes, (c, k) =>
        _.size(c) > 1 ? k : null,
      ),
    ),
  );

  const pc = _.map(products, (product) => {
    const productEnabled = _.get(product, 'enabled', false);
    const productId = _.get(product, '_id');
    const categoryId = _.first(
      _.filter(_.get(product, 'categories'), (c) =>
        _.find(categories, ['_id', c]),
      ),
    );
    const brandId = _.get(product, 'brand');

    return _.reduce(
      _.map(product, (props, key) => {
        if (key === 'name') {
          const n = _.split(props, '|');

          return {
            name: _.trim(props),
            model: _.size(n) > 1 ? n[1] : '',
          };
        }

        if (key === 'stocks') {
          const s = _.sum(
            _.map(
              _.values(
                _.pick(props, [
                  '4305385d3ac111e29878001517d28cb0',
                  '4305385e3ac111e29878001517d28cb0',
                ]),
              ),
              _.parseInt,
            ),
          );

          return {
            stocksSummary: s > 0 ? (s > 10 ? '> 10' : '< 10') : '0',
          };
        }

        if (key === 'prices') {
          return {
            [key]: _.reduce(
              _.map(props, (v, k) => {
                const attribute = _.find(attributes, ['_id', k]);
                const newAttribute: IAttribute = _.find(newAttributes, [
                  '_id',
                  k,
                ]);

                if (attribute && !newAttribute) {
                  newAttributes.push(attribute);
                }

                return {
                  [k]: parseFloat(v),
                };
              }),
              _.merge,
              {},
            ),
          };
        }

        if (key === 'categories') {
          return {
            categoryId,
            categoryName: _.get(
              _.find(categories, ['_id', categoryId]),
              'name',
            ),
            [key]: [categoryId],
          };
        }

        if (key === 'attributes') {
          return {
            [key]: _.reduce(
              _.map(props, (v, k) => {
                const attribute = _.find(attributes, ['_id', k]);

                if (attribute && productEnabled) {
                  createAtttibute(
                    newAttributes,
                    families,
                    attribute,
                    productId,
                    categoryId,
                    k,
                    v,
                    'category',
                    categoryId,
                  );
                  createAtttibute(
                    newAttributes,
                    families,
                    attribute,
                    productId,
                    categoryId,
                    k,
                    v,
                    'brand',
                    brandId,
                  );
                }

                if (_.includes(numericAttributes, k)) {
                  return {
                    [k]: {
                      name: _.get(attribute, 'name'),
                      value: parseFloat(v),
                    },
                  };
                }

                if (_.startsWith(k, 'parser_yandexmarket_')) {
                  return {
                    [k]: {
                      name: _.get(attribute, 'name'),
                      value: _.trim(v, ' '),
                    },
                  };
                }

                return {
                  [k]: {
                    name: _.get(attribute, 'name'),
                    value: v,
                  },
                };
              }),
              _.assign,
              {},
            ),
          };
        }

        if (_.includes(ps, key)) {
          return {
            [key]: _.reduce(
              _.map(props, (v, k) => {
                if (_.includes(numericAttributes, k)) {
                  return {
                    [k]: parseFloat(v),
                  };
                }

                if (_.startsWith(k, 'parser_yandexmarket_')) {
                  return {
                    [k]: _.trim(v, ' '),
                  };
                }

                return {
                  [k]: v,
                };
              }),
              _.assign,
              {},
            ),
          };
        }

        return {
          [key]: props,
        };
      }),
      _.merge,
      {},
    );
  });

  await mongoClientWrapper(dropCollection('attributes'));

  await mongoClientWrapper(
    mongoUpsertMany(
      siteMongodbName,
      'attributes',
      '_id',
      _.map(newAttributes, (attribute) => {
        const size = _.size(attribute.values);

        return _.assign(attribute, {
          sort: _.size(_.flatten(_.values(attribute.values))),
          size,
        });
      }),
      true,
    ),
  );

  return mongoClientWrapper(
    mongoUpsertMany(siteMongodbName, 'products', '_id', pc, true),
  );
};

export { normalizeProductAttributes };
