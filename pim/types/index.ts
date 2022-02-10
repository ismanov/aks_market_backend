export interface ICatalogConfig {
  dbName: string;
  categories: {
    root: string;
  };
  price: {
    default: string;
    primary: string;
  };
}

export interface IAttribute {
  _id: string;
  hash?: string;

  category?: string | null;
  brand?: string | null;

  values?: { [v: string]: string[] };
  group: string;
  name: string;
  type: string;
}
export interface ISmsConfig {
  api: {
    url: string;
    key: string;
    sender: string;
  };
}
