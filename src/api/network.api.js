"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.Network = void 0;
var fetch = require("node-fetch");
var constants_api_1 = require("api/constants.api");
var helpers_api_1 = require("api/helpers.api");
var Network = /** @class */ (function () {
    function Network(baseUrl, config) {
        this.baseUrl = baseUrl;
        this.config = config;
        this.appJsonContentType = { 'Content-Type': 'application/json' };
    }
    Network.prototype.httpGet = function (_a) {
        var _this = this;
        var url = _a.url, params = _a.params, config = _a.config;
        return new Promise(function (resolve, reject) {
            return fetch(_this.baseUrl + url + (0, helpers_api_1.makeQueryParams)(params), {
                method: constants_api_1.methods.GET,
                headers: __assign(__assign(__assign({}, _this.appJsonContentType), _this.config), config)
            })
                .then(function (res) { return resolve(res.json()); })["catch"](function (error) { return reject(error); });
        });
    };
    Network.prototype.httpPost = function (_a) {
        var _this = this;
        var url = _a.url, body = _a.body, config = _a.config;
        return new Promise(function (resolve, reject) {
            return fetch(_this.baseUrl + url, {
                method: constants_api_1.methods.POST,
                headers: __assign(__assign(__assign({}, _this.appJsonContentType), _this.config), config),
                body: JSON.stringify(body)
            })
                .then(function (res) { return resolve(res.data); })["catch"](function (error) { return reject(error); });
        });
    };
    Network.prototype.httpPut = function (_a) {
        var _this = this;
        var url = _a.url, body = _a.body, config = _a.config;
        return new Promise(function (resolve, reject) {
            return fetch(_this.baseUrl + url, {
                method: constants_api_1.methods.PUT,
                headers: __assign(__assign(__assign({}, _this.appJsonContentType), _this.config), config),
                body: JSON.stringify(body)
            })
                .then(function (res) { return resolve(res.data); })["catch"](function (error) { return reject(error); });
        });
    };
    return Network;
}());
exports.Network = Network;
