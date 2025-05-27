import { CreateGroupChatDto } from './create-group-chat.dto';
declare const UpdateChatDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateGroupChatDto>>;
export declare class UpdateChatDto extends UpdateChatDto_base {
    id: number;
}
export {};
