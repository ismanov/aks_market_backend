"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CustomersModule = void 0;
var mongoose_1 = require("@nestjs/mongoose");
var common_1 = require("@nestjs/common");
var verification_module_1 = require("verification/verification.module");
var customer_schema_1 = require("customers/schemas/customer.schema");
var customers_controller_1 = require("customers/customers.controller");
var customers_service_1 = require("customers/customers.service");
var CustomersModule = /** @class */ (function () {
    function CustomersModule() {
    }
    CustomersModule = __decorate([
        (0, common_1.Module)({
            imports: [
                mongoose_1.MongooseModule.forFeature([{ name: 'Customers', schema: customer_schema_1.CustomerSchema }]),
                verification_module_1.VerificationModule,
            ],
            controllers: [customers_controller_1.CustomersController],
            providers: [customers_service_1.CustomersService],
            exports: [customers_service_1.CustomersService]
        })
    ], CustomersModule);
    return CustomersModule;
}());
exports.CustomersModule = CustomersModule;
