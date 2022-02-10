import hashSum = require('hash-sum');
import * as _ from 'lodash';
import * as fs from 'fs';
import * as sharp from 'sharp';
import * as path from 'path';
import { MongoClient } from 'mongodb';
import { AxiosRequestConfig } from 'axios';
import { mongoClientWrapper } from '../api/mongo';

const mongoUpsertMany =
  (
    dbName: string,
    collectionName: string,
    identifierKey: string,
    items: Array<{}>,
    hash = false,
  ) =>
  async (error: Error, client: MongoClient) => {
    if (error) {
      console.log(error);

      return;
    }

    if (items.length < 1) {
      return;
    }

    try {
      const collection = await client.db(dbName).collection(collectionName);
      const batch = collection.initializeUnorderedBulkOp();

      for (const item of items) {
        const o: {
          _id: string;
          hash?: string;
        } = {
          _id: _.get(item, identifierKey),
        };

        if (hash) {
          try {
            o.hash = hashSum(item);
          } catch (error) {
            console.log(error.message);
          }
        }

        batch
          .find({ _id: o._id })
          .upsert()
          .updateOne({
            $set: _.assign(_.omit(item, identifierKey), o),
          });
      }

      return batch.execute();
    } catch (err) {
      console.log(err);
    }
  };

const syncMongoTask = async (
  clientData: {},
  clientWrapper: typeof mongoClientWrapper,
  dbName: string,
  collectionName: string,
  identifierKey: string,
  paginationType: string,
  limit: number,
  fetchFunc: (clientData: {}, options?: AxiosRequestConfig) => Promise<any>,
  transformationFunc: (item: {}) => {},
) => {
  let items = [];
  let next = true;
  const options: { params: { [name: string]: any } } = {
    params: {
      pagination_type: paginationType,
      [paginationType]: null,
      limit,
    },
  };

  while (next) {
    console.log(
      `syncTask: ${collectionName}#${options.params[paginationType]}`,
    );

    const response = await fetchFunc(clientData, options);
    const itemsData = _.get(response, 'data');

    items = _.map(_.get(itemsData, '_embedded.items'), transformationFunc);

    try {
      await clientWrapper(
        mongoUpsertMany(dbName, collectionName, identifierKey, items),
      );
    } catch (err) {
      console.log(err);
    }

    next = _.has(itemsData, '_links.next');

    if (next) {
      const nextLink = new URL(_.get(itemsData, '_links.next.href'));
      options.params[paginationType] =
        nextLink.searchParams.get(paginationType);
    } else {
      return;
    }
  }
};

const syncFilesTask = async (
  clientData: {},
  clientWrapper: typeof mongoClientWrapper,
  dbName: string,
  collectionName: string,
  attributePath: string,
  writePath: string,
  fetchFunc: (
    clientData: {},
    id: string,
    options?: AxiosRequestConfig,
  ) => Promise<any>,
) => {
  return clientWrapper(async (error: Error, client: MongoClient) => {
    if (error) {
      console.log(error);

      return;
    }

    const collection = client.db(dbName).collection(collectionName);
    const items = await collection
      .find({
        [attributePath]: {
          $exists: true,
        },
      })
      .project({
        _id: 1,
        [attributePath]: 1,
      })
      .toArray();

    const itemsChunk = _.chunk(items, 10);

    for (const chunk of itemsChunk) {
      const tasksChunk = _.map(chunk, async (i) => {
        const id: string | null = _.get(i, '_id');
        const filePath: string | null = _.get(i, attributePath);
        let fileBuffer;

        if (filePath) {
          try {
            const { data: file } = await fetchFunc(clientData, filePath);
            fileBuffer = Buffer.from(file, 'binary');
          } catch (err) {
            console.log(err);
            await collection.update(
              { _id: id },
              { $unset: { [attributePath]: 1 }, $set: { hash: hashSum(id) } },
              { multi: true },
            );
          }

          if (fileBuffer) {
            try {
              const getFilePathLocal = (middle: string) =>
                path.join(writePath, middle, filePath);

              if (!fs.existsSync(getFilePathLocal('big'))) {
                console.log(
                  `syncFilesTask: ${_.size(
                    items,
                  )} ${attributePath}#${filePath} -> ${getFilePathLocal(
                    'big',
                  )}`,
                );
                fs.mkdirSync(path.dirname(getFilePathLocal('big')), {
                  recursive: true,
                });
                fs.writeFileSync(getFilePathLocal('big'), fileBuffer, {
                  flag: 'w',
                });
                fs.mkdirSync(path.dirname(getFilePathLocal('small')), {
                  recursive: true,
                });
                fs.writeFileSync(
                  getFilePathLocal('small'),
                  await sharp(fileBuffer).resize(350).toBuffer(),
                  {
                    flag: 'w',
                  },
                );
              }
            } catch (err) {
              console.log(err);
            }
          }
        }
      });

      await Promise.all(tasksChunk);

      await collection.update(
        {
          $and: [
            { 'images.1c_photo': null },
            { 'images.1c_photo': { $exists: true } },
          ],
        },
        { $unset: { 'images.1c_photo': 1 } },
        { multi: true },
      );
    }
  });
};

export { syncMongoTask, syncFilesTask, mongoUpsertMany };
