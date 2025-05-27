/// <reference types="multer" />
import { ChatService } from './chat.service';
import { CreateGroupChatDto } from './dto/create-group-chat.dto';
import { User as IUser } from '@prisma/client';
import { AddMembersDto } from './dto/add-members.dto';
import { IMessage } from './chat.types';
import { CreatePrivateChatDto } from './dto/create-private-chat.dto';
import { DeleteMembersDto } from './dto/delete-members.dto';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    cleanUpOrphanedGroupChatPics(): Promise<void>;
    createGroup(createGroupChatDto: CreateGroupChatDto, user: IUser, image: Express.Multer.File): Promise<{
        id: string;
    }>;
    createPrivateChat(dto: CreatePrivateChatDto, user: IUser): Promise<void>;
    findAll(user: IUser): Promise<{
        lastSeenAt: Date;
        id: string;
        name: string;
        pictureUrl: string;
        isGroup: boolean;
        otherUserId: string;
    }[]>;
    addMembers(addMembersDto: AddMembersDto, chatId: string): Promise<void>;
    removeMembers(dto: DeleteMembersDto, chatId: string, user: IUser): Promise<void>;
    getMembers(chatId: string): Promise<Omit<{
        pictureUrl: string;
        id: string;
        firstName: string;
        lastName: string;
        profilePicturePath: string;
        role: import(".prisma/client").Role;
        courseId: string;
    }, "password" | "profilePicturePath">[]>;
    delete(chatId: string): Promise<void>;
    getMessages(chatId: string, idCursor: string): Promise<IMessage[]>;
    seeChat(chatId: string, user: IUser): Promise<void>;
}
