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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const database_service_1 = require("./../database/database.service");
const bcrypt_1 = require("bcrypt");
const exclude_1 = require("../common/exclude");
const crypto_1 = require("crypto");
const config_1 = require("@nestjs/config");
let AuthService = class AuthService {
    constructor(jwtService, databaseService, configService) {
        this.jwtService = jwtService;
        this.databaseService = databaseService;
        this.configService = configService;
        this.passwordRecoveryTokenDurationMs = this.configService.getOrThrow('PASSWORD_RECOVERY_TOKEN_DURATION_MS');
        this.saltRounds = 10;
        this.jwtCookieOptions = {
            httpOnly: true,
            sameSite: 'lax',
            signed: true,
            secure: this.configService.getOrThrow('SECURE_COOKIES'),
            maxAge: this.configService.getOrThrow('AUTH_SESSION_DURATION_MS'),
            path: '/',
            domain: process.env.HOST,
        };
    }
    async setAuthCookie(response, { email, userId }) {
        response.cookie(this.configService.get('AUTH_COOKIE_NAME'), await this.generateJwtToken(email, userId), this.jwtCookieOptions);
    }
    async getUserIdFromJwt(jwt) {
        var _a;
        const payload = await this.jwtService.verifyAsync(jwt);
        return (_a = payload.sub) !== null && _a !== void 0 ? _a : null;
    }
    async resetPassword(dto) {
        const INVALID_OR_EXPIRED = 'auth.INVALID_OR_EXPIRED_TOKEN';
        const { newPassword, email, token } = dto;
        const user = await this.databaseService.user.findUniqueOrThrow({
            where: {
                email,
            },
        });
        const passwordRecoveryToken = await this.databaseService.passwordRecoveryToken.findUnique({
            where: {
                userId: user.id,
            },
        });
        if (!passwordRecoveryToken) {
            throw new common_1.BadRequestException(INVALID_OR_EXPIRED);
        }
        if (passwordRecoveryToken.createdAt &&
            new Date().getTime() - passwordRecoveryToken.createdAt.getTime() >
                this.passwordRecoveryTokenDurationMs) {
            throw new common_1.BadRequestException(INVALID_OR_EXPIRED);
        }
        const valid = await (0, bcrypt_1.compare)(token, passwordRecoveryToken.token);
        if (!valid)
            throw new common_1.BadRequestException(INVALID_OR_EXPIRED);
        const hashedPassword = await this.hashString(newPassword);
        await this.databaseService.user.update({
            where: {
                email,
            },
            data: {
                password: hashedPassword,
            },
        });
        await this.databaseService.passwordRecoveryToken.delete({
            where: {
                userId: user.id,
            },
        });
    }
    async generatePassRecoveryToken(forgotPasswordDto) {
        const user = await this.databaseService.user.findUniqueOrThrow({
            where: {
                email: forgotPasswordDto.email,
            },
        });
        await this.databaseService.passwordRecoveryToken.deleteMany({
            where: {
                userId: user.id,
            },
        });
        const token = (0, crypto_1.randomBytes)(6).toString('hex');
        await this.databaseService.passwordRecoveryToken.create({
            data: {
                token: await (0, bcrypt_1.hash)(token, this.saltRounds),
                user: {
                    connect: {
                        id: user.id,
                    },
                },
            },
        });
        return token;
    }
    async hashString(str) {
        return (0, bcrypt_1.hash)(str, this.saltRounds);
    }
    async checkEmailExists(email) {
        const user = await this.databaseService.user.findFirst({
            where: {
                email,
            },
        });
        return !!user;
    }
    async changePassword(userId, newPassword) {
        const password = await this.hashString(newPassword);
        await this.databaseService.user.update({
            where: {
                id: userId,
            },
            data: {
                password,
            },
        });
    }
    async getUserEmailPassword(email, password) {
        const user = await this.databaseService.user.findFirst({
            where: {
                email,
            },
        });
        if (!user || !(0, bcrypt_1.compareSync)(password, user.password)) {
            throw new common_1.BadRequestException('auth.INVALID_CREDENTIALS');
        }
        return (0, exclude_1.exclude)(user, ['password']);
    }
    async authenticateIdPassword(userId, password) {
        const user = await this.databaseService.user.findFirst({
            where: {
                id: userId,
            },
        });
        if (!user || !(0, bcrypt_1.compareSync)(password, user.password)) {
            throw new common_1.UnauthorizedException('auth.INVALID_CREDENTIALS');
        }
    }
    async generateJwtToken(email, userId) {
        const payload = { email: email, sub: userId };
        const token = await this.jwtService.signAsync(payload);
        return token;
    }
    async checkEmailVerificationCode(email, code) {
        const emailVerificationCode = await this.databaseService.emailVerificationToken.findFirst({
            where: {
                email,
            },
        });
        if (!emailVerificationCode) {
            return false;
        }
        if (!(0, bcrypt_1.compareSync)(code, emailVerificationCode.token) ||
            !(emailVerificationCode.createdAt > new Date(Date.now() - 30 * 60 * 1000))) {
            return false;
        }
        await this.databaseService.emailVerificationToken.deleteMany({
            where: {
                email,
            },
        });
        return true;
    }
    async registerUser(email, password) {
        const prevUser = await this.databaseService.user.findFirst({
            where: {
                email,
            },
        });
        if (prevUser) {
            throw new common_1.BadRequestException('auth.EMAIL_ALREADY_EXISTS');
        }
        const user = await this.databaseService.user.create({
            data: {
                password: await this.hashString(password),
                email,
            },
        });
        return (0, exclude_1.exclude)(user, ['password']);
    }
    async generateEmailVerificationCode(email) {
        const token = (0, crypto_1.randomBytes)(6).toString('hex');
        await this.databaseService.emailVerificationToken.deleteMany({
            where: {
                email,
            },
        });
        await this.databaseService.emailVerificationToken.create({
            data: {
                email,
                token: await this.hashString(token),
            },
        });
        return token;
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        database_service_1.DatabaseService,
        config_1.ConfigService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map