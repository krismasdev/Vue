"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WoocommerceModule = void 0;
const common_1 = require("@nestjs/common");
const woocommerce_service_1 = require("./woocommerce.service");
const axios_1 = require("@nestjs/axios");
let WoocommerceModule = class WoocommerceModule {
};
WoocommerceModule = __decorate([
    (0, common_1.Module)({
        providers: [woocommerce_service_1.WoocommerceService],
        imports: [axios_1.HttpModule],
        exports: [woocommerce_service_1.WoocommerceService],
    })
], WoocommerceModule);
exports.WoocommerceModule = WoocommerceModule;
//# sourceMappingURL=woocommerce.module.js.map