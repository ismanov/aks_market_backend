import * as _ from 'lodash';
import { akeneoConfig, catalogConfig } from '../../config';
import api from '../../api/akeneo';

import { mongoClientWrapper } from '../../api/mongo';
import { syncFilesTask } from '../../utils';

const fileAttributes = ['images'];

const sync = async (dbName: string) => {
  const { data: clientData } = await api.authentificationByPassword();

  const filesTasks = _.flatten(
    _.map(
      _.pick(akeneoConfig.products.attributes, fileAttributes),
      (items, key) => {
        return _.map(items, (i) => {
          return syncFilesTask(
            clientData,
            mongoClientWrapper,
            dbName,
            'products',
            `${key}.${i}`,
            './static',
            api.downloadMediaFile,
          );
        });
      },
    ),
  );

  await Promise.all(filesTasks);
};

export const syncFiles = () => {
  sync(catalogConfig.b2b.dbName)
    .then(() => process.exit(0))
    .catch((error: Error) => {
      console.log(`[Sync: ERROR] ${error.message}`, { error });
      process.exit(1);
    });
};
