import * as _ from 'lodash';
import { MongoClient } from 'mongodb';

async function createIndexes(error: Error, client: MongoClient) {
  if (error) {
    console.log(`[Mongo: INDEXES] ${error.message}`, { error });

    return;
  }
}

export { createIndexes };
