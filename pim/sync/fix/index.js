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
exports.runFix = void 0;
var _ = require("lodash");
var mongo_1 = require("../../api/mongo");
var config_1 = require("../../config");
var fix = function (siteMongodbName, pricePrimary) { return __awaiter(void 0, void 0, void 0, function () {
    var fixProductsCollection, fixAttributesCollection, fixCategoriesCollection;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                fixProductsCollection = function (error, client) { return __awaiter(void 0, void 0, void 0, function () {
                    var collection;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                if (error) {
                                    console.log("[Fix:fixProductsCollection] ".concat(error.message), {
                                        error: error
                                    });
                                    return [2 /*return*/];
                                }
                                collection = client.db(siteMongodbName).collection('products');
                                return [4 /*yield*/, collection.updateMany({
                                        $or: [
                                            { categoryId: null },
                                            { name: { $exists: false } },
                                            (_a = {}, _a["prices.".concat(pricePrimary)] = { $exists: false }, _a),
                                        ]
                                    }, { $set: { enabled: false } })];
                            case 1:
                                _b.sent();
                                return [2 /*return*/];
                        }
                    });
                }); };
                fixAttributesCollection = function (error, client) { return __awaiter(void 0, void 0, void 0, function () {
                    var collection;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (error) {
                                    console.log("[Fix:fixAttributesCollection] ".concat(error.message), {
                                        error: error
                                    });
                                    return [2 /*return*/];
                                }
                                collection = client.db(siteMongodbName).collection('attributes');
                                return [4 /*yield*/, collection.deleteMany({ size: 0, type: 'pim_catalog_text' })];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); };
                fixCategoriesCollection = function (error, client) { return __awaiter(void 0, void 0, void 0, function () {
                    var categoriesCollection, categories, productsCollection, _i, categories_1, c, p;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (error) {
                                    console.log("[Fix:fixCategoriesCollection] ".concat(error.message), {
                                        error: error
                                    });
                                    return [2 /*return*/];
                                }
                                categoriesCollection = client
                                    .db(siteMongodbName)
                                    .collection('categories');
                                return [4 /*yield*/, categoriesCollection
                                        .find({ childrens: [] })
                                        .project({ _id: 1 })
                                        .map(function (item) { return _.get(item, '_id'); })
                                        .toArray()];
                            case 1:
                                categories = _a.sent();
                                productsCollection = client
                                    .db(siteMongodbName)
                                    .collection('products');
                                _i = 0, categories_1 = categories;
                                _a.label = 2;
                            case 2:
                                if (!(_i < categories_1.length)) return [3 /*break*/, 6];
                                c = categories_1[_i];
                                return [4 /*yield*/, productsCollection.findOne({
                                        categoryId: c,
                                        enabled: true
                                    })];
                            case 3:
                                p = _a.sent();
                                if (!!p) return [3 /*break*/, 5];
                                return [4 /*yield*/, categoriesCollection.updateOne({ _id: c }, { $set: { enabled: false } })];
                            case 4:
                                _a.sent();
                                _a.label = 5;
                            case 5:
                                _i++;
                                return [3 /*break*/, 2];
                            case 6: return [4 /*yield*/, categoriesCollection.updateOne({ _id: 'nonactive' }, { $set: { enabled: false } })];
                            case 7:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); };
                return [4 /*yield*/, (0, mongo_1.mongoClientWrapper)(fixProductsCollection)];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, mongo_1.mongoClientWrapper)(fixAttributesCollection)];
            case 2:
                _a.sent();
                return [4 /*yield*/, (0, mongo_1.mongoClientWrapper)(fixCategoriesCollection)];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var runFix = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fix(config_1.catalogConfig.b2b.dbName, config_1.catalogConfig.b2b.price.primary)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.runFix = runFix;
