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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
const users_service_1 = require("../users/users.service");
const storage_service_1 = require("../storage/storage.service");
const config_1 = require("@nestjs/config");
const sharp_1 = __importDefault(require("sharp"));
const uuid_1 = require("uuid");
let ChatService = class ChatService {
    constructor(databaseService, usersService, storageService, configService) {
        this.databaseService = databaseService;
        this.usersService = usersService;
        this.storageService = storageService;
        this.configService = configService;
        this.s3GroupPicturesFolder = 'chat-group-pictures';
    }
    async buildGroupChatPicture(image) {
        const resizedImage = await (0, sharp_1.default)(image.buffer)
            .resize({ width: 150, height: 150 })
            .withMetadata()
            .toBuffer();
        const resizedFile = Object.assign(Object.assign({}, image), { buffer: resizedImage, size: resizedImage.length });
        return resizedFile;
    }
    async getChatPictureUrl(chat, loggedInUserId) {
        var _a, _b;
        if (!chat.isGroup) {
            const chatUsers = await this.databaseService.user.findMany({
                where: {
                    chats: {
                        some: {
                            chatId: chat.id,
                        },
                    },
                },
            });
            const otherUser = chatUsers.find((user) => user.id !== loggedInUserId);
            return this.usersService.buildPictureUrl((_a = otherUser === null || otherUser === void 0 ? void 0 : otherUser.profilePicturePath) !== null && _a !== void 0 ? _a : null, (_b = otherUser === null || otherUser === void 0 ? void 0 : otherUser.id) !== null && _b !== void 0 ? _b : null);
        }
        else {
            if (!chat.pictureS3Key) {
                return null;
            }
            const s3Url = this.configService.getOrThrow('S3_PUBLIC_URL');
            return `${s3Url}/${chat.pictureS3Key}`;
        }
    }
    async deleteOrphanedGroupChatPictures() {
        const chats = await this.databaseService.chat.findMany({
            where: {
                isGroup: true,
            },
            select: {
                pictureS3Key: true,
            },
        });
        const allS3Keys = await this.storageService
            .listObjects({
            Bucket: this.configService.getOrThrow('S3_PUBLIC_BUCKET_NAME'),
            Prefix: this.s3GroupPicturesFolder,
        })
            .then((res) => { var _a; return (_a = res.Contents) === null || _a === void 0 ? void 0 : _a.map((obj) => obj.Key); });
        if (!allS3Keys || allS3Keys.length === 0) {
            return 0;
        }
        const s3KeysToDelete = allS3Keys.filter((s3Key) => !chats.some((chat) => chat.pictureS3Key === s3Key));
        if (s3KeysToDelete.length === 0) {
            return 0;
        }
        await this.storageService.deleteObjects({
            Bucket: this.configService.getOrThrow('S3_PUBLIC_BUCKET_NAME'),
            Delete: {
                Objects: s3KeysToDelete.map((s3Key) => ({ Key: s3Key })),
            },
        });
        return s3KeysToDelete.length;
    }
    async seeChat(chatId, userId) {
        await this.databaseService.chatsOnUsers.update({
            where: {
                chatId_userId: {
                    userId,
                    chatId,
                },
            },
            data: {
                lastSeenAt: new Date(),
            },
        });
    }
    getSocketsToNotify(server, userIds) {
        const userSocketPair = Array.from(server.sockets.sockets.values()).map((socket) => {
            return {
                userId: socket.data.userId,
                socketId: socket.id,
            };
        });
        const chatsToNotify = userSocketPair.filter((pair) => {
            return userIds.includes(pair.userId);
        });
        return chatsToNotify;
    }
    async deleteGroupChat(chatId) {
        await this.databaseService.$transaction(async (tx) => {
            const chat = await tx.chat.findUniqueOrThrow({
                where: {
                    id: chatId,
                },
            });
            if (!chat.isGroup) {
                throw new common_1.BadRequestException('Chat is not a group. Cannot delete');
            }
            const s3Params = {
                Bucket: this.configService.getOrThrow('S3_PUBLIC_BUCKET_NAME'),
                Key: chat.pictureS3Key,
            };
            if (s3Params.Key) {
                await this.storageService.deleteObject(s3Params);
            }
            await tx.message.deleteMany({
                where: {
                    chatId,
                },
            });
            await tx.chat.delete({
                where: {
                    id: chatId,
                },
            });
        });
    }
    async findAllChatsByUserId(userId) {
        const chats = await this.databaseService.chat.findMany({
            where: {
                users: {
                    some: {
                        userId,
                    },
                },
            },
            include: {
                users: {
                    include: {
                        user: true,
                    },
                },
            },
        });
        const promises = chats.map(async (chat) => {
            var _a, _b;
            const pictureUrl = await this.getChatPictureUrl(chat, userId);
            return {
                lastSeenAt: chat.users.find((relation) => relation.userId === userId)
                    .lastSeenAt,
                id: chat.id,
                name: chat.isGroup
                    ? chat.name
                    : chat.users.find((relation) => relation.userId !== userId).user
                        .firstName +
                        ' ' +
                        chat.users.find((relation) => relation.userId !== userId).user
                            .lastName,
                pictureUrl,
                isGroup: chat.isGroup,
                otherUserId: chat.isGroup
                    ? null
                    : (_b = (_a = chat.users.find((relation) => relation.userId !== userId)) === null || _a === void 0 ? void 0 : _a.user.id) !== null && _b !== void 0 ? _b : null,
            };
        });
        return await Promise.all(promises);
    }
    async findOneById(id) {
        return await this.databaseService.chat.findUnique({
            where: {
                id,
            },
            include: {
                users: {
                    include: {
                        user: {
                            select: {
                                firstName: true,
                                lastName: true,
                                id: true,
                                profilePicturePath: true,
                            },
                        },
                    },
                },
            },
        });
    }
    async createMessage(createMessageDto, senderId) {
        const message = await this.databaseService.message.create({
            data: {
                content: createMessageDto.text,
                chatId: createMessageDto.chatId,
                senderId,
            },
        });
        return {
            id: message.id,
            chatId: message.chatId,
            content: message.content,
            sender: {
                id: message.senderId,
            },
            sentAt: message.createdAt,
            deletedAt: message.deletedAt,
        };
    }
    async getMessages(chatId, idCursor, limit = 10) {
        const messages = await this.databaseService.message.findMany({
            take: limit,
            skip: idCursor ? 1 : 0,
            where: {
                chatId,
            },
            select: {
                deletedAt: true,
                createdAt: true,
                id: true,
                content: true,
                senderId: true,
                sender: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                        id: true,
                        profilePicturePath: true,
                    },
                },
            },
            orderBy: [
                {
                    createdAt: 'desc',
                },
                {
                    id: 'desc',
                },
            ],
            cursor: idCursor
                ? {
                    id: idCursor,
                }
                : undefined,
        });
        return messages.map((message) => ({
            id: message.id,
            chatId,
            content: message.content,
            sender: {
                id: message.senderId,
                fullName: `${message.sender.firstName} ${message.sender.lastName}`,
                pictureUrl: this.usersService.buildPictureUrl(message.sender.profilePicturePath, message.sender.id),
            },
            sentAt: message.createdAt,
            deletedAt: message.deletedAt,
        }));
    }
    async createGroupChat(createChatDto, creatorId, image) {
        const createdChat = await this.databaseService.$transaction(async (tx) => {
            var _a, _b;
            image = await this.buildGroupChatPicture(image);
            const s3Params = {
                Bucket: this.configService.getOrThrow('S3_PUBLIC_BUCKET_NAME'),
                Key: `${this.s3GroupPicturesFolder}/${(0, uuid_1.v4)()}`,
                Body: image.buffer,
            };
            await this.storageService.putObject(s3Params);
            const createManyData = [
                {
                    userId: creatorId,
                },
                ...((_b = (_a = createChatDto.userIds) === null || _a === void 0 ? void 0 : _a.map((userId) => ({
                    userId,
                }))) !== null && _b !== void 0 ? _b : []),
            ];
            return tx.chat.create({
                data: {
                    isGroup: true,
                    pictureS3Key: s3Params.Key,
                    name: createChatDto.name,
                    users: {
                        createMany: {
                            data: createManyData,
                        },
                    },
                },
            });
        });
        return {
            id: createdChat.id,
        };
    }
    async createPrivateChat({ creatorId, otherUserId, }) {
        if (creatorId === otherUserId) {
            throw new common_1.BadRequestException('Cannot create chat with yourself');
        }
        const already = await this.databaseService.chat.findFirst({
            where: {
                AND: [
                    {
                        isGroup: false,
                    },
                    {
                        users: {
                            some: {
                                userId: creatorId,
                            },
                        },
                    },
                    {
                        users: {
                            some: {
                                userId: otherUserId,
                            },
                        },
                    },
                ],
            },
        });
        if (already) {
            throw new common_1.BadRequestException('Chat already exists');
        }
        await this.databaseService.chat.create({
            data: {
                isGroup: false,
                users: {
                    createMany: {
                        data: [
                            {
                                userId: creatorId,
                            },
                            {
                                userId: otherUserId,
                            },
                        ],
                    },
                },
                name: '__private__' + creatorId + '__' + otherUserId,
            },
        });
    }
    async addMembers(chatId, memberIds) {
        const chat = await this.databaseService.chat.findUnique({
            where: {
                id: chatId,
            },
            include: {
                users: true,
            },
        });
        if (!chat) {
            throw new common_1.BadRequestException('Chat not found');
        }
        if (!chat.isGroup) {
            throw new common_1.BadRequestException('Chat is not a group');
        }
        const alreadyMemberIds = chat.users.map((relation) => relation.userId);
        await this.databaseService.chat.update({
            where: {
                id: chatId,
            },
            data: {
                users: {
                    createMany: {
                        data: [
                            ...memberIds
                                .filter((memberId) => !alreadyMemberIds.includes(memberId))
                                .map((memberId) => ({
                                userId: memberId,
                            })),
                        ],
                    },
                },
            },
        });
    }
    async removeMembers(chatId, memberIds, authedUserId) {
        if (memberIds.includes(authedUserId)) {
            throw new common_1.BadRequestException('Cannot remove yourself');
        }
        const isMember = await this.databaseService.chat.findFirst({
            where: {
                id: chatId,
                users: {
                    some: {
                        userId: authedUserId,
                    },
                },
            },
        });
        if (!isMember) {
            throw new common_1.ForbiddenException('Cannot remove members. You are not in chat');
        }
        const chat = await this.databaseService.chat.findUniqueOrThrow({
            where: {
                id: chatId,
            },
            include: {
                users: true,
            },
        });
        if (!chat.isGroup) {
            throw new common_1.BadRequestException('Chat is not a group. Cannot remove members');
        }
        const alreadyMemberIds = chat.users.map((relation) => relation.userId);
        await this.databaseService.chat.update({
            where: {
                id: chatId,
            },
            data: {
                users: {
                    deleteMany: {
                        userId: {
                            in: memberIds.filter((memberId) => alreadyMemberIds.includes(memberId)),
                        },
                    },
                },
            },
        });
    }
    async getChatMembers(chatId) {
        return await this.usersService.findAllBasicInfo({
            chats: {
                some: {
                    chatId,
                },
            },
        });
    }
    async deleteMessage(messageId, userId) {
        const message = await this.databaseService.message.findFirst({
            where: {
                id: messageId,
                sender: {
                    id: userId,
                },
            },
        });
        if (!message) {
            throw new common_1.ForbiddenException('Cannot delete message. You are not sender');
        }
        if (message.deletedAt) {
            throw new common_1.ConflictException('Message was already deleted');
        }
        const chat = await this.databaseService.chat.findFirstOrThrow({
            where: {
                id: message.chatId,
                users: {
                    some: {
                        userId,
                    },
                },
            },
        });
        if (!chat) {
            throw new common_1.ForbiddenException('Cannot delete message. You are not in the chat');
        }
        return await this.databaseService.message.update({
            where: {
                id: messageId,
            },
            data: {
                deletedAt: new Date(),
                content: '',
            },
        });
    }
};
ChatService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService,
        users_service_1.UsersService,
        storage_service_1.StorageService,
        config_1.ConfigService])
], ChatService);
exports.ChatService = ChatService;
//# sourceMappingURL=chat.service.js.map