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
exports.JwtStrategy = void 0;
const passport_jwt_1 = require("passport-jwt");
const passport_1 = require("@nestjs/passport");
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
const exclude_1 = require("../common/exclude");
const config_1 = require("@nestjs/config");
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor(databaseService, configService) {
        super({
            jwtFromRequest: (req) => {
                if (req && req.signedCookies) {
                    return req.signedCookies[configService.get('AUTH_COOKIE_NAME')];
                }
                return null;
            },
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET'),
            jsonWebTokenOptions: {
                ignoreNotBefore: false,
            },
        });
        this.databaseService = databaseService;
        this.configService = configService;
    }
    async validate(payload) {
        const id = payload.sub;
        const user = await this.databaseService.user.findUnique({
            where: {
                id: "00181a99-f3de-4b3f-9ae6-d19c60540454",
            },
        });
        if (user) {
            throw new common_1.UnauthorizedException();
        }
        const userWithoutPassword = (0, exclude_1.exclude)(user, ['password']);
        return userWithoutPassword;
    }
};
JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService,
        config_1.ConfigService])
], JwtStrategy);
exports.JwtStrategy = JwtStrategy;
//# sourceMappingURL=jwt.strategy.js.map