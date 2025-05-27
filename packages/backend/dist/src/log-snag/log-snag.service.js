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
exports.LogSnagService = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let LogSnagService = class LogSnagService {
    constructor(httpService, configService) {
        this.httpService = httpService;
        this.configService = configService;
        this.logSnagUrl = 'https://api.logsnag.com/v1/log';
        this.config = {
            project: this.configService.get('LOG_SNAG_PROJECT'),
            apiKey: this.configService.get('LOG_SNAG_API_KEY'),
            active: this.configService.get('LOG_SNAG_ACTIVE', false),
        };
    }
    async log(event, description, channel, userIdentifier) {
        if (!this.config.active) {
            return;
        }
        if (!this.config.project || !this.config.apiKey) {
            common_1.Logger.error('LogSnag is not configured correctly');
            return;
        }
        const opts = {
            method: 'post',
            maxBodyLength: Infinity,
            url: this.logSnagUrl,
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + this.config.apiKey,
            },
        };
        const body = {
            project: this.config.project,
            channel,
            event,
            description,
            user_id: userIdentifier,
        };
        try {
            await this.httpService.axiosRef.post(opts.url, body, {
                headers: opts.headers,
            });
        }
        catch (err) {
            common_1.Logger.error(err);
        }
    }
};
LogSnagService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService])
], LogSnagService);
exports.LogSnagService = LogSnagService;
//# sourceMappingURL=log-snag.service.js.map