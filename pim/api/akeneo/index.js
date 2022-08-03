"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
/* eslint-disable @typescript-eslint/ban-types */
var axios_1 = require("axios");
var _ = require("lodash");
var path = require("path");
var fs = require("fs");
var form_data_1 = require("form-data");
var config_1 = require("../../config");
var utils_1 = require("./utils");
var basicAuthorizationHeader = (0, utils_1.getBasicAuthorizationHeader)(config_1.akeneoConfig, 'client.id', 'client.secret');
var api = axios_1["default"].create({
    baseURL: config_1.akeneoConfig.api.url
});
var apiRequest = function (method, message, url, options) { return __awaiter(void 0, void 0, void 0, function () {
    var formatApiResponse, _a, status_1, statusText, data, response, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                formatApiResponse = function (type, _a) {
                    var status = _a.status, statusText = _a.statusText, data = _a.data;
                    return {
                        status: type,
                        statusCode: status,
                        message: "".concat(message, ": ").concat(statusText),
                        data: data
                    };
                };
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, api.request(_.assign({
                        url: url,
                        method: method
                    }, options))];
            case 2:
                _a = _b.sent(), status_1 = _a.status, statusText = _a.statusText, data = _a.data;
                if (status_1 >= 200 && status_1 < 300) {
                    return [2 /*return*/, formatApiResponse('success', {
                            status: status_1,
                            statusText: statusText,
                            data: data
                        })];
                }
                response = formatApiResponse('fail', {
                    status: status_1,
                    statusText: statusText,
                    data: data
                });
                console.log(response);
                return [2 /*return*/, response];
            case 3:
                err_1 = _b.sent();
                console.log(err_1);
                return [2 /*return*/, err_1];
            case 4: return [2 /*return*/];
        }
    });
}); };
var getApiRequest = function (message, url, options) { return apiRequest('GET', message, url, options); };
var postApiRequest = function (message, url, options) { return apiRequest('POST', message, url, options); };
var patchApiRequest = function (message, url, options) { return apiRequest('PATCH', message, url, options); };
var deleteApiRequest = function (message, url, options) { return apiRequest('DELETE', message, url, options); };
var authentificationByPassword = function () {
    return postApiRequest('Akeneo authentication by password', '/api/oauth/v1/token', {
        headers: {
            'Content-Type': 'application/json',
            Authorization: basicAuthorizationHeader
        },
        data: {
            username: config_1.akeneoConfig.client.username,
            password: config_1.akeneoConfig.client.password,
            grant_type: 'password'
        }
    });
};
var authentificationByRefreshToken = function (clientData) {
    return postApiRequest('Akeneo authentication by refresh token', '/api/oauth/v1/token', {
        headers: {
            'Content-Type': 'application/json',
            Authorization: basicAuthorizationHeader
        },
        data: {
            refresh_token: _.get(clientData, 'refresh_token'),
            grant_type: 'refresh_token'
        }
    });
};
var getCategory = function (clientData, id, options) {
    return getApiRequest('Akeneo get category by id', "/api/rest/v1/categories/".concat(id), _.assign({
        headers: {
            'Content-Type': 'application/json',
            Authorization: (0, utils_1.getBearerAuthorizarionHeader)(clientData, 'access_token')
        }
    }, options));
};
var postCategory = function (clientData, options) {
    return postApiRequest('Akeneo get category by id', "/api/rest/v1/categories", _.assign({
        headers: {
            'Content-Type': 'application/json',
            Authorization: (0, utils_1.getBearerAuthorizarionHeader)(clientData, 'access_token')
        }
    }, options));
};
var getCategories = function (clientData, options) {
    return getApiRequest('Akeneo get categories', '/api/rest/v1/categories', _.assign({
        headers: {
            'Content-Type': 'application/json',
            Authorization: (0, utils_1.getBearerAuthorizarionHeader)(clientData, 'access_token')
        }
    }, options));
};
var patchProduct = function (clientData, id, options) {
    return patchApiRequest('Akeneo get product by id', "/api/rest/v1/products/".concat(id), _.assign({
        headers: {
            'Content-Type': 'application/json',
            Authorization: (0, utils_1.getBearerAuthorizarionHeader)(clientData, 'access_token')
        }
    }, options));
};
var deleteProduct = function (clientData, id) {
    return deleteApiRequest('Akeneo delete product by id', "/api/rest/v1/products/".concat(id), _.assign({
        headers: {
            'Content-Type': 'application/json',
            Authorization: (0, utils_1.getBearerAuthorizarionHeader)(clientData, 'access_token')
        }
    }));
};
var getProducts = function (clientData, options) {
    return getApiRequest('Akeneo get products', '/api/rest/v1/products', _.assign({
        headers: {
            'Content-Type': 'application/json',
            Authorization: (0, utils_1.getBearerAuthorizarionHeader)(clientData, 'access_token')
        }
    }, options));
};
var getProduct = function (clientData, id, options) {
    return getApiRequest('Akeneo get product by id', "/api/rest/v1/products/".concat(id), _.assign({
        headers: {
            'Content-Type': 'application/json',
            Authorization: (0, utils_1.getBearerAuthorizarionHeader)(clientData, 'access_token')
        }
    }, options));
};
var getAttribute = function (clientData, id, options) {
    return getApiRequest('Akeneo get attribute by id', "/api/rest/v1/attributes/".concat(id), _.assign({
        headers: {
            'Content-Type': 'application/json',
            Authorization: (0, utils_1.getBearerAuthorizarionHeader)(clientData, 'access_token')
        }
    }, options));
};
var getAttributes = function (clientData, options) {
    return getApiRequest('Akeneo get attributes', '/api/rest/v1/attributes', _.assign({
        headers: {
            'Content-Type': 'application/json',
            Authorization: (0, utils_1.getBearerAuthorizarionHeader)(clientData, 'access_token')
        }
    }, options));
};
var postAttribute = function (clientData, options) {
    return postApiRequest('Akeneo get attributes', '/api/rest/v1/attributes', _.assign({
        headers: {
            'Content-Type': 'application/json',
            Authorization: (0, utils_1.getBearerAuthorizarionHeader)(clientData, 'access_token')
        }
    }, options));
};
var getMediaFile = function (clientData, id, options) {
    return getApiRequest('Akeneo get media files', "/api/rest/v1/media-files/".concat(id), _.assign({
        headers: {
            'Content-Type': 'application/json',
            Authorization: (0, utils_1.getBearerAuthorizarionHeader)(clientData, 'access_token')
        }
    }, options));
};
var postMediaFile = function (clientData, filePath, options) {
    var data = new form_data_1["default"]();
    var file = fs.readFileSync(filePath);
    data.append('product', JSON.stringify(options.data));
    data.append('file', file, { filename: path.parse(filePath).base });
    return postApiRequest('Akeneo get media files', "/api/rest/v1/media-files", _.assign({
        headers: {
            Authorization: (0, utils_1.getBearerAuthorizarionHeader)(clientData, 'access_token'),
            'Content-Type': data.getHeaders()['content-type'],
            'Content-Length': data.getLengthSync()
        },
        data: data
    }));
};
var getMediaFiles = function (clientData, options) {
    return getApiRequest('Akeneo get media files', '/api/rest/v1/media-files', _.assign({
        headers: {
            'Content-Type': 'application/json',
            Authorization: (0, utils_1.getBearerAuthorizarionHeader)(clientData, 'access_token')
        }
    }, options));
};
var downloadMediaFile = function (clientData, id, options) {
    return getApiRequest('Akeneo get media files', "/api/rest/v1/media-files/".concat(id, "/download"), _.assign({
        responseType: 'arraybuffer',
        headers: {
            'Content-Type': 'application/json',
            Authorization: (0, utils_1.getBearerAuthorizarionHeader)(clientData, 'access_token')
        }
    }, options));
};
exports["default"] = {
    getCategory: getCategory,
    postCategory: postCategory,
    getCategories: getCategories,
    getProduct: getProduct,
    patchProduct: patchProduct,
    deleteProduct: deleteProduct,
    getProducts: getProducts,
    getAttribute: getAttribute,
    getAttributes: getAttributes,
    postAttribute: postAttribute,
    getMediaFile: getMediaFile,
    postMediaFile: postMediaFile,
    getMediaFiles: getMediaFiles,
    downloadMediaFile: downloadMediaFile,
    authentificationByPassword: authentificationByPassword,
    authentificationByRefreshToken: authentificationByRefreshToken,
    post: function (url, options) {
        return postApiRequest('Akeneo post request', url, options);
    },
    get: function (url, options) {
        return getApiRequest('Akeneo get request', url, options);
    }
};
