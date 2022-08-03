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
exports.copyCategories = exports.addAttributesCategories = exports.addCategoriesHierarchy = exports.addChildrenCatigories = void 0;
var _ = require("lodash");
var mongo_1 = require("../../../api/mongo");
var utils_1 = require("../../../utils");
var addChildrenCatigories = function (akeneoMongodbName) { return __awaiter(void 0, void 0, void 0, function () {
    var getCategories, items, igp, ic;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                getCategories = function (error, client) { return __awaiter(void 0, void 0, void 0, function () {
                    var collection;
                    return __generator(this, function (_a) {
                        if (error) {
                            console.log("[Sync:getCategories CATEGORIES] ".concat(error.message), {
                                error: error
                            });
                            return [2 /*return*/];
                        }
                        collection = client.db(akeneoMongodbName).collection('categories');
                        return [2 /*return*/, collection.find().toArray()];
                    });
                }); };
                return [4 /*yield*/, (0, mongo_1.mongoClientWrapper)(getCategories)];
            case 1:
                items = _a.sent();
                igp = _.groupBy(items, 'parent');
                ic = _.map(items, function (i) {
                    return _.assign(i, {
                        childrens: _.map(_.get(igp, _.get(i, '_id')), function (g) {
                            return _.get(g, '_id');
                        })
                    });
                });
                return [2 /*return*/, (0, mongo_1.mongoClientWrapper)((0, utils_1.mongoUpsertMany)(akeneoMongodbName, 'categories', '_id', ic))];
        }
    });
}); };
exports.addChildrenCatigories = addChildrenCatigories;
var addCategoriesHierarchy = function (akeneoMongodbName, rootCategory) { return __awaiter(void 0, void 0, void 0, function () {
    var getCategoryChildrens, setCategoryHierarchy, run, childrens;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                getCategoryChildrens = function (id) { return function (error, client) { return __awaiter(void 0, void 0, void 0, function () {
                    var collection, category;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (error) {
                                    console.log("[Sync:getCategoryChildrens CATEGORIES] ".concat(error.message), {
                                        error: error
                                    });
                                    return [2 /*return*/];
                                }
                                collection = client.db(akeneoMongodbName).collection('categories');
                                return [4 /*yield*/, collection.findOne({
                                        _id: id
                                    }, {
                                        projection: {
                                            childrens: 1
                                        }
                                    })];
                            case 1:
                                category = _a.sent();
                                return [2 /*return*/, _.get(category, 'childrens', [])];
                        }
                    });
                }); }; };
                setCategoryHierarchy = function (ch, lv) { return function (error, client) { return __awaiter(void 0, void 0, void 0, function () {
                    var collection, batch, _i, ch_1, id;
                    return __generator(this, function (_a) {
                        if (error) {
                            console.log("[Sync:setCategoryHierarchy CATEGORIES] ".concat(error.message), {
                                error: error
                            });
                            return [2 /*return*/];
                        }
                        collection = client.db(akeneoMongodbName).collection('categories');
                        batch = collection.initializeUnorderedBulkOp();
                        for (_i = 0, ch_1 = ch; _i < ch_1.length; _i++) {
                            id = ch_1[_i];
                            batch
                                .find({ _id: id })
                                .upsert()
                                .updateOne({
                                $set: {
                                    root: rootCategory,
                                    level: lv,
                                    enabled: true
                                }
                            });
                        }
                        return [2 /*return*/, batch.execute()];
                    });
                }); }; };
                run = function (ch, lv) { return __awaiter(void 0, void 0, void 0, function () {
                    var _i, ch_2, id, c;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!(ch.length > 0)) return [3 /*break*/, 6];
                                return [4 /*yield*/, (0, mongo_1.mongoClientWrapper)(setCategoryHierarchy(ch, lv))];
                            case 1:
                                _a.sent();
                                _i = 0, ch_2 = ch;
                                _a.label = 2;
                            case 2:
                                if (!(_i < ch_2.length)) return [3 /*break*/, 6];
                                id = ch_2[_i];
                                return [4 /*yield*/, (0, mongo_1.mongoClientWrapper)(getCategoryChildrens(id))];
                            case 3:
                                c = _a.sent();
                                return [4 /*yield*/, run(c, lv + 1)];
                            case 4:
                                _a.sent();
                                _a.label = 5;
                            case 5:
                                _i++;
                                return [3 /*break*/, 2];
                            case 6: return [2 /*return*/];
                        }
                    });
                }); };
                return [4 /*yield*/, (0, mongo_1.mongoClientWrapper)(getCategoryChildrens(rootCategory))];
            case 1:
                childrens = _a.sent();
                return [2 /*return*/, run(childrens, 1)];
        }
    });
}); };
exports.addCategoriesHierarchy = addCategoriesHierarchy;
var addAttributesCategories = function (akeneoMongodbName) { return __awaiter(void 0, void 0, void 0, function () {
    var getAttributesIds, getAttributeCategories, setArrtibutesCategories, attributesIds, _i, attributesIds_1, id, categories;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                getAttributesIds = function (error, client) { return __awaiter(void 0, void 0, void 0, function () {
                    var collection;
                    return __generator(this, function (_a) {
                        if (error) {
                            console.log("[Sync:addAttributesCategories CATEGORIES] ".concat(error.message), { error: error });
                            return [2 /*return*/];
                        }
                        collection = client.db(akeneoMongodbName).collection('attributes');
                        return [2 /*return*/, collection
                                .find()
                                .project({ _id: 1 })
                                .map(function (item) { return _.get(item, '_id'); })
                                .toArray()];
                    });
                }); };
                getAttributeCategories = function (id) { return function (error, client) { return __awaiter(void 0, void 0, void 0, function () {
                    var collection, categories;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                if (error) {
                                    console.log("[Sync:getAttributeCategories CATEGORIES] ".concat(error.message), {
                                        error: error,
                                        id: id
                                    });
                                    return [2 /*return*/];
                                }
                                collection = client.db(akeneoMongodbName).collection('products');
                                return [4 /*yield*/, collection
                                        .find((_a = {}, _a["attributes.".concat(id)] = { $exists: true }, _a))
                                        .project({ categories: 1 })
                                        .map(function (item) { return _.get(item, 'categories'); })
                                        .toArray()];
                            case 1:
                                categories = _b.sent();
                                return [2 /*return*/, _.uniq(_.flatten(categories))];
                        }
                    });
                }); }; };
                setArrtibutesCategories = function (id, categories) {
                    return function (error, client) { return __awaiter(void 0, void 0, void 0, function () {
                        var collection;
                        return __generator(this, function (_a) {
                            if (error) {
                                console.log("[Sync:setArrtibutesCategories CATEGORIES] ".concat(error.message), { error: error });
                                return [2 /*return*/];
                            }
                            collection = client.db(akeneoMongodbName).collection('attributes');
                            return [2 /*return*/, collection.updateOne({ _id: id }, {
                                    $set: {
                                        categories: categories
                                    }
                                })];
                        });
                    }); };
                };
                return [4 /*yield*/, (0, mongo_1.mongoClientWrapper)(getAttributesIds)];
            case 1:
                attributesIds = _a.sent();
                _i = 0, attributesIds_1 = attributesIds;
                _a.label = 2;
            case 2:
                if (!(_i < attributesIds_1.length)) return [3 /*break*/, 6];
                id = attributesIds_1[_i];
                return [4 /*yield*/, (0, mongo_1.mongoClientWrapper)(getAttributeCategories(id))];
            case 3:
                categories = _a.sent();
                if (!categories) return [3 /*break*/, 5];
                return [4 /*yield*/, (0, mongo_1.mongoClientWrapper)(setArrtibutesCategories(id, categories))];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 2];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.addAttributesCategories = addAttributesCategories;
var copyCategories = function (akeneoMongodbName, siteMongodbName, rootCategory) { return __awaiter(void 0, void 0, void 0, function () {
    var getCollection, categories;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                getCollection = function (collName) { return function (error, client) { return __awaiter(void 0, void 0, void 0, function () {
                    var collection;
                    return __generator(this, function (_a) {
                        if (error) {
                            console.log("[Sync:getCollection CATEGORIES] ".concat(error.message), {
                                error: error
                            });
                            return [2 /*return*/];
                        }
                        collection = client.db(akeneoMongodbName).collection(collName);
                        return [2 /*return*/, collection.find({ root: rootCategory }).toArray()];
                    });
                }); }; };
                return [4 /*yield*/, (0, mongo_1.mongoClientWrapper)(getCollection('categories'))];
            case 1:
                categories = _a.sent();
                return [2 /*return*/, (0, mongo_1.mongoClientWrapper)((0, utils_1.mongoUpsertMany)(siteMongodbName, 'categories', '_id', categories, true))];
        }
    });
}); };
exports.copyCategories = copyCategories;
