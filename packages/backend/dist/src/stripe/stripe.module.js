"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeModule = exports.MODULE_OPTIONS_TOKEN = exports.ConfigurableModuleClass = void 0;
const common_1 = require("@nestjs/common");
_a = new common_1.ConfigurableModuleBuilder()
    .setClassMethodName('forRoot')
    .setExtras({
    isGlobal: true,
}, (definition, extras) => (Object.assign(Object.assign({}, definition), { global: extras.isGlobal })))
    .build(), exports.ConfigurableModuleClass = _a.ConfigurableModuleClass, exports.MODULE_OPTIONS_TOKEN = _a.MODULE_OPTIONS_TOKEN;
const common_2 = require("@nestjs/common");
const stripe_service_1 = require("./stripe.service");
let StripeModule = class StripeModule extends exports.ConfigurableModuleClass {
};
StripeModule = __decorate([
    (0, common_2.Module)({
        providers: [stripe_service_1.StripeService],
        exports: [stripe_service_1.StripeService],
        imports: [],
    })
], StripeModule);
exports.StripeModule = StripeModule;
//# sourceMappingURL=stripe.module.js.map