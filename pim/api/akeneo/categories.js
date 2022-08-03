"use strict";
exports.__esModule = true;
exports.transformCategory = void 0;
var _ = require("lodash");
var transformCategory = function (category) {
    return _.assign(_.pick(category, ['code', 'parent']), {
        name: _.get(category, 'labels.ru_RU')
    });
};
exports.transformCategory = transformCategory;
