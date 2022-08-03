"use strict";
exports.__esModule = true;
exports.sendSms = void 0;
var constants_api_1 = require("./../constants.api");
var constants_api_2 = require("api/constants.api");
var network_api_1 = require("api/network.api");
var instance = new network_api_1.Network(constants_api_2.sms_api_url);
var sendSms = function (phoneNumber, message) {
    var url = '/sms/send';
    return instance.httpGet({
        url: url,
        params: {
            api_id: constants_api_1.sms_api_key,
            to: phoneNumber,
            msg: message,
            json: 1
        }
    });
};
exports.sendSms = sendSms;
