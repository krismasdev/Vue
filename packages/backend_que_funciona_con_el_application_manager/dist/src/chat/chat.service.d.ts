/// <reference types="multer" />
import { CreateGroupChatDto } from './dto/create-group-chat.dto';
import { DatabaseService } from 'src/database/database.service';
import { IMessage } from './chat.types';
import { UsersService } from 'src/users/users.service';
import { StorageService } from 'src/storage/storage.service';
import { ConfigService } from '@nestjs/config';
import { Server } from 'socket.io';
import { CreateMessageDto } from './dto';
export declare class ChatService {
    private readonly databaseService;
    private readonly usersService;
    private readonly storageService;
    private readonly configService;
    constructor(databaseService: DatabaseService, usersService: UsersService, storageService: StorageService, configService: ConfigService);
    s3GroupPicturesFolder: string;
    private buildGroupChatPicture;
    private getChatPictureUrl;
    deleteOrphanedGroupChatPictures(): Promise<number>;
    seeChat(chatId: string, userId: string): Promise<void>;
    getSocketsToNotify(server: Server, userIds: string[]): {
        userId: any;
        socketId: string;
    }[];
    deleteGroupChat(chatId: string): Promise<void>;
    findAllChatsByUserId(userId: string): Promise<{
        lastSeenAt: Date;
        id: string;
        name: string;
        pictureUrl: string;
        isGroup: boolean;
        otherUserId: string;
    }[]>;
    findOneById(id: string): Promise<{
        users: ({
            user: {
                firstName: string;
                lastName: string;
                id: string;
                profilePicturePath: string;
            };
        } & import("@prisma/client/runtime").GetResult<{
            chatId: string;
            userId: string;
            lastSeenAt: Date;
        }, unknown, never> & {})[];
    } & import("@prisma/client/runtime").GetResult<{
        id: string;
        name: string;
        pictureS3Key: string;
        isGroup: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, unknown, never> & {}>;
    createMessage(createMessageDto: CreateMessageDto, senderId: string): Promise<{
        id: string;
        chatId: string;
        content: string;
        sender: {
            id: string;
        };
        sentAt: Date;
        deletedAt: Date;
    }>;
    getMessages(chatId: string, idCursor: string, limit?: number): Promise<IMessage[]>;
    createGroupChat(createChatDto: CreateGroupChatDto, creatorId: string, image: Express.Multer.File): Promise<{
        id: string;
    }>;
    createPrivateChat({ creatorId, otherUserId, }: {
        creatorId: string;
        otherUserId: string;
    }): Promise<void>;
    addMembers(chatId: string, memberIds: string[]): Promise<void>;
    removeMembers(chatId: string, memberIds: string[], authedUserId: string): Promise<void>;
    getChatMembers(chatId: string): Promise<Omit<{
        pictureUrl: string;
        id: string;
        firstName: string;
        lastName: string;
        profilePicturePath: string;
        role: import(".prisma/client").Role;
        courseId: string;
    }, "password" | "profilePicturePath">[]>;
    deleteMessage(messageId: string, userId: string): Promise<import("@prisma/client/runtime").GetResult<{
        id: string;
        content: string;
        deletedAt: Date;
        senderId: string;
        chatId: string;
        createdAt: Date;
        updatedAt: Date;
    }, unknown, never> & {}>;
}
