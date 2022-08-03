"use strict";
exports.__esModule = true;
exports.transformAttribute = void 0;
var _ = require("lodash");
var transformAttribute = function (attribute) {
    return _.assign(_.pick(attribute, ['code', 'type', 'group']), {
        name: _.get(attribute, 'labels.ru_RU')
    });
};
exports.transformAttribute = transformAttribute;
