"use strict";
exports.__esModule = true;
exports.makeQueryParams = void 0;
var makeQueryParams = function (filter) {
    if (!filter)
        return '';
    var firstTime = true;
    return Object.keys(filter)
        .map(function (key) {
        if (filter[key] !== undefined && String(filter[key]) !== '') {
            var result = "".concat(firstTime ? '?' : '&').concat(key, "=").concat(filter[key]);
            firstTime = false;
            return result;
        }
        else {
            return undefined;
        }
    })
        .filter(function (item) { return !!item; })
        .join('');
};
exports.makeQueryParams = makeQueryParams;
