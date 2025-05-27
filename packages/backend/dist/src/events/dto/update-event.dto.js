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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateEventDto = void 0;
const openapi = require("@nestjs/swagger");
const mapped_types_1 = require("@nestjs/mapped-types");
const create_event_dto_1 = require("./create-event.dto");
const class_validator_1 = require("class-validator");
const common_1 = require("@aula-anclademia/common");
class UpdateEventDto extends (0, mapped_types_1.PickType)(create_event_dto_1.CreateEventDto, [
    'endDate',
    'startDate',
    'description',
    'totalSlots',
    'enableBooking',
    'color',
]) {
    static _OPENAPI_METADATA_FACTORY() {
        return { title: { required: false, type: () => String, minLength: common_1.STR_MIN_LENGTH, maxLength: common_1.STR_MAX_LENGTH } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MinLength)(common_1.STR_MIN_LENGTH),
    (0, class_validator_1.MaxLength)(common_1.STR_MAX_LENGTH),
    __metadata("design:type", String)
], UpdateEventDto.prototype, "title", void 0);
exports.UpdateEventDto = UpdateEventDto;
//# sourceMappingURL=update-event.dto.js.map