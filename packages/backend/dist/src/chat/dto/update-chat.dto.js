"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateChatDto = void 0;
const openapi = require("@nestjs/swagger");
const mapped_types_1 = require("@nestjs/mapped-types");
const create_group_chat_dto_1 = require("./create-group-chat.dto");
class UpdateChatDto extends (0, mapped_types_1.PartialType)(create_group_chat_dto_1.CreateGroupChatDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number } };
    }
}
exports.UpdateChatDto = UpdateChatDto;
//# sourceMappingURL=update-chat.dto.js.map