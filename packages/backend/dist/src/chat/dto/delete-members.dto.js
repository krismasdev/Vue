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
exports.DeleteMembersDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class DeleteMembersDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { memberIds: { required: true, type: () => [String] } };
    }
}
__decorate([
    (0, class_validator_1.IsString)({
        each: true,
    }),
    __metadata("design:type", Array)
], DeleteMembersDto.prototype, "memberIds", void 0);
exports.DeleteMembersDto = DeleteMembersDto;
//# sourceMappingURL=delete-members.dto.js.map