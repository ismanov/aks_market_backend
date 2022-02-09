/* eslint-disable @typescript-eslint/ban-types */
import * as _ from 'lodash';

function getBasicAuthorizationHeader(config: {}, ...args: string[]) {
  return `Basic ${Buffer.from(
    _.join(
      _.map(args, (arg) => {
        return _.get(config, arg);
      }),
      ':',
    ),
  ).toString('base64')}`;
}
function getBearerAuthorizarionHeader(config: {}, ...args: string[]) {
  return `Bearer ${_.join(
    _.map(args, (arg) => {
      return _.get(config, arg);
    }),
    '',
  )}`;
}

export { getBasicAuthorizationHeader, getBearerAuthorizarionHeader };
