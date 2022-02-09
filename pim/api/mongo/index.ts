import { connect, MongoClient } from 'mongodb';

import { mongoConfig } from '../../config';

async function mongoClientWrapper(
  cb: (error: Error, client: MongoClient) => any,
) {
  let client;

  try {
    client = await MongoClient.connect(mongoConfig.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    return await cb(null, client);
  } catch (err) {
    return cb(err, null);
  }
}

async function mongoConnect() {
  return connect(mongoConfig.uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

export { mongoClientWrapper, mongoConnect };
