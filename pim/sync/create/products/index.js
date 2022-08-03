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
exports.normalizeProductAttributes = void 0;
var _ = require("lodash");
var mongo_1 = require("../../../api/mongo");
var config_1 = require("../../../config");
var utils_1 = require("../../../utils");
var normalizeProductAttributes = function (akeneoMongodbName, siteMongodbName, categoriesRoot) { return __awaiter(void 0, void 0, void 0, function () {
    var getCollection, dropCollection, getCategoriesByLevel, createAtttibute, newAttributes, categories, attributes, families, numericAttributes, products, ps, pc;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                getCollection = function (collName, query) {
                    return function (error, client) { return __awaiter(void 0, void 0, void 0, function () {
                        var collection;
                        return __generator(this, function (_a) {
                            if (error) {
                                console.log("[Sync:getCollection ".concat(collName, "] ").concat(error.message), {
                                    error: error
                                });
                                return [2 /*return*/];
                            }
                            collection = client.db(akeneoMongodbName).collection(collName);
                            return [2 /*return*/, collection.find(query || {}).toArray()];
                        });
                    }); };
                };
                dropCollection = function (collName) { return function (error, client) { return __awaiter(void 0, void 0, void 0, function () {
                    var collection;
                    return __generator(this, function (_a) {
                        if (error) {
                            console.log("[Sync:dropCollection ".concat(collName, "] ").concat(error.message), {
                                error: error
                            });
                            return [2 /*return*/];
                        }
                        collection = client.db(siteMongodbName).collection(collName);
                        return [2 /*return*/, collection.drop()];
                    });
                }); }; };
                getCategoriesByLevel = function (level) { return function (error, client) { return __awaiter(void 0, void 0, void 0, function () {
                    var collection;
                    return __generator(this, function (_a) {
                        if (error) {
                            console.log("[Sync:getCategoriesIdsByLevel CATEGORIES] ".concat(error.message), { error: error });
                            return [2 /*return*/];
                        }
                        collection = client.db(akeneoMongodbName).collection('categories');
                        return [2 /*return*/, collection.find({ level: level, root: categoriesRoot }).toArray()];
                    });
                }); }; };
                createAtttibute = function (na, fm, attribute, productId, categoryId, key, value, type, suffix) {
                    var _a;
                    var id = "".concat(key, "_").concat(suffix);
                    var family = _.find(fm, ['_id', categoryId]);
                    var val = _.trim(value).normalize().replace(/\s+/g, ' ');
                    var newAttribute = _.find(na, ['_id', id]);
                    if (!newAttribute) {
                        newAttribute = _.defaults((_a = {
                                _id: id
                            },
                            _a[type] = suffix,
                            _a.values = {},
                            _a), _.pick(attribute, ['group', 'name', 'type']));
                        na.push(newAttribute);
                    }
                    if (family && _.includes(_.get(family, 'attributes', []), key)) {
                        _.assign(newAttribute, {
                            filter: true
                        });
                    }
                    if (val) {
                        if (!newAttribute.values[val]) {
                            switch (newAttribute.type) {
                                case 'pim_catalog_text':
                                    newAttribute.values[val] = [productId];
                                    break;
                                case 'pim_catalog_boolean':
                                    newAttribute.values[val] = [productId];
                                    break;
                                default:
                                    break;
                            }
                        }
                        else {
                            switch (newAttribute.type) {
                                case 'pim_catalog_text':
                                    newAttribute.values[val].push(productId);
                                    break;
                                case 'pim_catalog_boolean':
                                    newAttribute.values[val].push(productId);
                                    break;
                                default:
                                    break;
                            }
                        }
                    }
                };
                newAttributes = [];
                return [4 /*yield*/, (0, mongo_1.mongoClientWrapper)(getCategoriesByLevel(2))];
            case 1:
                categories = _a.sent();
                return [4 /*yield*/, (0, mongo_1.mongoClientWrapper)(getCollection('attributes'))];
            case 2:
                attributes = _a.sent();
                return [4 /*yield*/, (0, mongo_1.mongoClientWrapper)(getCollection('families'))];
            case 3:
                families = _a.sent();
                numericAttributes = _.compact(_.map(attributes, function (attribute, key) {
                    if (_.get(attribute, 'type') === 'pim_catalog_number') {
                        return _.get(attribute, '_id');
                    }
                }));
                return [4 /*yield*/, (0, mongo_1.mongoClientWrapper)(getCollection('products'))];
            case 4:
                products = _a.sent();
                ps = _.concat(_.compact(_.map(config_1.akeneoConfig.products.attributes, function (c, k) {
                    return _.size(c) > 1 ? k : null;
                })));
                pc = _.map(products, function (product) {
                    var productEnabled = _.get(product, 'enabled', false);
                    var productId = _.get(product, '_id');
                    var categoryId = _.first(_.filter(_.get(product, 'categories'), function (c) {
                        return _.find(categories, ['_id', c]);
                    }));
                    var brandId = _.get(product, 'brand');
                    return _.reduce(_.map(product, function (props, key) {
                        var _a, _b, _c, _d, _e;
                        if (key === 'name') {
                            var n = _.split(props, '|');
                            return {
                                name: _.trim(props),
                                model: _.size(n) > 1 ? n[1] : ''
                            };
                        }
                        if (key === 'stocks') {
                            var s = _.sum(_.map(_.values(_.pick(props, [
                                '4305385d3ac111e29878001517d28cb0',
                                '4305385e3ac111e29878001517d28cb0',
                            ])), _.parseInt));
                            return {
                                stocksSummary: s > 0 ? (s > 10 ? '> 10' : '< 10') : '0'
                            };
                        }
                        if (key === 'prices') {
                            return _a = {},
                                _a[key] = _.reduce(_.map(props, function (v, k) {
                                    var _a;
                                    var attribute = _.find(attributes, ['_id', k]);
                                    var newAttribute = _.find(newAttributes, [
                                        '_id',
                                        k,
                                    ]);
                                    if (attribute && !newAttribute) {
                                        newAttributes.push(attribute);
                                    }
                                    return _a = {},
                                        _a[k] = parseFloat(v),
                                        _a;
                                }), _.merge, {}),
                                _a;
                        }
                        if (key === 'categories') {
                            return _b = {
                                    categoryId: categoryId,
                                    categoryName: _.get(_.find(categories, ['_id', categoryId]), 'name')
                                },
                                _b[key] = [categoryId],
                                _b;
                        }
                        if (key === 'attributes') {
                            return _c = {},
                                _c[key] = _.reduce(_.map(props, function (v, k) {
                                    var _a, _b, _c;
                                    var attribute = _.find(attributes, ['_id', k]);
                                    if (attribute && productEnabled) {
                                        createAtttibute(newAttributes, families, attribute, productId, categoryId, k, v, 'category', categoryId);
                                        createAtttibute(newAttributes, families, attribute, productId, categoryId, k, v, 'brand', brandId);
                                    }
                                    if (_.includes(numericAttributes, k)) {
                                        return _a = {},
                                            _a[k] = {
                                                name: _.get(attribute, 'name'),
                                                value: parseFloat(v)
                                            },
                                            _a;
                                    }
                                    if (_.startsWith(k, 'parser_yandexmarket_')) {
                                        return _b = {},
                                            _b[k] = {
                                                name: _.get(attribute, 'name'),
                                                value: _.trim(v, ' ')
                                            },
                                            _b;
                                    }
                                    return _c = {},
                                        _c[k] = {
                                            name: _.get(attribute, 'name'),
                                            value: v
                                        },
                                        _c;
                                }), _.assign, {}),
                                _c;
                        }
                        if (_.includes(ps, key)) {
                            return _d = {},
                                _d[key] = _.reduce(_.map(props, function (v, k) {
                                    var _a, _b, _c;
                                    if (_.includes(numericAttributes, k)) {
                                        return _a = {},
                                            _a[k] = parseFloat(v),
                                            _a;
                                    }
                                    if (_.startsWith(k, 'parser_yandexmarket_')) {
                                        return _b = {},
                                            _b[k] = _.trim(v, ' '),
                                            _b;
                                    }
                                    return _c = {},
                                        _c[k] = v,
                                        _c;
                                }), _.assign, {}),
                                _d;
                        }
                        return _e = {},
                            _e[key] = props,
                            _e;
                    }), _.merge, {});
                });
                return [4 /*yield*/, (0, mongo_1.mongoClientWrapper)(dropCollection('attributes'))];
            case 5:
                _a.sent();
                return [4 /*yield*/, (0, mongo_1.mongoClientWrapper)((0, utils_1.mongoUpsertMany)(siteMongodbName, 'attributes', '_id', _.map(newAttributes, function (attribute) {
                        var size = _.size(attribute.values);
                        return _.assign(attribute, {
                            sort: _.size(_.flatten(_.values(attribute.values))),
                            size: size
                        });
                    }), true))];
            case 6:
                _a.sent();
                return [2 /*return*/, (0, mongo_1.mongoClientWrapper)((0, utils_1.mongoUpsertMany)(siteMongodbName, 'products', '_id', pc, true))];
        }
    });
}); };
exports.normalizeProductAttributes = normalizeProductAttributes;
