import { OnGatewayConnection } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { UsersService } from 'src/users/users.service';
import { CustomSocket } from './chat.types';
import { ConfigService } from '@nestjs/config';
import { DeleteMessageDto } from './dto/delete-message.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { Server } from 'socket.io';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AuthService } from 'src/auth/auth.service';
export declare class ChatGateway implements OnGatewayConnection {
    private readonly chatService;
    private readonly usersService;
    private readonly configService;
    private readonly authService;
    private readonly eventEmitter;
    constructor(chatService: ChatService, usersService: UsersService, configService: ConfigService, authService: AuthService, eventEmitter: EventEmitter2);
    server: Server;
    private disconnectClient;
    handleConnection(client: CustomSocket): Promise<void>;
    handleDeleteMessage(deleteMessageDto: DeleteMessageDto, client: CustomSocket): Promise<void>;
    handleMessageSent(createMessageDto: CreateMessageDto, client: CustomSocket): Promise<void>;
}
