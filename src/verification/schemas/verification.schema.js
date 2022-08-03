"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.VerificationSchema = exports.Verification = void 0;
var mongoose_1 = require("@nestjs/mongoose");
var mongoose_2 = require("mongoose");
var Verification = /** @class */ (function (_super) {
    __extends(Verification, _super);
    function Verification() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        (0, mongoose_1.Prop)({ required: true })
    ], Verification.prototype, "code");
    __decorate([
        (0, mongoose_1.Prop)({ required: true })
    ], Verification.prototype, "phone");
    __decorate([
        (0, mongoose_1.Prop)({ required: true })
    ], Verification.prototype, "fullName");
    __decorate([
        (0, mongoose_1.Prop)({ "default": Date.now() })
    ], Verification.prototype, "createdDate");
    __decorate([
        (0, mongoose_1.Prop)({ "default": 0 })
    ], Verification.prototype, "attemptsNumber");
    Verification = __decorate([
        (0, mongoose_1.Schema)()
    ], Verification);
    return Verification;
}(mongoose_2.Document));
exports.Verification = Verification;
exports.VerificationSchema = mongoose_1.SchemaFactory.createForClass(Verification);
