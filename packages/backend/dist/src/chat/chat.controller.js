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
exports.ChatController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const chat_service_1 = require("./chat.service");
const create_group_chat_dto_1 = require("./dto/create-group-chat.dto");
const user_decorator_1 = require("../auth/user.decorator");
const auth_decorator_1 = require("../auth/auth.decorator");
const add_members_dto_1 = require("./dto/add-members.dto");
const common_2 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const common_3 = require("@aula-anclademia/common");
const create_private_chat_dto_1 = require("./dto/create-private-chat.dto");
const delete_members_dto_1 = require("./dto/delete-members.dto");
const schedule_1 = require("@nestjs/schedule");
let ChatController = class ChatController {
    constructor(chatService) {
        this.chatService = chatService;
    }
    async cleanUpOrphanedGroupChatPics() {
        const deleted = await this.chatService.deleteOrphanedGroupChatPictures();
        common_1.Logger.log(`Deleted ${deleted} orphaned group chat pictures`);
    }
    async createGroup(createGroupChatDto, user, image) {
        return await this.chatService.createGroupChat(createGroupChatDto, user.id, image);
    }
    createPrivateChat(dto, user) {
        return this.chatService.createPrivateChat({
            creatorId: user.id,
            otherUserId: dto.userId,
        });
    }
    findAll(user) {
        return this.chatService.findAllChatsByUserId(user.id);
    }
    addMembers(addMembersDto, chatId) {
        return this.chatService.addMembers(chatId, addMembersDto.memberIds);
    }
    removeMembers(dto, chatId, user) {
        return this.chatService.removeMembers(chatId, dto.memberIds, user.id);
    }
    getMembers(chatId) {
        return this.chatService.getChatMembers(chatId);
    }
    delete(chatId) {
        return this.chatService.deleteGroupChat(chatId);
    }
    async getMessages(chatId, idCursor) {
        const LIMIT = 10;
        const messages = await this.chatService.getMessages(chatId, idCursor, LIMIT);
        return messages;
    }
    async seeChat(chatId, user) {
        return this.chatService.seeChat(chatId, user.id);
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
], ChatController.prototype, "cleanUpOrphanedGroupChatPics", null);
__decorate([
    (0, auth_decorator_1.Auth)('ADMIN', 'TEACHER'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    (0, common_1.Post)('/groups'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.User)()),
    __param(2, (0, common_1.UploadedFile)(new common_1.ParseFilePipe({
        fileIsRequired: true,
        validators: [
            new common_1.MaxFileSizeValidator({ maxSize: common_3.MAX_PROFILEPIC_FILE_SIZE }),
        ],
    }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_group_chat_dto_1.CreateGroupChatDto, Object, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "createGroup", null);
__decorate([
    (0, auth_decorator_1.Auth)('ADMIN', 'TEACHER', 'STUDENT'),
    (0, common_1.Post)('/private'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_private_chat_dto_1.CreatePrivateChatDto, Object]),
    __metadata("design:returntype", void 0)
], ChatController.prototype, "createPrivateChat", null);
__decorate([
    (0, auth_decorator_1.Auth)('ADMIN', 'TEACHER', 'STUDENT'),
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ChatController.prototype, "findAll", null);
__decorate([
    (0, auth_decorator_1.Auth)('ADMIN', 'TEACHER'),
    (0, common_1.Post)(':id/members'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_2.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [add_members_dto_1.AddMembersDto, String]),
    __metadata("design:returntype", void 0)
], ChatController.prototype, "addMembers", null);
__decorate([
    (0, auth_decorator_1.Auth)('ADMIN', 'TEACHER'),
    (0, common_1.Delete)(':id/members'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_2.Param)('id')),
    __param(2, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [delete_members_dto_1.DeleteMembersDto, String, Object]),
    __metadata("design:returntype", void 0)
], ChatController.prototype, "removeMembers", null);
__decorate([
    (0, auth_decorator_1.Auth)('ADMIN', 'TEACHER', 'STUDENT'),
    (0, common_1.Get)(':id/members'),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_2.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ChatController.prototype, "getMembers", null);
__decorate([
    (0, auth_decorator_1.Auth)('ADMIN', 'TEACHER'),
    (0, common_1.Delete)(':id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_2.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ChatController.prototype, "delete", null);
__decorate([
    (0, auth_decorator_1.Auth)('ADMIN', 'TEACHER', 'STUDENT'),
    (0, common_1.Get)(':id/messages'),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_2.Param)('id')),
    __param(1, (0, common_1.Query)('idCursor')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getMessages", null);
__decorate([
    (0, auth_decorator_1.Auth)('ADMIN', 'TEACHER', 'STUDENT'),
    (0, common_1.Post)(':id/see'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_2.Param)('id')),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "seeChat", null);
ChatController = __decorate([
    (0, auth_decorator_1.Auth)(),
    (0, common_1.Controller)('chats'),
    __metadata("design:paramtypes", [chat_service_1.ChatService])
], ChatController);
exports.ChatController = ChatController;
//# sourceMappingURL=chat.controller.js.map