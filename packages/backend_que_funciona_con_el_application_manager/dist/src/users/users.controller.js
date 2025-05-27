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
exports.UsersController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const auth_decorator_1 = require("../auth/auth.decorator");
const users_service_1 = require("./users.service");
const dto_1 = require("./dto");
const user_decorator_1 = require("../auth/user.decorator");
const platform_express_1 = require("@nestjs/platform-express");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const common_2 = require("@aula-anclademia/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const user_onboarded_event_1 = require("../event-emitter/users/user-onboarded.event");
const user_accepted_event_1 = require("../event-emitter/users/user-accepted.event");
const schedule_1 = require("@nestjs/schedule");
let UsersController = class UsersController {
    constructor(usersService, eventEmitter) {
        this.usersService = usersService;
        this.eventEmitter = eventEmitter;
    }
    async cleanUpOrphanedProfilePics() {
        const deleted = await this.usersService.cleanUpOrphanedProfilePics();
        common_1.Logger.log(`Deleted ${deleted} orphaned user profile pics`);
    }
    async getBasicInfo() {
        const users = await this.usersService.findAllBasicInfo();
        return users;
    }
    getMeProfile(userId) {
        return this.usersService.findOneById(userId);
    }
    getUser(userId) {
        return this.usersService.findOneById(userId);
    }
    getUserByPhone(phone) {
        return this.usersService.findOneByPhone(phone);
    }
    async getAllUsers({ pendingTaskId, roles, search, courseId, createdAt }) {
        if (typeof search !== 'string' && typeof search !== 'undefined') {
            throw new common_1.BadRequestException('Invalid search query');
        }
        const users = await this.usersService.findAllPublic({
            pendingTaskId,
            roles,
            search,
            courseId,
            createdAt,
        });
        return users;
    }
    async getUsersByEmails(emails) {
        if (!emails || emails.length === 0) {
            throw new common_1.BadRequestException('Email array cannot be empty');
        }
        const users = await this.usersService.findUsersByEmails(emails);
        return users;
    }
    updateUserInfo(userId, updateUserDto) {
        return this.usersService.updateUser(updateUserDto, userId);
    }
    updateIsActive(userId, isActive) {
        return this.usersService.updateIsActive(userId, isActive);
    }
    async updateCalendarAccess(userId, isCalendarEnable) {
        const { user, waitlistEmails } = await this.usersService.updateCalendarAccess(userId, isCalendarEnable);
        if (!user.isCalendarEnable) {
            this.eventEmitter.emit('user.calendar_blocked', user.email);
        }
        if (waitlistEmails.length > 0) {
            waitlistEmails.forEach((email) => {
                this.eventEmitter.emit('user.waitlist', email);
            });
        }
    }
    deleteUser(userId) {
        return this.usersService.delete(userId);
    }
    updateProfile(updateProfileDto, newImage, user) {
        if (newImage) {
            if (!common_2.VALID_PROFILEPIC_MIMETYPES.includes(newImage.mimetype)) {
                throw new common_1.BadRequestException('Invalid image mimetype');
            }
        }
        if (updateProfileDto instanceof dto_1.UpdateStudentProfileDto) {
            if (user.role != 'STUDENT') {
                throw new common_1.BadRequestException('You are not a student');
            }
            return this.usersService.updateProfile(updateProfileDto, user.id, newImage);
        }
        else if (updateProfileDto instanceof dto_1.UpdateManagerProfileDto) {
            if (user.role != 'ADMIN' && user.role != 'TEACHER') {
                throw new common_1.BadRequestException('You are not a manager');
            }
            return this.usersService.updateProfile(updateProfileDto, user.id, newImage);
        }
    }
    changePassword(changePasswordDto, userId) {
        return this.usersService.changePassword(changePasswordDto, userId);
    }
    async onboardUser(profilePic, onboardUserDto, userId) {
        await this.usersService.onboardUser(onboardUserDto, profilePic, userId);
        const user = await this.usersService.findOneById(userId);
        this.eventEmitter.emit('user.onboarded', new user_onboarded_event_1.UserOnboardedEvent(userId, user.firstName + ' ' + user.lastName));
    }
    async acceptUser(userId) {
        await this.usersService.acceptAwaitingApproval(userId);
        const user = await this.usersService.findOneById(userId);
        await this.usersService
            .setSendinblueAttribute({
            email: user.email,
            attributeKey: 'WHATSAPP',
            attributeValue: user.phoneNumber,
        })
            .catch((e) => common_1.Logger.error(e));
        this.eventEmitter.emit('user.accepted', new user_accepted_event_1.UserAcceptedEvent(userId, user.firstName + ' ' + user.lastName, user.email));
    }
    changeEmail(changeEmailDto, userId) {
        return this.usersService.changeEmail(changeEmailDto, userId);
    }
    changeEmailNotifications(receiveEmailsOnNewEvent, userId) {
        return this.usersService.updateEmailNotificationSettings(userId, receiveEmailsOnNewEvent);
    }
};
__decorate([
    (0, schedule_1.Cron)(process.env.NODE_ENV === 'production'
        ? schedule_1.CronExpression.EVERY_DAY_AT_4AM
        : schedule_1.CronExpression.EVERY_5_SECONDS),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "cleanUpOrphanedProfilePics", null);
__decorate([
    (0, auth_decorator_1.Auth)('ADMIN', 'TEACHER', 'STUDENT'),
    (0, common_1.Get)('basic-info'),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getBasicInfo", null);
__decorate([
    (0, auth_decorator_1.Auth)('ALL'),
    (0, common_1.Get)('me'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, user_decorator_1.User)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getMeProfile", null);
__decorate([
    (0, auth_decorator_1.Auth)('ADMIN', 'TEACHER'),
    (0, common_1.Get)(':id'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getUser", null);
__decorate([
    (0, auth_decorator_1.Auth)('ADMIN', 'TEACHER'),
    (0, common_1.Get)('phone/:number'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('number')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getUserByPhone", null);
__decorate([
    (0, auth_decorator_1.Auth)('ADMIN', 'TEACHER'),
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.GetAllUsersQueryDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getAllUsers", null);
__decorate([
    (0, auth_decorator_1.Auth)('ADMIN', 'TEACHER'),
    (0, common_1.Post)('find-by-emails'),
    openapi.ApiResponse({ status: 201, type: [Object] }),
    __param(0, (0, common_1.Body)('emails')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUsersByEmails", null);
__decorate([
    (0, auth_decorator_1.Auth)('ADMIN'),
    (0, common_1.Put)(':id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateUserDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "updateUserInfo", null);
__decorate([
    (0, auth_decorator_1.Auth)('ADMIN'),
    (0, common_1.Put)(':id/is-active'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('isActive', common_1.ParseBoolPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "updateIsActive", null);
__decorate([
    (0, auth_decorator_1.Auth)('ADMIN'),
    (0, common_1.Put)(':id/calendar-access'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('isCalendarEnable', common_1.ParseBoolPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateCalendarAccess", null);
__decorate([
    (0, auth_decorator_1.Auth)('ADMIN'),
    (0, common_1.Delete)(':id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('newImage')),
    (0, auth_decorator_1.Auth)('STUDENT', 'ADMIN', 'TEACHER'),
    (0, common_1.Put)('me/update-profile'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Body)({
        transform: async (value) => {
            let transformed;
            if (value.birthDate) {
                transformed = (0, class_transformer_1.plainToInstance)(dto_1.UpdateStudentProfileDto, value);
            }
            else {
                transformed = (0, class_transformer_1.plainToInstance)(dto_1.UpdateManagerProfileDto, value);
            }
            const validation = await (0, class_validator_1.validate)(transformed);
            if (validation.length > 0) {
                const validationPipe = new common_1.ValidationPipe();
                const exceptionFactory = validationPipe.createExceptionFactory();
                throw exceptionFactory(validation);
            }
            return transformed;
        },
    })),
    __param(1, (0, common_1.UploadedFile)(new common_1.ParseFilePipe({
        fileIsRequired: false,
        validators: [
            new common_1.MaxFileSizeValidator({ maxSize: common_2.MAX_PROFILEPIC_FILE_SIZE }),
        ],
    }))),
    __param(2, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "updateProfile", null);
__decorate([
    (0, auth_decorator_1.Auth)('STUDENT', 'ADMIN', 'TEACHER'),
    (0, common_1.Put)('me/password'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.User)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.ChangePasswordDto, String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "changePassword", null);
__decorate([
    (0, auth_decorator_1.Auth)('NEWUSER'),
    (0, common_1.Put)('me/onboard'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('profilePic')),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.UploadedFile)(new common_1.ParseFilePipe({
        fileIsRequired: true,
        validators: [
            new common_1.MaxFileSizeValidator({ maxSize: common_2.MAX_PROFILEPIC_FILE_SIZE }),
        ],
    }))),
    __param(1, (0, common_1.Body)({
        transform: async (value) => {
            let transformed;
            if (value.birthDate) {
                transformed = (0, class_transformer_1.plainToInstance)(dto_1.OnboardStudentDto, value);
            }
            else {
                transformed = (0, class_transformer_1.plainToInstance)(dto_1.OnboardTeacherDto, value);
            }
            const validation = await (0, class_validator_1.validate)(transformed);
            if (validation.length > 0) {
                const validationPipe = new common_1.ValidationPipe();
                const exceptionFactory = validationPipe.createExceptionFactory();
                throw exceptionFactory(validation);
            }
            return transformed;
        },
    })),
    __param(2, (0, user_decorator_1.User)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "onboardUser", null);
__decorate([
    (0, auth_decorator_1.Auth)('ADMIN'),
    (0, common_1.Put)(':id/accept'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "acceptUser", null);
__decorate([
    (0, auth_decorator_1.Auth)('STUDENT', 'ADMIN', 'TEACHER'),
    (0, common_1.Put)('me/email'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.User)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.ChangeEmailDto, String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "changeEmail", null);
__decorate([
    (0, auth_decorator_1.Auth)('ADMIN', 'TEACHER', 'STUDENT'),
    (0, common_1.Put)('me/email-notifications'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Body)('receiveEmailsOnNewEvent', common_1.ParseBoolPipe)),
    __param(1, (0, user_decorator_1.User)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean, String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "changeEmailNotifications", null);
UsersController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        event_emitter_1.EventEmitter2])
], UsersController);
exports.UsersController = UsersController;
//# sourceMappingURL=users.controller.js.map