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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const chat_service_1 = require("./chat.service");
const users_service_1 = require("../users/users.service");
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const delete_message_dto_1 = require("./dto/delete-message.dto");
const create_message_dto_1 = require("./dto/create-message.dto");
const socket_io_1 = require("socket.io");
const event_emitter_1 = require("@nestjs/event-emitter");
const chat_1 = require("../event-emitter/chat");
const enums_1 = require("../event-emitter/enums");
const auth_service_1 = require("../auth/auth.service");
const ws_auth_guard_1 = require("../auth/ws-auth.guard");
let ChatGateway = class ChatGateway {
    constructor(chatService, usersService, configService, authService, eventEmitter) {
        this.chatService = chatService;
        this.usersService = usersService;
        this.configService = configService;
        this.authService = authService;
        this.eventEmitter = eventEmitter;
    }
    async disconnectClient(client, reason) {
        client.send({
            message: reason,
            error: true,
        });
        client.disconnect(true);
    }
    async handleConnection(client) {
        var _a;
        try {
            const authCookieName = this.configService.getOrThrow('AUTH_COOKIE_NAME');
            const cookieStr = (_a = client.handshake.headers.cookie) === null || _a === void 0 ? void 0 : _a.split(';').find((c) => c.trim().startsWith(`${authCookieName}=`));
            if (!cookieStr)
                return this.disconnectClient(client, 'No cookie found');
            const parser = (0, cookie_parser_1.default)(this.configService.getOrThrow('COOKIE_SECRET'));
            const req = {
                headers: {
                    cookie: cookieStr,
                },
            };
            parser(req, {}, () => { });
            const authToken = req.signedCookies[authCookieName];
            const userId = await this.authService.getUserIdFromJwt(authToken);
            if (!userId)
                return this.disconnectClient(client, 'Invalid token');
            await this.usersService.findOneById(userId);
            client.data = {
                authToken: authToken,
                userId,
            };
        }
        catch (e) {
            this.disconnectClient(client, 'Unknown error');
        }
    }
    async handleDeleteMessage(deleteMessageDto, client) {
        const userId = client.data.userId;
        const deleted = await this.chatService.deleteMessage(deleteMessageDto.id, userId);
        const chat = await this.chatService.findOneById(deleted.chatId);
        const loggedInUserId = client.data.userId;
        const userIds = chat.users.map((user) => user.userId);
        if (!userIds.includes(loggedInUserId)) {
            throw new Error('User not in chat');
        }
        const socketsToNotify = this.chatService.getSocketsToNotify(this.server, userIds);
        const messageDeleted = {
            id: deleted.id,
            chatId: deleted.chatId,
        };
        socketsToNotify.forEach((userSocket) => {
            this.server.to(userSocket.socketId).emit('deleteMessage', messageDeleted);
        });
    }
    async handleMessageSent(createMessageDto, client) {
        const loggedInUserId = client.data.userId;
        const user = await this.usersService.findOneById(loggedInUserId);
        const chat = await this.chatService.findOneById(createMessageDto.chatId);
        if (!chat.users.map((user) => user.user.id).includes(loggedInUserId)) {
            throw new Error('User not in chat');
        }
        const socketsToNotify = this.chatService.getSocketsToNotify(this.server, chat.users.map((user) => user.user.id));
        const message = await this.chatService.createMessage(createMessageDto, loggedInUserId);
        const messageSent = {
            id: message.id,
            chatId: message.chatId,
            content: message.content,
            sender: {
                id: message.sender.id,
                fullName: `${user.firstName} ${user.lastName}`,
                pictureUrl: user.pictureUrl,
            },
            sentAt: message.sentAt,
            deletedAt: message.deletedAt,
        };
        socketsToNotify.forEach((userSocket) => {
            this.server.to(userSocket.socketId).emit('message', messageSent);
        });
        this.eventEmitter.emit(enums_1.ChatEvents.NEW_MESSAGE, new chat_1.NewMessageEvent(message.id));
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('deleteMessage'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [delete_message_dto_1.DeleteMessageDto, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleDeleteMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('message'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_message_dto_1.CreateMessageDto, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleMessageSent", null);
ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        transport: ['websocket', 'polling'],
        cors: {
            origin: [process.env.CORS_ORIGIN_1, process.env.CORS_ORIGIN_2],
            credentials: true,
        },
    }),
    (0, common_1.UseGuards)(ws_auth_guard_1.WsJwtGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({
        forbidNonWhitelisted: true,
        whitelist: true,
    })),
    __metadata("design:paramtypes", [chat_service_1.ChatService,
        users_service_1.UsersService,
        config_1.ConfigService,
        auth_service_1.AuthService,
        event_emitter_1.EventEmitter2])
], ChatGateway);
exports.ChatGateway = ChatGateway;
//# sourceMappingURL=chat.gateway.js.map