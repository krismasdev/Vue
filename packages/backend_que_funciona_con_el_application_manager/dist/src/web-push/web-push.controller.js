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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebPushController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const web_push_service_1 = require("./web-push.service");
const common_2 = require("@nestjs/common");
const user_decorator_1 = require("../auth/user.decorator");
const auth_decorator_1 = require("../auth/auth.decorator");
const subscription_dto_1 = require("./dto/subscription.dto");
const web_push_response_1 = require("./web-push.response");
const schedule_1 = require("@nestjs/schedule");
let WebPushController = class WebPushController {
    constructor(webPushService) {
        this.webPushService = webPushService;
    }
    async deleteExpiredSubscriptions() {
        await this.webPushService.deleteExpiredSubscriptions();
    }
    async getVapidPublicKey() {
        return await this.webPushService.getVapidPublicKey();
    }
    async updateSubscription(body, userId) {
        await this.webPushService.updateSubscription(body, userId);
    }
    async getSubscriptionStatus(body, userId) {
        const status = await this.webPushService.getSubscriptionStatus(body.subscription, userId);
        return new web_push_response_1.WebPushResponse(status.chatEnabled, status.calendarEnabled);
    }
};
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_HOUR),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WebPushController.prototype, "deleteExpiredSubscriptions", null);
__decorate([
    (0, auth_decorator_1.Auth)('TEACHER', 'STUDENT', 'ADMIN'),
    (0, common_1.Post)('vapid-public-key'),
    openapi.ApiResponse({ status: 201, type: String }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WebPushController.prototype, "getVapidPublicKey", null);
__decorate([
    (0, auth_decorator_1.Auth)('TEACHER', 'STUDENT', 'ADMIN'),
    (0, common_1.Post)('subscription'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_2.Body)()),
    __param(1, (0, user_decorator_1.User)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [subscription_dto_1.SubscriptionDto, String]),
    __metadata("design:returntype", Promise)
], WebPushController.prototype, "updateSubscription", null);
__decorate([
    (0, auth_decorator_1.Auth)('TEACHER', 'STUDENT', 'ADMIN'),
    (0, common_1.Post)('subscription-status'),
    openapi.ApiResponse({ status: 201, type: require("./web-push.response").WebPushResponse }),
    __param(0, (0, common_2.Body)()),
    __param(1, (0, user_decorator_1.User)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [subscription_dto_1.GetStatusDto, String]),
    __metadata("design:returntype", Promise)
], WebPushController.prototype, "getSubscriptionStatus", null);
WebPushController = __decorate([
    (0, common_1.Controller)('web-push'),
    __metadata("design:paramtypes", [web_push_service_1.WebPushService])
], WebPushController);
exports.WebPushController = WebPushController;
//# sourceMappingURL=web-push.controller.js.map