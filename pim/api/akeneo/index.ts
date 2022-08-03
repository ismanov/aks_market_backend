/* eslint-disable @typescript-eslint/ban-types */
import axios, { AxiosRequestConfig } from 'axios';
import * as _ from 'lodash';
import * as path from 'path';
import * as fs from 'fs';
import FormData from 'form-data';
import { akeneoConfig } from '../../config';

import {
  getBasicAuthorizationHeader,
  getBearerAuthorizarionHeader,
} from './utils';

const basicAuthorizationHeader = getBasicAuthorizationHeader(
  akeneoConfig,
  'client.id',
  'client.secret',
);

const api = axios.create({
  baseURL: akeneoConfig.api.url,
});

const apiRequest = async (
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  message: string,
  url: string,
  options?: AxiosRequestConfig,
) => {
  const formatApiResponse = (
    type: string,
    { status, statusText, data }: any,
  ) => {
    return {
      status: type,
      statusCode: status,
      message: `${message}: ${statusText}`,
      data,
    };
  };

  try {
    const { status, statusText, data } = await api.request(
      _.assign(
        {
          url,
          method,
        },
        options,
      ),
    );

    if (status >= 200 && status < 300) {
      return formatApiResponse('success', {
        status,
        statusText,
        data,
      });
    }

    const response = formatApiResponse('fail', {
      status,
      statusText,
      data,
    });

    console.log(response);

    return response;
  } catch (err) {
    console.log(err);
    return err;
  }
};

const getApiRequest = (
  message: string,
  url: string,
  options?: AxiosRequestConfig,
) => apiRequest('GET', message, url, options);
const postApiRequest = (
  message: string,
  url: string,
  options?: AxiosRequestConfig,
) => apiRequest('POST', message, url, options);
const patchApiRequest = (
  message: string,
  url: string,
  options?: AxiosRequestConfig,
) => apiRequest('PATCH', message, url, options);
const deleteApiRequest = (
  message: string,
  url: string,
  options?: AxiosRequestConfig,
) => apiRequest('DELETE', message, url, options);

const authentificationByPassword = () =>
  postApiRequest('Akeneo authentication by password', '/api/oauth/v1/token', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: basicAuthorizationHeader,
    },
    data: {
      username: akeneoConfig.client.username,
      password: akeneoConfig.client.password,
      grant_type: 'password',
    },
  });

const authentificationByRefreshToken = (clientData: {}) =>
  postApiRequest(
    'Akeneo authentication by refresh token',
    '/api/oauth/v1/token',
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: basicAuthorizationHeader,
      },
      data: {
        refresh_token: _.get(clientData, 'refresh_token'),
        grant_type: 'refresh_token',
      },
    },
  );

const getCategory = (
  clientData: {},
  id: string,
  options?: AxiosRequestConfig,
) =>
  getApiRequest(
    'Akeneo get category by id',
    `/api/rest/v1/categories/${id}`,
    _.assign(
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: getBearerAuthorizarionHeader(
            clientData,
            'access_token',
          ),
        },
      },
      options,
    ),
  );

const postCategory = (clientData: {}, options?: AxiosRequestConfig) =>
  postApiRequest(
    'Akeneo get category by id',
    `/api/rest/v1/categories`,
    _.assign(
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: getBearerAuthorizarionHeader(
            clientData,
            'access_token',
          ),
        },
      },
      options,
    ),
  );

const getCategories = (clientData: {}, options?: AxiosRequestConfig) =>
  getApiRequest(
    'Akeneo get categories',
    '/api/rest/v1/categories',
    _.assign(
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: getBearerAuthorizarionHeader(
            clientData,
            'access_token',
          ),
        },
      },
      options,
    ),
  );

const patchProduct = (
  clientData: {},
  id: string,
  options?: AxiosRequestConfig,
) =>
  patchApiRequest(
    'Akeneo get product by id',
    `/api/rest/v1/products/${id}`,
    _.assign(
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: getBearerAuthorizarionHeader(
            clientData,
            'access_token',
          ),
        },
      },
      options,
    ),
  );

const deleteProduct = (clientData: {}, id: string) =>
  deleteApiRequest(
    'Akeneo delete product by id',
    `/api/rest/v1/products/${id}`,
    _.assign({
      headers: {
        'Content-Type': 'application/json',
        Authorization: getBearerAuthorizarionHeader(clientData, 'access_token'),
      },
    }),
  );

const getProducts = (clientData: {}, options?: AxiosRequestConfig) =>
  getApiRequest(
    'Akeneo get products',
    '/api/rest/v1/products',
    _.assign(
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: getBearerAuthorizarionHeader(
            clientData,
            'access_token',
          ),
        },
      },
      options,
    ),
  );

const getProduct = (clientData: {}, id: string, options?: AxiosRequestConfig) =>
  getApiRequest(
    'Akeneo get product by id',
    `/api/rest/v1/products/${id}`,
    _.assign(
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: getBearerAuthorizarionHeader(
            clientData,
            'access_token',
          ),
        },
      },
      options,
    ),
  );

const getAttribute = (
  clientData: {},
  id: string,
  options?: AxiosRequestConfig,
) =>
  getApiRequest(
    'Akeneo get attribute by id',
    `/api/rest/v1/attributes/${id}`,
    _.assign(
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: getBearerAuthorizarionHeader(
            clientData,
            'access_token',
          ),
        },
      },
      options,
    ),
  );

const getAttributes = (clientData: {}, options?: AxiosRequestConfig) =>
  getApiRequest(
    'Akeneo get attributes',
    '/api/rest/v1/attributes',
    _.assign(
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: getBearerAuthorizarionHeader(
            clientData,
            'access_token',
          ),
        },
      },
      options,
    ),
  );

const postAttribute = (clientData: {}, options?: AxiosRequestConfig) =>
  postApiRequest(
    'Akeneo get attributes',
    '/api/rest/v1/attributes',
    _.assign(
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: getBearerAuthorizarionHeader(
            clientData,
            'access_token',
          ),
        },
      },
      options,
    ),
  );

const getMediaFile = (
  clientData: {},
  id: string,
  options?: AxiosRequestConfig,
) =>
  getApiRequest(
    'Akeneo get media files',
    `/api/rest/v1/media-files/${id}`,
    _.assign(
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: getBearerAuthorizarionHeader(
            clientData,
            'access_token',
          ),
        },
      },
      options,
    ),
  );

const postMediaFile = (
  clientData: {},
  filePath: string,
  options?: AxiosRequestConfig,
) => {
  const data = new FormData();
  const file = fs.readFileSync(filePath);

  data.append('product', JSON.stringify(options.data));
  data.append('file', file, { filename: path.parse(filePath).base });

  return postApiRequest(
    'Akeneo get media files',
    `/api/rest/v1/media-files`,
    _.assign({
      headers: {
        Authorization: getBearerAuthorizarionHeader(clientData, 'access_token'),
        'Content-Type': data.getHeaders()['content-type'],
        'Content-Length': data.getLengthSync(),
      },
      data,
    }),
  );
};

const getMediaFiles = (clientData: {}, options?: AxiosRequestConfig) =>
  getApiRequest(
    'Akeneo get media files',
    '/api/rest/v1/media-files',
    _.assign(
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: getBearerAuthorizarionHeader(
            clientData,
            'access_token',
          ),
        },
      },
      options,
    ),
  );

const downloadMediaFile = (
  clientData: {},
  id: string,
  options?: AxiosRequestConfig,
) =>
  getApiRequest(
    'Akeneo get media files',
    `/api/rest/v1/media-files/${id}/download`,
    _.assign(
      {
        responseType: 'arraybuffer',
        headers: {
          'Content-Type': 'application/json',
          Authorization: getBearerAuthorizarionHeader(
            clientData,
            'access_token',
          ),
        },
      },
      options,
    ),
  );

export default {
  getCategory,
  postCategory,
  getCategories,
  getProduct,
  patchProduct,
  deleteProduct,
  getProducts,
  getAttribute,
  getAttributes,
  postAttribute,
  getMediaFile,
  postMediaFile,
  getMediaFiles,
  downloadMediaFile,
  authentificationByPassword,
  authentificationByRefreshToken,

  post: (url: string, options?: AxiosRequestConfig) =>
    postApiRequest('Akeneo post request', url, options),
  get: (url: string, options?: AxiosRequestConfig) =>
    getApiRequest('Akeneo get request', url, options),
};
