import * as _ from 'lodash';

import { akeneoConfig } from '../../config';

function getPath(key: string): string {
  let p = 'attributes';

  _.forEach(akeneoConfig.products.attributes, (items, k) => {
    if (_.includes(items, key)) {
      p = k;
    }
  });

  return p;
}

const transformProduct = (product: {}) => {
  const ps = _.concat(
    _.compact(
      _.map(akeneoConfig.products.attributes, (c, k) =>
        _.size(c) > 1 ? k : null,
      ),
    ),
    ['attributes'],
  );
  return _.assign(
    _.reduce(
      _.map(
        _.groupBy(
          _.map(_.get(product, 'values'), (value, key) => {
            return {
              id: key,
              path: getPath(key),
              data: _.get(_.first(value), 'data'),
            };
          }),
          'path',
        ),
        (props, key) => {
          if (_.size(props) > 1 || _.includes(ps, key)) {
            return {
              [key]: _.reduce(
                _.map(props, (prop) => {
                  return {
                    [_.get(prop, 'id')]: _.get(prop, 'data'),
                  };
                }),
                _.merge,
                {},
              ),
            };
          } else {
            return {
              [key]: _.get(_.first(props), 'data'),
            };
          }
        },
      ),
      _.merge,
      {},
    ),
    _.pick(product, [
      'identifier',
      'family',
      'categories',
      'enabled',
      'updated',
    ]),
  );
};

export { transformProduct };
