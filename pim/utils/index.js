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
exports.mongoUpsertMany = exports.syncFilesTask = exports.syncMongoTask = void 0;
var hashSum = require("hash-sum");
var _ = require("lodash");
var fs = require("fs");
var sharp = require("sharp");
var path = require("path");
var mongoUpsertMany = function (dbName, collectionName, identifierKey, items, hash) {
    if (hash === void 0) { hash = false; }
    return function (error, client) { return __awaiter(void 0, void 0, void 0, function () {
        var collection, batch, _i, items_1, item, o, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (error) {
                        console.log(error);
                        return [2 /*return*/];
                    }
                    if (items.length < 1) {
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client.db(dbName).collection(collectionName)];
                case 2:
                    collection = _a.sent();
                    batch = collection.initializeUnorderedBulkOp();
                    for (_i = 0, items_1 = items; _i < items_1.length; _i++) {
                        item = items_1[_i];
                        o = {
                            _id: _.get(item, identifierKey)
                        };
                        if (hash) {
                            try {
                                o.hash = hashSum(item);
                            }
                            catch (error) {
                                console.log(error.message);
                            }
                        }
                        batch
                            .find({ _id: o._id })
                            .upsert()
                            .updateOne({
                            $set: _.assign(_.omit(item, identifierKey), o)
                        });
                    }
                    return [2 /*return*/, batch.execute()];
                case 3:
                    err_1 = _a.sent();
                    console.log(err_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
};
exports.mongoUpsertMany = mongoUpsertMany;
var syncMongoTask = function (clientData, clientWrapper, dbName, collectionName, identifierKey, paginationType, limit, fetchFunc, transformationFunc) { return __awaiter(void 0, void 0, void 0, function () {
    var items, next, options, response, itemsData, err_2, nextLink;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                items = [];
                next = true;
                options = {
                    params: (_a = {
                            pagination_type: paginationType
                        },
                        _a[paginationType] = null,
                        _a.limit = limit,
                        _a)
                };
                _b.label = 1;
            case 1:
                if (!next) return [3 /*break*/, 7];
                console.log("syncTask: ".concat(collectionName, "#").concat(options.params[paginationType]));
                return [4 /*yield*/, fetchFunc(clientData, options)];
            case 2:
                response = _b.sent();
                itemsData = _.get(response, 'data');
                items = _.map(_.get(itemsData, '_embedded.items'), transformationFunc);
                _b.label = 3;
            case 3:
                _b.trys.push([3, 5, , 6]);
                return [4 /*yield*/, clientWrapper(mongoUpsertMany(dbName, collectionName, identifierKey, items))];
            case 4:
                _b.sent();
                return [3 /*break*/, 6];
            case 5:
                err_2 = _b.sent();
                console.log(err_2);
                return [3 /*break*/, 6];
            case 6:
                next = _.has(itemsData, '_links.next');
                if (next) {
                    nextLink = new URL(_.get(itemsData, '_links.next.href'));
                    options.params[paginationType] =
                        nextLink.searchParams.get(paginationType);
                }
                else {
                    return [2 /*return*/];
                }
                return [3 /*break*/, 1];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.syncMongoTask = syncMongoTask;
var syncFilesTask = function (clientData, clientWrapper, dbName, collectionName, attributePath, writePath, fetchFunc) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, clientWrapper(function (error, client) { return __awaiter(void 0, void 0, void 0, function () {
                var collection, items, itemsChunk, _i, itemsChunk_1, chunk, tasksChunk;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            if (error) {
                                console.log(error);
                                return [2 /*return*/];
                            }
                            collection = client.db(dbName).collection(collectionName);
                            return [4 /*yield*/, collection
                                    .find((_a = {},
                                    _a[attributePath] = {
                                        $exists: true
                                    },
                                    _a))
                                    .project((_b = {
                                        _id: 1
                                    },
                                    _b[attributePath] = 1,
                                    _b))
                                    .toArray()];
                        case 1:
                            items = _c.sent();
                            itemsChunk = _.chunk(items, 10);
                            _i = 0, itemsChunk_1 = itemsChunk;
                            _c.label = 2;
                        case 2:
                            if (!(_i < itemsChunk_1.length)) return [3 /*break*/, 6];
                            chunk = itemsChunk_1[_i];
                            tasksChunk = _.map(chunk, function (i) { return __awaiter(void 0, void 0, void 0, function () {
                                var id, filePath, fileBuffer, file, err_3, getFilePathLocal, _a, _b, _c, err_4;
                                var _d;
                                return __generator(this, function (_e) {
                                    switch (_e.label) {
                                        case 0:
                                            id = _.get(i, '_id');
                                            filePath = _.get(i, attributePath);
                                            if (!filePath) return [3 /*break*/, 10];
                                            _e.label = 1;
                                        case 1:
                                            _e.trys.push([1, 3, , 5]);
                                            return [4 /*yield*/, fetchFunc(clientData, filePath)];
                                        case 2:
                                            file = (_e.sent()).data;
                                            fileBuffer = Buffer.from(file, 'binary');
                                            return [3 /*break*/, 5];
                                        case 3:
                                            err_3 = _e.sent();
                                            console.log(err_3);
                                            return [4 /*yield*/, collection.update({ _id: id }, { $unset: (_d = {}, _d[attributePath] = 1, _d), $set: { hash: hashSum(id) } }, { multi: true })];
                                        case 4:
                                            _e.sent();
                                            return [3 /*break*/, 5];
                                        case 5:
                                            if (!fileBuffer) return [3 /*break*/, 10];
                                            _e.label = 6;
                                        case 6:
                                            _e.trys.push([6, 9, , 10]);
                                            getFilePathLocal = function (middle) {
                                                return path.join(writePath, middle, filePath);
                                            };
                                            if (!!fs.existsSync(getFilePathLocal('big'))) return [3 /*break*/, 8];
                                            console.log("syncFilesTask: ".concat(_.size(items), " ").concat(attributePath, "#").concat(filePath, " -> ").concat(getFilePathLocal('big')));
                                            fs.mkdirSync(path.dirname(getFilePathLocal('big')), {
                                                recursive: true
                                            });
                                            fs.writeFileSync(getFilePathLocal('big'), fileBuffer, {
                                                flag: 'w'
                                            });
                                            fs.mkdirSync(path.dirname(getFilePathLocal('small')), {
                                                recursive: true
                                            });
                                            _b = (_a = fs).writeFileSync;
                                            _c = [getFilePathLocal('small')];
                                            return [4 /*yield*/, sharp(fileBuffer).resize(350).toBuffer()];
                                        case 7:
                                            _b.apply(_a, _c.concat([_e.sent(), {
                                                    flag: 'w'
                                                }]));
                                            _e.label = 8;
                                        case 8: return [3 /*break*/, 10];
                                        case 9:
                                            err_4 = _e.sent();
                                            console.log(err_4);
                                            return [3 /*break*/, 10];
                                        case 10: return [2 /*return*/];
                                    }
                                });
                            }); });
                            return [4 /*yield*/, Promise.all(tasksChunk)];
                        case 3:
                            _c.sent();
                            return [4 /*yield*/, collection.update({
                                    $and: [
                                        { 'images.1c_photo': null },
                                        { 'images.1c_photo': { $exists: true } },
                                    ]
                                }, { $unset: { 'images.1c_photo': 1 } }, { multi: true })];
                        case 4:
                            _c.sent();
                            _c.label = 5;
                        case 5:
                            _i++;
                            return [3 /*break*/, 2];
                        case 6: return [2 /*return*/];
                    }
                });
            }); })];
    });
}); };
exports.syncFilesTask = syncFilesTask;
