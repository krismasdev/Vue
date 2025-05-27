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
exports.CreateVideoDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const common_1 = require("@aula-anclademia/common");
const class_transformer_1 = require("class-transformer");
class CreateVideoDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { url: { required: true, type: () => String }, title: { required: true, type: () => String, minLength: common_1.STR_MIN_LENGTH, maxLength: common_1.STR_MAX_LENGTH }, courseIds: { required: true, type: () => [String] }, date: { required: true, type: () => Date } };
    }
}
__decorate([
    (0, class_validator_1.IsUrl)(),
    (0, class_transformer_1.Transform)(({ value }) => value.trim()),
    __metadata("design:type", String)
], CreateVideoDto.prototype, "url", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(common_1.STR_MIN_LENGTH),
    (0, class_validator_1.MaxLength)(common_1.STR_MAX_LENGTH),
    (0, class_transformer_1.Transform)(({ value }) => value.trim()),
    __metadata("design:type", String)
], CreateVideoDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.ArrayMinSize)(1),
    __metadata("design:type", Array)
], CreateVideoDto.prototype, "courseIds", void 0);
__decorate([
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Transform)(({ value }) => new Date(value)),
    __metadata("design:type", Date)
], CreateVideoDto.prototype, "date", void 0);
exports.CreateVideoDto = CreateVideoDto;
//# sourceMappingURL=create-video.dto.js.map