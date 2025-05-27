"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebPushService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const database_service_1 = require("../database/database.service");
const webPush = __importStar(require("web-push"));
const log_snag_service_1 = require("./../log-snag/log-snag.service");
const web_push_types_1 = require("./web-push.types");
let WebPushService = class WebPushService {
    constructor(configService, databaseService, logSnagService) {
        this.configService = configService;
        this.databaseService = databaseService;
        this.logSnagService = logSnagService;
        this.webPush = webPush;
        this.webPush.setVapidDetails(this.configService.getOrThrow('VAPID_SUBJECT'), this.configService.getOrThrow('VAPID_PUBLIC_KEY'), this.configService.getOrThrow('VAPID_PRIVATE_KEY'));
    }
    async getSubscriptionStatus(subscription, userId) {
        const response = await this.databaseService.webPushSubscription.findFirst({
            where: {
                userId,
                endpoint: subscription.endpoint,
                p256dh: subscription.keys.p256dh,
                auth: subscription.keys.auth,
            },
        });
        if (!response) {
            return {
                chatEnabled: false,
                calendarEnabled: false,
            };
        }
        await this.databaseService.webPushSubscription.update({
            where: {
                endpoint: subscription.endpoint,
            },
            data: {
                updatedAt: new Date(),
            },
        });
        return {
            chatEnabled: response.chatEnabled,
            calendarEnabled: response.calendarEnabled,
        };
    }
    getVapidPublicKey() {
        console.log('************************* getVapidPublicKey:', this.configService.getOrThrow('VAPID_PUBLIC_KEY'));
        return this.configService.getOrThrow('VAPID_PUBLIC_KEY');
    }
    async sendNotification(subscriptions, { title, body, data, type }) {
        let errors = 0;
        await Promise.all(subscriptions.map(async (subscription) => {
            try {
                await this.webPush.sendNotification(subscription, JSON.stringify({ title, body, data, type }));
            }
            catch (error) {
                const user = await this.databaseService.user.findFirst({
                    where: {
                        WebPushSubscription: {
                            some: {
                                endpoint: subscription.endpoint,
                            },
                        },
                    },
                });
                this.logSnagService.log('WEB_PUSH_ERROR', `Failed to send web push notification. Error: ${error.body}. Subscription endpoint: ${subscription.endpoint}`, 'web-push', user === null || user === void 0 ? void 0 : user.email);
                errors++;
            }
        }));
        if (errors > 0) {
            common_1.Logger.error(`Failed to send ${errors} notifications out of ${subscriptions.length}`);
        }
    }
    async updateSubscription(dto, userId) {
        const existingSubscription = await this.databaseService.webPushSubscription.findFirst({
            where: {
                endpoint: dto.subscription.endpoint,
            },
        });
        if (existingSubscription &&
            (existingSubscription.p256dh !== dto.subscription.keys.p256dh ||
                existingSubscription.auth !== dto.subscription.keys.auth)) {
            throw new common_1.ForbiddenException("The authentication details don't match");
        }
        if (existingSubscription && !dto.chatEnabled && !dto.calendarEnabled) {
            await this.databaseService.webPushSubscription.delete({
                where: {
                    endpoint: dto.subscription.endpoint,
                },
            });
            return;
        }
        if (!existingSubscription) {
            await this.databaseService.webPushSubscription.create({
                data: {
                    endpoint: dto.subscription.endpoint,
                    p256dh: dto.subscription.keys.p256dh,
                    auth: dto.subscription.keys.auth,
                    userId,
                    chatEnabled: dto.chatEnabled,
                    calendarEnabled: dto.calendarEnabled,
                },
            });
            return;
        }
        if (existingSubscription.userId !== userId) {
            await this.databaseService.webPushSubscription.delete({
                where: {
                    endpoint: dto.subscription.endpoint,
                },
            });
            await this.databaseService.webPushSubscription.create({
                data: {
                    endpoint: dto.subscription.endpoint,
                    p256dh: dto.subscription.keys.p256dh,
                    auth: dto.subscription.keys.auth,
                    userId,
                    chatEnabled: existingSubscription.chatEnabled,
                    calendarEnabled: existingSubscription.calendarEnabled,
                },
            });
            return;
        }
        await this.databaseService.webPushSubscription.update({
            where: {
                endpoint: dto.subscription.endpoint,
            },
            data: {
                chatEnabled: dto.chatEnabled,
                calendarEnabled: dto.calendarEnabled,
            },
        });
    }
    buildFromDatabase(dbObject) {
        return {
            endpoint: dbObject.endpoint,
            keys: {
                p256dh: dbObject.p256dh,
                auth: dbObject.auth,
            },
            userId: dbObject.userId,
        };
    }
    async getActiveSubscriptionsForUsers(userIds, type) {
        const sessionDurationMs = this.configService.getOrThrow('AUTH_SESSION_DURATION_MS');
        const subscriptions = await this.databaseService.webPushSubscription.findMany({
            where: {
                userId: {
                    in: userIds,
                },
                updatedAt: {
                    gte: new Date(Date.now() - sessionDurationMs),
                },
                chatEnabled: type === web_push_types_1.WebPushSubscriptionType.CHAT ? true : undefined,
                calendarEnabled: type === web_push_types_1.WebPushSubscriptionType.CALENDAR ? true : undefined,
            },
        });
        return subscriptions.map((subscription) => this.buildFromDatabase(subscription));
    }
    async deleteExpiredSubscriptions() {
        const sessionDurationMs = this.configService.getOrThrow('AUTH_SESSION_DURATION_MS');
        const subscriptions = await this.databaseService.webPushSubscription.findMany({
            where: {
                updatedAt: {
                    lt: new Date(Date.now() - sessionDurationMs),
                },
            },
        });
        this.databaseService.webPushSubscription.deleteMany({
            where: {
                id: {
                    in: subscriptions.map((subscription) => subscription.id),
                },
            },
        });
    }
};
WebPushService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        database_service_1.DatabaseService,
        log_snag_service_1.LogSnagService])
], WebPushService);
exports.WebPushService = WebPushService;
//# sourceMappingURL=web-push.service.js.map