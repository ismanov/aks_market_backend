import { config } from './../../config/index';
import { methods } from './constants.api';
import { makeQueryParams } from './helpers.api';
export class Network {
  readonly appJsonContentType = { 'Content-Type': 'application/json' };

  httpGet({ url, params, config }) {
    return fetch(url + makeQueryParams(params), {
      method: methods.GET,
      headers: { ...this.appJsonContentType, ...config },
    });
  }

  httpPost({ url, body, config }) {
    return fetch(url, {
      method: methods.POST,
      headers: { ...this.appJsonContentType, ...config },
      body,
    });
  }
}
