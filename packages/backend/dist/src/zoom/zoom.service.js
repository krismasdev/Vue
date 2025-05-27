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
exports.ZoomService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const crypto = __importStar(require("crypto"));
const database_service_1 = require("./../database/database.service");
let ZoomService = class ZoomService {
    constructor(configService, databaseService) {
        this.configService = configService;
        this.databaseService = databaseService;
    }
    async validateWebhook(req) {
        const signature = req.headers['x-zm-signature'];
        const timestamp = req.headers['x-zm-request-timestamp'];
        const body = req.rawBody.toString();
        const secret = this.configService.getOrThrow('ZOOM_WEBHOOK_SECRET');
        const message = 'v0:' + timestamp + ':' + body;
        const hashedMessage = crypto
            .createHmac('sha256', secret)
            .update(message)
            .digest('hex');
        const hashDigest = 'v0=' + hashedMessage;
        if (hashDigest !== signature) {
            throw new common_1.UnauthorizedException();
        }
    }
    handleUrlValidation(body) {
        const plainToken = body.payload.plainToken;
        const secret = this.configService.getOrThrow('ZOOM_WEBHOOK_SECRET');
        const hash = crypto
            .createHmac('sha256', secret)
            .update(plainToken)
            .digest('hex');
        return {
            plainToken: plainToken,
            encryptedToken: hash,
        };
    }
    async handleMeetingCreated(body) {
        const meetingId = body.payload.object.id;
        const joinUrl = body.payload.object.join_url;
        await this.databaseService.zoomMeeting.deleteMany({});
        await this.databaseService.zoomMeeting.create({
            data: {
                meetingId: meetingId.toString(),
                joinUrl: joinUrl,
            },
        });
    }
    async handleMeetingDeleted() {
        await this.databaseService.zoomMeeting.deleteMany({});
    }
    async getCurrentMeeting() {
        const meeting = await this.databaseService.zoomMeeting.findFirst();
        return meeting;
    }
};
ZoomService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        database_service_1.DatabaseService])
], ZoomService);
exports.ZoomService = ZoomService;
//# sourceMappingURL=zoom.service.js.map