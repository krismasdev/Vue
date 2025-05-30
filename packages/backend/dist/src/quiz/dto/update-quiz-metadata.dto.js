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
exports.UpdateQuizMetadataDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const create_quiz_dto_1 = require("./create-quiz.dto");
const common_1 = require("@aula-anclademia/common");
class UpdateQuizMetadataDto extends create_quiz_dto_1.CreateQuizDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { nQuestionsPerAttempt: { required: true, type: () => Number, minimum: common_1.QUIZ_MIN_QUESTIONS_ATTEMPT, maximum: common_1.QUIZ_MAX_QUESTIONS_ATTEMPT } };
    }
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(common_1.QUIZ_MIN_QUESTIONS_ATTEMPT),
    (0, class_validator_1.Max)(common_1.QUIZ_MAX_QUESTIONS_ATTEMPT),
    __metadata("design:type", Number)
], UpdateQuizMetadataDto.prototype, "nQuestionsPerAttempt", void 0);
exports.UpdateQuizMetadataDto = UpdateQuizMetadataDto;
//# sourceMappingURL=update-quiz-metadata.dto.js.map