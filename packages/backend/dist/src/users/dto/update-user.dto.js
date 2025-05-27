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
exports.UpdateUserDto = void 0;
const openapi = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const common_1 = require("@aula-anclademia/common");
class UpdateUserDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { firstName: { required: true, type: () => String, minLength: common_1.STR_MIN_LENGTH, maxLength: common_1.STR_MAX_LENGTH }, lastName: { required: true, type: () => String, minLength: common_1.STR_MIN_LENGTH, maxLength: common_1.STR_MAX_LENGTH }, phoneNumber: { required: true, type: () => String }, birthDate: { required: true, type: () => Date }, address: { required: true, type: () => String, minLength: common_1.STR_MIN_LENGTH, maxLength: common_1.STR_MAX_LENGTH }, zipCode: { required: true, type: () => String, minLength: common_1.STR_MIN_LENGTH, maxLength: common_1.STR_MAX_LENGTH }, city: { required: true, type: () => String, minLength: common_1.STR_MIN_LENGTH, maxLength: common_1.STR_MAX_LENGTH }, idNumber: { required: true, type: () => String, minLength: common_1.STR_MIN_LENGTH, maxLength: common_1.STR_MAX_LENGTH }, idIssueDate: { required: true, type: () => Date }, courseId: { required: true, type: () => String }, isInClub: { required: true, type: () => Boolean } };
    }
}
__decorate([
    (0, class_validator_1.MinLength)(common_1.STR_MIN_LENGTH),
    (0, class_validator_1.MaxLength)(common_1.STR_MAX_LENGTH),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value.trim()),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.MinLength)(common_1.STR_MIN_LENGTH),
    (0, class_validator_1.MaxLength)(common_1.STR_MAX_LENGTH),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value.trim()),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "lastName", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => value.replaceAll(' ', '')),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsPhoneNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value.trim()),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "phoneNumber", void 0);
__decorate([
    (0, class_validator_1.IsDate)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => new Date(value)),
    (0, class_validator_1.MaxDate)(() => new Date(Date.now() - 16 * 365 * 24 * 60 * 60 * 1000), {
        message: 'users.AT_LEAST_16_YEARS',
    }),
    __metadata("design:type", Date)
], UpdateUserDto.prototype, "birthDate", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => value.trim()),
    (0, class_validator_1.MinLength)(common_1.STR_MIN_LENGTH),
    (0, class_validator_1.MaxLength)(common_1.STR_MAX_LENGTH),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "address", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => value.trim()),
    (0, class_validator_1.MinLength)(common_1.STR_MIN_LENGTH),
    (0, class_validator_1.MaxLength)(common_1.STR_MAX_LENGTH),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "zipCode", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => value.trim()),
    (0, class_validator_1.MinLength)(common_1.STR_MIN_LENGTH),
    (0, class_validator_1.MaxLength)(common_1.STR_MAX_LENGTH),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "city", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => value.trim()),
    (0, class_validator_1.MinLength)(common_1.STR_MIN_LENGTH),
    (0, class_validator_1.MaxLength)(common_1.STR_MAX_LENGTH),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "idNumber", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => new Date(value)),
    (0, class_validator_1.IsDate)(),
    (0, class_validator_1.MaxDate)(() => new Date(), {
        message: 'users.ID_BEFORE_TODAY',
    }),
    (0, class_validator_1.MinDate)(() => new Date(Date.now() - 10 * 365 * 24 * 60 * 60 * 1000), {
        message: 'users.ID_LAST_10_YEARS',
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], UpdateUserDto.prototype, "idIssueDate", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "courseId", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateUserDto.prototype, "isInClub", void 0);
exports.UpdateUserDto = UpdateUserDto;
//# sourceMappingURL=update-user.dto.js.map