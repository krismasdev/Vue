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
exports.AuthController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const dto_1 = require("./dto");
const config_1 = require("@nestjs/config");
const email_service_1 = require("../email/email.service");
const users_service_1 = require("../users/users.service");
const auth_decorator_1 = require("./auth.decorator");
let AuthController = class AuthController {
    constructor(authService, configService, emailService, usersService) {
        this.authService = authService;
        this.configService = configService;
        this.emailService = emailService;
        this.usersService = usersService;
    }
    async login(loginDto, response) {
        const user = await this.authService.getUserEmailPassword(loginDto.email, loginDto.password);
        if (!user.isActive) {
            throw new common_1.ForbiddenException();
        }
        await this.authService.setAuthCookie(response, {
            userId: user.id,
            email: user.email,
        });
    }
    async register(createUserDto, response) {
        const isCodeValid = await this.authService.checkEmailVerificationCode(createUserDto.email, createUserDto.emailVerificationCode);
        if (!isCodeValid) {
            throw new common_1.BadRequestException('auth.INVALID_OR_EXPIRED_TOKEN');
        }
        const user = await this.authService.registerUser(createUserDto.email, createUserDto.password);
        await this.authService.setAuthCookie(response, {
            userId: user.id,
            email: user.email,
        });
    }
    async logout(response) {
        response.clearCookie(this.configService.get('AUTH_COOKIE_NAME'));
    }
    async generateEmailVerificationCode(emailVerificationCodeReqDto) {
        const emailExists = await this.authService.checkEmailExists(emailVerificationCodeReqDto.email);
        if (emailExists) {
            throw new common_1.BadRequestException('auth.EMAIL_ALREADY_EXISTS');
        }
        const emailVerificationCode = await this.authService.generateEmailVerificationCode(emailVerificationCodeReqDto.email);
        await this.emailService.sendEmailVerificationCodeRegister({
            to: emailVerificationCodeReqDto.email,
            verificationCode: emailVerificationCode,
        });
    }
    async changeEmail(emailVerificationCodeReqDto) {
        const emailExists = await this.authService.checkEmailExists(emailVerificationCodeReqDto.email);
        if (emailExists) {
            throw new common_1.BadRequestException('auth.EMAIL_ALREADY_EXISTS');
        }
        const emailVerificationCode = await this.authService.generateEmailVerificationCode(emailVerificationCodeReqDto.email);
        await this.emailService.sendEmailVerificationCodeChange({
            to: emailVerificationCodeReqDto.email,
            verificationCode: emailVerificationCode,
        });
    }
    async emailPasswordRecoveryToken(dto) {
        const token = await this.authService.generatePassRecoveryToken(dto);
        await this.emailService.sendForgotPasswordCode({
            to: dto.email,
            recoveryToken: token,
        });
    }
    async changePassword(dto) {
        await this.authService.resetPassword(dto);
    }
};
__decorate([
    (0, common_1.Post)('login'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.LoginDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('register'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.RegisterDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('logout'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)('email-verification/register'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.EmailVerificationCodeReqDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "generateEmailVerificationCode", null);
__decorate([
    (0, common_1.Post)('email-verification/change-email'),
    (0, auth_decorator_1.Auth)(),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.EmailVerificationCodeReqDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "changeEmail", null);
__decorate([
    (0, common_1.Post)('forgot-password/request'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.PasswordTokenReqDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "emailPasswordRecoveryToken", null);
__decorate([
    (0, common_1.Post)('forgot-password/change'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.ResetPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "changePassword", null);
AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        config_1.ConfigService,
        email_service_1.EmailService,
        users_service_1.UsersService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map