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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
const dto_1 = require("./dto");
const exclude_1 = require("../common/exclude");
const auth_service_1 = require("../auth/auth.service");
const client_1 = require("@prisma/client");
const config_1 = require("@nestjs/config");
const sharp_1 = __importDefault(require("sharp"));
const SibApiV3Sdk = __importStar(require("@sendinblue/client"));
const date_fns_1 = require("date-fns");
const schedule_1 = require("@nestjs/schedule");
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
let UsersService = class UsersService {
    constructor(databaseService, authService, configService) {
        this.databaseService = databaseService;
        this.authService = authService;
        this.configService = configService;
        this.LOCAL_PROFILE_PICTURE_DIRECTORY = this.configService.get('LOCAL_PROFILE_PICTURE_DIRECTORY');
        this.shouldGenerateRandomPictureWhenNull = this.configService.getOrThrow('GENERATE_RANDOM_PROFILE_PICTURE') ===
            'true' ||
            this.configService.getOrThrow('GENERATE_RANDOM_PROFILE_PICTURE') === true;
        this.PROFILE_PICTURE_BASE_URL = this.configService.getOrThrow('PROFILE_PICTURE_BASE_URL');
    }
    sanitizeUser(user) {
        return (0, exclude_1.exclude)(user, ['password', 'profilePicturePath']);
    }
    async resetExpiredCalendarDeadlines() {
        const users = await this.databaseService.user.findMany({
            where: {
                isCalendarEnable: false,
            },
        });
        const usersToUpdate = users.filter((user) => user.calendarBlockingDeadline &&
            (0, date_fns_1.isBefore)(new Date(user.calendarBlockingDeadline), new Date()));
        if (usersToUpdate.length > 0) {
            await this.databaseService.$transaction(usersToUpdate.map((user) => this.databaseService.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    calendarBlockingDeadline: null,
                    isCalendarEnable: true,
                },
            })));
        }
    }
    async buildProfilePicture(originalImage) {
        const resizedImage = await (0, sharp_1.default)(originalImage.buffer)
            .resize({ width: 150, height: 150 })
            .withMetadata()
            .toBuffer();
        const resizedFile = Object.assign(Object.assign({}, originalImage), { buffer: resizedImage });
        return resizedFile;
    }
    async cleanUpOrphanedProfilePics() {
        const users = await this.databaseService.user.findMany({
            select: {
                id: true,
                profilePicturePath: true,
            },
        });
        let listedFiles = [];
        try {
            listedFiles = await fs.readdir(this.LOCAL_PROFILE_PICTURE_DIRECTORY);
        }
        catch (error) {
            if (error instanceof Error && error.code === 'ENOENT') {
                return 0;
            }
            common_1.Logger.error(`Error listing local profile pictures: ${error instanceof Error ? error.message : error}`);
            throw new common_1.InternalServerErrorException('Could not list local profile pictures');
        }
        const userPictureFilenames = users
            .map((user) => user.profilePicturePath ? path.basename(user.profilePicturePath) : null)
            .filter((filename) => filename !== null);
        const orphanedFiles = listedFiles.filter((fileName) => {
            return !userPictureFilenames.includes(fileName);
        });
        if (orphanedFiles.length === 0) {
            return 0;
        }
        let deletedCount = 0;
        for (const fileName of orphanedFiles) {
            const filePath = path.join(this.LOCAL_PROFILE_PICTURE_DIRECTORY, fileName);
            try {
                await fs.unlink(filePath);
                deletedCount++;
            }
            catch (error) {
                common_1.Logger.error(`Error deleting orphaned profile picture ${filePath}: ${error instanceof Error ? error.message : error}`);
            }
        }
        return deletedCount;
    }
    async updateEmailNotificationSettings(userId, receiveEmailsOnNewEvent) {
        await this.databaseService.user.update({
            where: {
                id: userId,
            },
            data: {
                receiveEmailsOnNewEvent,
            },
        });
    }
    async setSendinblueAttribute({ email, attributeKey, attributeValue, }) {
        const sendinblueApiKey = this.configService.getOrThrow('SENDINBLUE_API_KEY');
        const sendinblueInstance = new SibApiV3Sdk.ContactsApi();
        sendinblueInstance.setApiKey(SibApiV3Sdk.ContactsApiApiKeys.apiKey, sendinblueApiKey);
        const updateContact = new SibApiV3Sdk.UpdateContact();
        updateContact.attributes = {
            [attributeKey]: attributeValue,
        };
        await sendinblueInstance.updateContact(email, updateContact);
    }
    buildPictureUrl(profilePicturePath, id) {
        return profilePicturePath
            ? profilePicturePath
            : this.shouldGenerateRandomPictureWhenNull
                ? `https://i.pravatar.cc/150?u=${id}`
                : null;
    }
    async updateIsActive(id, isActive) {
        await this.databaseService.user.update({
            where: {
                id,
            },
            data: {
                isActive,
            },
        });
    }
    async updateCalendarAccess(userId, isCalendarEnable) {
        const deadline = (0, date_fns_1.addDays)(new Date(), 15);
        const waitlistEmails = [];
        if (!isCalendarEnable) {
            const events = await this.databaseService.usersOnEvents.findMany({
                where: {
                    userId,
                    event: {
                        startDate: {
                            lte: deadline,
                        },
                    },
                },
                select: {
                    eventId: true,
                },
            });
            await this.databaseService.usersOnEvents.deleteMany({
                where: {
                    userId,
                    event: {
                        startDate: {
                            lte: deadline,
                        },
                    },
                },
            });
            for (const { eventId } of events) {
                const firstWaitlistedUser = await this.databaseService.usersOnEvents.findFirst({
                    where: {
                        eventId,
                        waitlistEventId: eventId,
                    },
                    orderBy: {
                        createdAt: 'asc',
                    },
                    include: {
                        user: {
                            select: {
                                email: true,
                            },
                        },
                    },
                });
                if (firstWaitlistedUser) {
                    await this.databaseService.usersOnEvents.update({
                        where: {
                            userId_eventId: {
                                userId: firstWaitlistedUser.userId,
                                eventId,
                            },
                        },
                        data: {
                            waitlistEventId: null,
                        },
                    });
                    if (!waitlistEmails.includes(firstWaitlistedUser.user.email)) {
                        waitlistEmails.push(firstWaitlistedUser.user.email);
                    }
                }
            }
        }
        const user = await this.databaseService.user.update({
            where: {
                id: userId,
            },
            data: {
                isCalendarEnable,
                calendarBlockingDeadline: isCalendarEnable ? null : deadline,
            },
        });
        return {
            user,
            waitlistEmails,
        };
    }
    async findOneById(id) {
        const user = await this.databaseService.user.findUniqueOrThrow({
            where: {
                id,
            },
            include: {
                course: true,
                chats: true,
                events: true,
                payments: true,
            },
        });
        return this.sanitizeUser(Object.assign(Object.assign({}, user), { pictureUrl: this.buildPictureUrl(user.profilePicturePath, id) }));
    }
    async findOneByPhone(phoneNumber) {
        return this.databaseService.user.findUniqueOrThrow({
            where: {
                phoneNumber,
            },
        });
    }
    async findAllBasicInfo(where) {
        const users = await this.databaseService.user.findMany({
            select: {
                id: true,
                firstName: true,
                lastName: true,
                profilePicturePath: true,
                role: true,
                courseId: true,
            },
            where: Object.assign(Object.assign({}, where), { role: {
                    in: ['ADMIN', 'TEACHER', 'STUDENT'],
                } }),
        });
        return users.map((user) => {
            return this.sanitizeUser(Object.assign(Object.assign({}, user), { pictureUrl: this.buildPictureUrl(user.profilePicturePath, user.id) }));
        });
    }
    async findUsersByEmails(emails) {
        const users = await this.databaseService.user.findMany({
            where: {
                email: {
                    in: emails,
                },
            },
        });
        if (!users || users.length === 0) {
            throw new common_1.NotFoundException('No users found for the provided emails');
        }
        return users.map((user) => {
            return this.sanitizeUser(Object.assign(Object.assign({}, user), { pictureUrl: this.buildPictureUrl(user.profilePicturePath, user.id) }));
        });
    }
    async updateProfile(updateProfileDto, userId, newImage) {
        var _a, _b;
        const filename = `${userId}${path.extname((newImage === null || newImage === void 0 ? void 0 : newImage.originalname) || '')}`;
        const localFilePath = path.join(this.LOCAL_PROFILE_PICTURE_DIRECTORY, filename);
        const imageUrl = `${this.PROFILE_PICTURE_BASE_URL}/${filename}`;
        try {
            await this.databaseService.$transaction(async (prisma) => {
                if (newImage) {
                    common_1.Logger.log(`Saving new profile picture locally to: ${localFilePath}`);
                    const processedImage = await this.buildProfilePicture(newImage);
                    await fs.mkdir(this.LOCAL_PROFILE_PICTURE_DIRECTORY, {
                        recursive: true,
                    });
                    await fs.writeFile(localFilePath, processedImage.buffer);
                    common_1.Logger.log(`Saving profilePicturePath to database: ${imageUrl}`);
                }
                await prisma.user.update({
                    where: {
                        id: userId,
                    },
                    data: Object.assign(Object.assign({}, updateProfileDto), { profilePicturePath: newImage ? imageUrl : undefined }),
                });
            });
        }
        catch (err) {
            if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (err.code === 'P2025') {
                    throw new common_1.NotFoundException('User not found');
                }
                if (err.code === 'P2002') {
                    if (typeof ((_a = err.meta) === null || _a === void 0 ? void 0 : _a.target) === 'string' &&
                        err.meta.target.includes('phoneNumber')) {
                        throw new common_1.ConflictException('users.PHONE_NUMBER_ALREADY_IN_USE');
                    }
                    if (typeof ((_b = err.meta) === null || _b === void 0 ? void 0 : _b.target) === 'string' &&
                        err.meta.target.includes('idNumber')) {
                        throw new common_1.ConflictException('users.ID_NUMBER_ALREADY_IN_USE');
                    }
                }
                common_1.Logger.error(`Prisma error updating profile: ${err.message}`);
            }
            else if (err instanceof Error) {
                common_1.Logger.error(`Error updating profile: ${err.message}`);
            }
            else {
                common_1.Logger.error(`Unknown error updating profile: ${err}`);
            }
            if (newImage) {
                try {
                    await fs.unlink(localFilePath);
                }
                catch (cleanupError) {
                    common_1.Logger.error(`Error cleaning up local file after update profile error: ${cleanupError instanceof Error
                        ? cleanupError.message
                        : cleanupError}`);
                }
            }
            throw new common_1.InternalServerErrorException("Couldn't update profile, something went wrong on our end");
        }
    }
    async onboardUser(onboardUserDto, profilePic, id) {
        var _a;
        const existingUser = await this.databaseService.user.findUnique({
            where: {
                id,
            },
        });
        if (!existingUser)
            throw new common_1.NotFoundException('User not found');
        if (existingUser.role !== 'NEWUSER') {
            throw new common_1.ConflictException('User already onboarded');
        }
        const filename = `${id}${path.extname(profilePic.originalname || '')}`;
        const localFilePath = path.join(this.LOCAL_PROFILE_PICTURE_DIRECTORY, filename);
        const imageUrl = `${this.PROFILE_PICTURE_BASE_URL}/${filename}`;
        common_1.Logger.log(`Saving new profile picture locally during onboarding to: ${localFilePath}`);
        const processedImage = await this.buildProfilePicture(profilePic);
        try {
            await fs.mkdir(this.LOCAL_PROFILE_PICTURE_DIRECTORY, { recursive: true });
            await fs.writeFile(localFilePath, processedImage.buffer);
            common_1.Logger.log(`Saving profilePicturePath to database: ${imageUrl}`);
            if (onboardUserDto instanceof dto_1.OnboardStudentDto) {
                await this.databaseService.user.update({
                    data: (0, exclude_1.exclude)(Object.assign(Object.assign({}, onboardUserDto), { role: 'AWAITINGSTUDENT', isInClub: (_a = onboardUserDto.joinClub) !== null && _a !== void 0 ? _a : false, profilePicturePath: imageUrl }), ['joinClub']),
                    where: {
                        id,
                    },
                });
            }
            else if (onboardUserDto instanceof dto_1.OnboardTeacherDto) {
                await this.databaseService.user.update({
                    data: Object.assign(Object.assign({}, onboardUserDto), { role: 'AWAITINGTEACHER', profilePicturePath: imageUrl }),
                    where: { id },
                });
            }
            else {
                throw new common_1.InternalServerErrorException("Couldn't onboard user, something went wrong on our end");
            }
        }
        catch (err) {
            if (err instanceof Error) {
                common_1.Logger.error(`Error onboarding user: ${err.message}`);
            }
            else {
                common_1.Logger.error(`Unknown error onboarding user: ${err}`);
            }
            try {
                await fs.unlink(localFilePath);
            }
            catch (cleanupError) {
                common_1.Logger.error(`Error cleaning up local file after onboarding error: ${cleanupError instanceof Error ? cleanupError.message : cleanupError}`);
            }
            throw new common_1.InternalServerErrorException("Couldn't onboard user, something went wrong on our end");
        }
    }
    async changeEmail(changeEmailDto, userId) {
        await this.authService.authenticateIdPassword(userId, changeEmailDto.password);
        const existingUser = await this.databaseService.user.findUnique({
            where: {
                email: changeEmailDto.newEmail,
            },
        });
        if (existingUser)
            throw new common_1.ConflictException('Email already in use');
        const isValid = await this.authService.checkEmailVerificationCode(changeEmailDto.newEmail, changeEmailDto.emailVerificationCode);
        if (!isValid)
            throw new common_1.ConflictException('Invalid email verification code');
        await this.databaseService.user.update({
            where: {
                id: userId,
            },
            data: {
                email: changeEmailDto.newEmail,
            },
        });
    }
    async findAllPublic({ roles, search, pendingTaskId, courseId, createdAt, }) {
        search = (search === null || search === void 0 ? void 0 : search.trim()) || undefined;
        const searchIsFullName = (search === null || search === void 0 ? void 0 : search.split(' ').length) === 2;
        const users = await this.databaseService.user.findMany({
            where: {
                role: roles
                    ? {
                        in: roles,
                    }
                    : undefined,
                events: pendingTaskId
                    ? {
                        none: {
                            event: {
                                predefinedEventId: pendingTaskId,
                            },
                        },
                    }
                    : undefined,
                course: pendingTaskId
                    ? {
                        predefinedEvents: {
                            some: {
                                predefinedEventId: pendingTaskId,
                            },
                        },
                    }
                    : undefined,
                courseId: courseId ? courseId : undefined,
                OR: search
                    ? [
                        searchIsFullName
                            ? {
                                firstName: {
                                    contains: search === null || search === void 0 ? void 0 : search.split(' ')[0],
                                },
                                lastName: {
                                    contains: search === null || search === void 0 ? void 0 : search.split(' ')[1],
                                },
                            }
                            : undefined,
                        {
                            firstName: {
                                contains: search,
                            },
                        },
                        {
                            lastName: {
                                contains: search,
                            },
                        },
                        {
                            email: {
                                contains: search,
                            },
                        },
                        {
                            phoneNumber: {
                                contains: search,
                            },
                        },
                        {
                            phoneNumber: {
                                contains: search,
                            },
                        },
                        {
                            idNumber: {
                                contains: search,
                            },
                        },
                    ].filter(Boolean)
                    : undefined,
            },
            include: {
                payments: {
                    select: {
                        id: true,
                    },
                },
                course: true,
                chats: true,
                events: {
                    include: {
                        event: true,
                    },
                },
            },
            orderBy: {
                createdAt: createdAt !== null && createdAt !== void 0 ? createdAt : 'desc',
            },
        });
        const predefinedEvents = await this.databaseService.predefinedEvent.findMany({
            include: {
                courses: true,
            },
        });
        return users.map((user) => {
            const completedCourseEvents = user.events.filter((userOnEvent) => {
                return (userOnEvent.event.isClub === false && userOnEvent.isCompleted === true);
            });
            const totalCourseEvents = predefinedEvents.filter((predefinedEvent) => {
                return predefinedEvent.courses.some((course) => {
                    return course.courseId === user.courseId;
                });
            });
            const progress = totalCourseEvents.length === 0
                ? 0
                : Math.round((completedCourseEvents.length / totalCourseEvents.length) * 100);
            return this.sanitizeUser(Object.assign(Object.assign({ hasPaid: user.payments.length > 0 }, user), { progress, course: user.course, pictureUrl: this.buildPictureUrl(user.profilePicturePath, user.id) }));
        });
    }
    async findAll(where) {
        const users = await this.databaseService.user.findMany({
            where,
            include: {
                course: true,
                chats: true,
                events: true,
            },
        });
        return users.map((user) => {
            return this.sanitizeUser(Object.assign(Object.assign({}, user), { pictureUrl: this.buildPictureUrl(user.profilePicturePath, user.id) }));
        });
    }
    async updateUser(updateUserDto, userId) {
        const currInfo = await this.databaseService.user.findUniqueOrThrow({
            where: {
                id: userId,
            },
        });
        if (updateUserDto.isInClub !== currInfo.isInClub) {
            await this.databaseService.usersOnEvents.deleteMany({
                where: {
                    userId,
                    event: {
                        isClub: true,
                    },
                },
            });
        }
        if (updateUserDto.courseId !== currInfo.courseId) {
            await this.databaseService.usersOnEvents.deleteMany({
                where: {
                    userId,
                    event: {
                        isClub: false,
                    },
                },
            });
        }
        await this.databaseService.user.update({
            where: {
                id: userId,
            },
            data: updateUserDto,
        });
    }
    async delete(userId) {
        await this.databaseService.$transaction(async (tx) => {
            const user = await tx.user.findUniqueOrThrow({
                where: {
                    id: userId,
                },
            });
            if (user.role === 'ADMIN') {
                throw new common_1.ConflictException('users.CANNOT_DELETE_ADMIN');
            }
            const privateChats = await tx.chat.findMany({
                where: {
                    isGroup: false,
                    users: {
                        some: {
                            userId,
                        },
                    },
                },
            });
            const privateChatIds = privateChats.map((chat) => chat.id);
            if (privateChatIds.length > 0) {
                await tx.chat.deleteMany({
                    where: {
                        id: {
                            in: privateChatIds,
                        },
                    },
                });
            }
            if (user.profilePicturePath) {
                try {
                    const filename = path.basename(user.profilePicturePath);
                    const localFilePath = path.join(this.LOCAL_PROFILE_PICTURE_DIRECTORY, filename);
                    await fs.unlink(localFilePath);
                    common_1.Logger.log(`Deleted local profile picture: ${localFilePath}`);
                }
                catch (error) {
                    common_1.Logger.error(`Error deleting local profile picture ${user.profilePicturePath}: ${error instanceof Error ? error.message : error}`);
                }
            }
            await tx.user.delete({
                where: {
                    id: userId,
                },
            });
        });
    }
    async changePassword(changePasswordDto, userId) {
        await this.authService.authenticateIdPassword(userId, changePasswordDto.oldPassword);
        await this.authService.changePassword(userId, changePasswordDto.newPassword);
    }
    async acceptAwaitingApproval(userId) {
        const user = await this.databaseService.user.findUniqueOrThrow({
            where: {
                id: userId,
            },
        });
        if (user.role !== 'AWAITINGSTUDENT' && user.role !== 'AWAITINGTEACHER') {
            throw new common_1.ConflictException('User is not awaiting approval');
        }
        await this.databaseService.user.update({
            where: {
                id: userId,
            },
            data: {
                role: user.role === 'AWAITINGSTUDENT' ? 'STUDENT' : 'TEACHER',
            },
        });
    }
};
__decorate([
    (0, schedule_1.Cron)(process.env.NODE_ENV === 'production'
        ? schedule_1.CronExpression.EVERY_HOUR
        : schedule_1.CronExpression.EVERY_5_SECONDS),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersService.prototype, "resetExpiredCalendarDeadlines", null);
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService,
        auth_service_1.AuthService,
        config_1.ConfigService])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map