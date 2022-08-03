"use strict";
exports.__esModule = true;
exports.generateRandomCode = void 0;
var generateRandomCode = function (length) {
    var result = '';
    for (var i = 0; i < length; i++) {
        result += String(Math.floor(Math.random() * 10));
    }
    return Number(result || 0);
};
exports.generateRandomCode = generateRandomCode;
