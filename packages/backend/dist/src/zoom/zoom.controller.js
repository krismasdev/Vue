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
exports.ZoomController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const zoom_service_1 = require("./zoom.service");
const common_2 = require("@nestjs/common");
const common_3 = require("@nestjs/common");
const auth_decorator_1 = require("../auth/auth.decorator");
let ZoomController = class ZoomController {
    constructor(zoomService) {
        this.zoomService = zoomService;
    }
    async webhook(body, req) {
        await this.zoomService.validateWebhook(req);
        switch (body.event) {
            case 'endpoint.url_validation':
                const validationRes = this.zoomService.handleUrlValidation(body);
                return validationRes;
            case 'meeting.created':
                await this.zoomService.handleMeetingCreated(body);
                break;
            case 'meeting.deleted':
                await this.zoomService.handleMeetingDeleted();
                break;
            case 'meeting.ended':
                await this.zoomService.handleMeetingDeleted();
                break;
            default:
                throw new common_1.BadRequestException('Invalid event type');
        }
    }
    async getCurrentMeeting() {
        return this.zoomService.getCurrentMeeting();
    }
};
__decorate([
    (0, common_2.Post)('webhook'),
    (0, common_1.HttpCode)(200),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_2.Body)()),
    __param(1, (0, common_3.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ZoomController.prototype, "webhook", null);
__decorate([
    (0, auth_decorator_1.Auth)('ADMIN', 'TEACHER', 'STUDENT'),
    (0, common_1.Get)('meeting'),
    openapi.ApiResponse({ status: 200, type: require("./response/zoom-meeting.response").ZoomMeetingResponse }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ZoomController.prototype, "getCurrentMeeting", null);
ZoomController = __decorate([
    (0, common_1.Controller)('zoom'),
    __metadata("design:paramtypes", [zoom_service_1.ZoomService])
], ZoomController);
exports.ZoomController = ZoomController;
//# sourceMappingURL=zoom.controller.js.map