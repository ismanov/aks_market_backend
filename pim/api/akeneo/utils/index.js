"use strict";
exports.__esModule = true;
exports.getBearerAuthorizarionHeader = exports.getBasicAuthorizationHeader = void 0;
/* eslint-disable @typescript-eslint/ban-types */
var _ = require("lodash");
function getBasicAuthorizationHeader(config) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return "Basic ".concat(Buffer.from(_.join(_.map(args, function (arg) {
        return _.get(config, arg);
    }), ':')).toString('base64'));
}
exports.getBasicAuthorizationHeader = getBasicAuthorizationHeader;
function getBearerAuthorizarionHeader(config) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return "Bearer ".concat(_.join(_.map(args, function (arg) {
        return _.get(config, arg);
    }), ''));
}
exports.getBearerAuthorizarionHeader = getBearerAuthorizarionHeader;
