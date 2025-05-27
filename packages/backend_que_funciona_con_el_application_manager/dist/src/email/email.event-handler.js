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
exports.EmailEventHandler = void 0;
const common_1 = require("@nestjs/common");
const email_service_1 = require("./email.service");
const event_emitter_1 = require("@nestjs/event-emitter");
const user_onboarded_event_1 = require("../event-emitter/users/user-onboarded.event");
const user_accepted_event_1 = require("../event-emitter/users/user-accepted.event");
const event_created_event_1 = require("../event-emitter/events/event-created.event");
let EmailEventHandler = class EmailEventHandler {
    constructor(emailService) {
        this.emailService = emailService;
    }
    async handleUserOnboardedEvent(payload) {
        await this.emailService.sendUserOnboardedToAdmins({
            fullName: payload.fullName,
        });
    }
    async handleUserAcceptedEvent(payload) {
        await this.emailService.sendWelcome({
            to: payload.email,
            fullName: payload.fullName,
        });
    }
    async handleEventCreatedEvent(payload) {
        this.emailService.sendNewEventNotification({
            eventId: payload.eventId,
        });
    }
    async handleUserBlockedCalendar(to) {
        this.emailService.sendEmailAboutBlockedCalendar(to);
    }
    async handleBookingForWaitlist(to) {
        this.emailService.sendEmailAboutWaitlist(to);
    }
};
__decorate([
    (0, event_emitter_1.OnEvent)('user.onboarded'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_onboarded_event_1.UserOnboardedEvent]),
    __metadata("design:returntype", Promise)
], EmailEventHandler.prototype, "handleUserOnboardedEvent", null);
__decorate([
    (0, event_emitter_1.OnEvent)('user.accepted'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_accepted_event_1.UserAcceptedEvent]),
    __metadata("design:returntype", Promise)
], EmailEventHandler.prototype, "handleUserAcceptedEvent", null);
__decorate([
    (0, event_emitter_1.OnEvent)('event.created'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [event_created_event_1.EventCreatedEvent]),
    __metadata("design:returntype", Promise)
], EmailEventHandler.prototype, "handleEventCreatedEvent", null);
__decorate([
    (0, event_emitter_1.OnEvent)('user.calendar_blocked'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmailEventHandler.prototype, "handleUserBlockedCalendar", null);
__decorate([
    (0, event_emitter_1.OnEvent)('user.waitlist'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmailEventHandler.prototype, "handleBookingForWaitlist", null);
EmailEventHandler = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [email_service_1.EmailService])
], EmailEventHandler);
exports.EmailEventHandler = EmailEventHandler;
//# sourceMappingURL=email.event-handler.js.map