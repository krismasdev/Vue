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
exports.CreateEventDto = void 0;
const openapi = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const common_1 = require("@aula-anclademia/common");
const validation_decorators_1 = require("../../common/validation-decorators");
class CreateEventDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { isClub: { required: true, type: () => Boolean }, predefinedEventId: { required: false, type: () => String }, title: { required: false, type: () => String, minLength: common_1.STR_MIN_LENGTH, maxLength: common_1.STR_MAX_LENGTH }, description: { required: false, type: () => String, minLength: common_1.STR_MIN_LENGTH_LONG, maxLength: common_1.STR_MAX_LENGTH_LONG }, color: { required: false, type: () => String }, enableBooking: { required: false, type: () => Boolean }, startDate: { required: true, type: () => Date }, recurrenceEnd: { required: false, type: () => Date }, recurrenceRule: { required: false, type: () => Object }, repeatDays: { required: false, type: () => [Number] }, repeatDates: { required: false, type: () => [Date] }, endDate: { required: true, type: () => Date }, totalSlots: { required: true, type: () => Number, maximum: common_1.EVENT_MAX_SLOTS } };
    }
}
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateEventDto.prototype, "isClub", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.ValidateIf)((o) => !o.isClub),
    __metadata("design:type", String)
], CreateEventDto.prototype, "predefinedEventId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(common_1.STR_MIN_LENGTH),
    (0, class_validator_1.MaxLength)(common_1.STR_MAX_LENGTH),
    (0, class_validator_1.ValidateIf)((o) => o.isClub),
    __metadata("design:type", String)
], CreateEventDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MinLength)(common_1.STR_MIN_LENGTH_LONG),
    (0, class_validator_1.MaxLength)(common_1.STR_MAX_LENGTH_LONG),
    __metadata("design:type", String)
], CreateEventDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "color", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateEventDto.prototype, "enableBooking", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => new Date(value)),
    (0, class_validator_1.IsDate)(),
    (0, class_validator_1.MinDate)(() => new Date(), {
        message: 'events.START_DATE_MUST_BE_IN_THE_FUTURE',
    }),
    __metadata("design:type", Date)
], CreateEventDto.prototype, "startDate", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => new Date(value)),
    (0, class_validator_1.IsDate)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MinDate)(() => new Date(), {
        message: 'events.START_DATE_MUST_BE_IN_THE_FUTURE',
    }),
    __metadata("design:type", Date)
], CreateEventDto.prototype, "recurrenceEnd", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "recurrenceRule", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateEventDto.prototype, "repeatDays", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => value.map((v) => new Date(v))),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateEventDto.prototype, "repeatDates", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => new Date(value)),
    (0, class_validator_1.IsDate)(),
    (0, validation_decorators_1.IsAfterProperty)('startDate', {
        message: 'events.END_DATE_MUST_BE_AFTER_START_DATE',
    }),
    __metadata("design:type", Date)
], CreateEventDto.prototype, "endDate", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Max)(common_1.EVENT_MAX_SLOTS),
    __metadata("design:type", Number)
], CreateEventDto.prototype, "totalSlots", void 0);
exports.CreateEventDto = CreateEventDto;
//# sourceMappingURL=create-event.dto.js.map