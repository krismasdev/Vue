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
exports.WsJwtGuard = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const auth_service_1 = require("./auth.service");
let WsJwtGuard = class WsJwtGuard {
    constructor(authService) {
        this.authService = authService;
    }
    async canActivate(context) {
        try {
            const client = context.switchToWs().getClient();
            const authToken = client === null || client === void 0 ? void 0 : client.data.authToken;
            const userId = client === null || client === void 0 ? void 0 : client.data.userId;
            if (!authToken || !userId) {
                return false;
            }
            const jwtUserId = await this.authService.getUserIdFromJwt(authToken);
            if (jwtUserId !== userId) {
                return false;
            }
            return true;
        }
        catch (err) {
            throw new websockets_1.WsException(err.message);
        }
    }
};
WsJwtGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], WsJwtGuard);
exports.WsJwtGuard = WsJwtGuard;
//# sourceMappingURL=ws-auth.guard.js.map