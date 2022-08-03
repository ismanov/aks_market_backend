import { config } from '../../config/index';

export const sms_api_url = config.smsConfig.api.url;
export const sms_api_key = config.smsConfig.api.key;
export const sms_api_sender = config.smsConfig.api.sender;
export enum methods {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}
