import * as _ from 'lodash';

const transformCategory = (category: {}) => {
  return _.assign(_.pick(category, ['code', 'parent']), {
    name: _.get(category, 'labels.ru_RU'),
  });
};

export { transformCategory };
