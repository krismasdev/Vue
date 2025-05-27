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
exports.WebpushEventHandler = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const chat_1 = require("../event-emitter/chat");
const web_push_service_1 = require("./web-push.service");
const database_service_1 = require("../database/database.service");
const enums_1 = require("../event-emitter/enums");
const event_created_event_1 = require("../event-emitter/events/event-created.event");
const web_push_types_1 = require("./web-push.types");
let WebpushEventHandler = class WebpushEventHandler {
    constructor(webPushService, databaseService) {
        this.webPushService = webPushService;
        this.databaseService = databaseService;
    }
    async newMessage(payload) {
        const message = await this.databaseService.message.findUnique({
            where: {
                id: payload.messageId,
            },
            include: {
                sender: true,
                chat: {
                    include: {
                        users: true,
                    },
                },
            },
        });
        const subscriptions = (await this.webPushService.getActiveSubscriptionsForUsers(message.chat.users.map((relation) => relation.userId), web_push_types_1.WebPushSubscriptionType.CHAT)).filter((subscription) => subscription.userId !== message.sender.id);
        await this.webPushService.sendNotification(subscriptions, {
            type: 'chat',
            title: `${message.sender.firstName} ${message.sender.lastName}`,
            body: message.content,
            data: {
                chatId: message.chatId,
            },
        });
    }
    async eventCreated(payload) {
        const courses = await this.databaseService.course.findMany({
            where: {
                predefinedEvents: {
                    some: {
                        predefinedEvent: {
                            events: {
                                some: {
                                    id: payload.eventId,
                                },
                            },
                        },
                    },
                },
            },
            include: {
                students: {
                    select: {
                        id: true,
                    },
                },
            },
        });
        const userIds = courses.flatMap((course) => course.students.map((student) => student.id));
        const subscriptions = await this.webPushService.getActiveSubscriptionsForUsers(userIds, web_push_types_1.WebPushSubscriptionType.CALENDAR);
        const event = await this.databaseService.event.findUniqueOrThrow({
            where: {
                id: payload.eventId,
            },
            include: {
                predefinedEvent: true,
            },
        });
        await this.webPushService.sendNotification(subscriptions, {
            type: 'calendar',
            title: 'Nuevo evento disponible',
            body: event.isClub ? event.title : event.predefinedEvent.title,
            data: {
                eventId: payload.eventId,
            },
        });
    }
};
__decorate([
    (0, event_emitter_1.OnEvent)('chat.newMessage'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [chat_1.NewMessageEvent]),
    __metadata("design:returntype", Promise)
], WebpushEventHandler.prototype, "newMessage", null);
__decorate([
    (0, event_emitter_1.OnEvent)(enums_1.EventEvents.EVENT_CREATED),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [event_created_event_1.EventCreatedEvent]),
    __metadata("design:returntype", Promise)
], WebpushEventHandler.prototype, "eventCreated", null);
WebpushEventHandler = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [web_push_service_1.WebPushService,
        database_service_1.DatabaseService])
], WebpushEventHandler);
exports.WebpushEventHandler = WebpushEventHandler;
//# sourceMappingURL=web-push.event-handler.js.map