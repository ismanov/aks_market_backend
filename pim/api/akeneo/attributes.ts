import * as _ from 'lodash';

const transformAttribute = (attribute: {}) => {
  return _.assign(_.pick(attribute, ['code', 'type', 'group']), {
    name: _.get(attribute, 'labels.ru_RU'),
  });
};

export { transformAttribute };
