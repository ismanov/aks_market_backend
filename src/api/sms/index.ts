import { sms_api_key } from './../constants.api';
import { sms_api_url } from 'api/constants.api';
import { Network } from 'api/network.api';

const instance = new Network(sms_api_url);

export const sendSms = (phoneNumber: string, message) => {
  const url = '/sms/send';
  return instance.httpGet({
    url,
    params: {
      api_id: sms_api_key,
      to: phoneNumber,
      msg: message,
      json: 1,
    },
  });
};
