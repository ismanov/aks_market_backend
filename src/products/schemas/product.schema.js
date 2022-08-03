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
exports.ProductsSchema = exports.Product = void 0;
var mongoose_1 = require("@nestjs/mongoose");
var class_transformer_1 = require("class-transformer");
var mongoose_2 = require("mongoose");
var Product = /** @class */ (function (_super) {
    __extends(Product, _super);
    function Product() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        (0, class_transformer_1.Transform)(function (_a) {
            var value = _a.value;
            return value.toString();
        }),
        (0, mongoose_1.Prop)({ type: String })
    ], Product.prototype, "_id");
    __decorate([
        (0, mongoose_1.Prop)()
    ], Product.prototype, "prices");
    __decorate([
        (0, mongoose_1.Prop)()
    ], Product.prototype, "images");
    __decorate([
        (0, mongoose_1.Prop)()
    ], Product.prototype, "fullName");
    __decorate([
        (0, mongoose_1.Prop)()
    ], Product.prototype, "categories");
    Product = __decorate([
        (0, mongoose_1.Schema)()
    ], Product);
    return Product;
}(mongoose_2.Document));
exports.Product = Product;
exports.ProductsSchema = mongoose_1.SchemaFactory.createForClass(Product);
