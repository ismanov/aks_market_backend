import { akeneoConfig, catalogConfig } from '../../config';
import {
  addAttributesCategories,
  addCategoriesHierarchy,
  addChildrenCatigories,
  copyCategories,
} from './categories';
import { normalizeProductAttributes } from './products';

export const create = async () => {
  await addChildrenCatigories(akeneoConfig.dbName);

  await addCategoriesHierarchy(
    akeneoConfig.dbName,
    catalogConfig.b2b.categories.root,
  );
  await addAttributesCategories(akeneoConfig.dbName);

  await normalizeProductAttributes(
    akeneoConfig.dbName,
    catalogConfig.b2b.dbName,
    catalogConfig.b2b.categories.root,
  );

  await copyCategories(
    akeneoConfig.dbName,
    catalogConfig.b2b.dbName,
    catalogConfig.b2b.categories.root,
  );
};

// create()
//   .then(() => process.exit(0))
//   .catch((error: Error) => {
//     console.log(`[Sync:create ERROR] ${error.message}`, { error: error.stack });
//     process.exit(1);
//   });
