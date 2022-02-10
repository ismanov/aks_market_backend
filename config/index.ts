/* eslint-disable @typescript-eslint/ban-types */
import * as fs from 'fs';
import * as path from 'path';

import { TomlReader } from '@sgarciac/bombadil';
import { ICatalogConfig, ISmsConfig } from '../pim/types';

// const environments = ["local", "staging"];
// const { PROJECT_ENV } = process.env;

// if (!PROJECT_ENV || !environments.includes(PROJECT_ENV)) {
//   throw new Error(`PROJECT_ENV: must be one of ${environments}`);
// }

const tomlPath = path.resolve(__dirname, `../../../env/config.toml`);
const toml = fs.readFileSync(tomlPath).toString();

const reader = new TomlReader();

reader.readToml(toml);

export const config: {
  akeneoConfig: {
    dbName: string;
    api: {
      url: string;
    };
    client: {
      id: string;
      secret: string;
      username: string;
      password: string;
    };
    products: {
      attributes: {};
    };
  };
  appConfig: {
    host: string;
    port: number;
    prefix: string;
    salesEmail: string;
  };
  catalogConfig: {
    b2b: ICatalogConfig;
    b2c: ICatalogConfig;
  };

  jwtConfig: {
    secret: string;
    passthrough: boolean;
  };

  mongoConfig: {
    uri: string;
    max: number;
    min: number;
  };

  smsConfig: ISmsConfig;
} = reader.result;
