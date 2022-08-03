"use strict";
exports.__esModule = true;
exports.transformProduct = void 0;
var _ = require("lodash");
var config_1 = require("../../config");
function getPath(key) {
    var p = 'attributes';
    _.forEach(config_1.akeneoConfig.products.attributes, function (items, k) {
        if (_.includes(items, key)) {
            p = k;
        }
    });
    return p;
}
var transformProduct = function (product) {
    var ps = _.concat(_.compact(_.map(config_1.akeneoConfig.products.attributes, function (c, k) {
        return _.size(c) > 1 ? k : null;
    })), ['attributes']);
    return _.assign(_.reduce(_.map(_.groupBy(_.map(_.get(product, 'values'), function (value, key) {
        return {
            id: key,
            path: getPath(key),
            data: _.get(_.first(value), 'data')
        };
    }), 'path'), function (props, key) {
        var _a, _b;
        if (_.size(props) > 1 || _.includes(ps, key)) {
            return _a = {},
                _a[key] = _.reduce(_.map(props, function (prop) {
                    var _a;
                    return _a = {},
                        _a[_.get(prop, 'id')] = _.get(prop, 'data'),
                        _a;
                }), _.merge, {}),
                _a;
        }
        else {
            return _b = {},
                _b[key] = _.get(_.first(props), 'data'),
                _b;
        }
    }), _.merge, {}), _.pick(product, [
        'identifier',
        'family',
        'categories',
        'enabled',
        'updated',
    ]));
};
exports.transformProduct = transformProduct;
