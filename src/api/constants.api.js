"use strict";
exports.__esModule = true;
exports.methods = exports.sms_api_sender = exports.sms_api_key = exports.sms_api_url = void 0;
var index_1 = require("../../config/index");
exports.sms_api_url = index_1.config.smsConfig.api.url;
exports.sms_api_key = index_1.config.smsConfig.api.key;
exports.sms_api_sender = index_1.config.smsConfig.api.sender;
var methods;
(function (methods) {
    methods["GET"] = "GET";
    methods["POST"] = "POST";
    methods["PUT"] = "PUT";
    methods["DELETE"] = "DELETE";
})(methods = exports.methods || (exports.methods = {}));
