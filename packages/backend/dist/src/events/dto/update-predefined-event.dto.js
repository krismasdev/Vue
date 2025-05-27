"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePredefinedEventDto = void 0;
const openapi = require("@nestjs/swagger");
const create_predefined_event_dto_1 = require("./create-predefined-event.dto");
const mapped_types_1 = require("@nestjs/mapped-types");
class UpdatePredefinedEventDto extends (0, mapped_types_1.PartialType)(create_predefined_event_dto_1.CreatePredefinedEventDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdatePredefinedEventDto = UpdatePredefinedEventDto;
//# sourceMappingURL=update-predefined-event.dto.js.map