"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetStatusDto = exports.SubscriptionDto = void 0;
const openapi = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class PushSubscriptionKeys {
    static _OPENAPI_METADATA_FACTORY() {
        return { p256dh: { required: true, type: () => String }, auth: { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PushSubscriptionKeys.prototype, "p256dh", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PushSubscriptionKeys.prototype, "auth", void 0);
class PushSubscription {
    static _OPENAPI_METADATA_FACTORY() {
        return { endpoint: { required: true, type: () => String }, keys: { required: true, type: () => PushSubscriptionKeys }, expirationTime: { required: false, type: () => Number } };
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PushSubscription.prototype, "endpoint", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => PushSubscriptionKeys),
    (0, class_validator_1.ValidateNested)(),
    __metadata("design:type", PushSubscriptionKeys)
], PushSubscription.prototype, "keys", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], PushSubscription.prototype, "expirationTime", void 0);
class SubscriptionDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { subscription: { required: true, type: () => PushSubscription }, chatEnabled: { required: true, type: () => Boolean }, calendarEnabled: { required: true, type: () => Boolean } };
    }
}
__decorate([
    (0, class_transformer_1.Type)(() => PushSubscription),
    (0, class_validator_1.ValidateNested)(),
    __metadata("design:type", PushSubscription)
], SubscriptionDto.prototype, "subscription", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], SubscriptionDto.prototype, "chatEnabled", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], SubscriptionDto.prototype, "calendarEnabled", void 0);
exports.SubscriptionDto = SubscriptionDto;
class GetStatusDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { subscription: { required: true, type: () => PushSubscription } };
    }
}
__decorate([
    (0, class_transformer_1.Type)(() => PushSubscription),
    (0, class_validator_1.ValidateNested)(),
    __metadata("design:type", PushSubscription)
], GetStatusDto.prototype, "subscription", void 0);
exports.GetStatusDto = GetStatusDto;
//# sourceMappingURL=subscription.dto.js.map