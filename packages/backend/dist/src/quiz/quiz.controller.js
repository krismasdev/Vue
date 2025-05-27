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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const quiz_service_1 = require("./quiz.service");
const create_quiz_dto_1 = require("./dto/create-quiz.dto");
const update_quiz_questions_dto_1 = require("./dto/update-quiz-questions.dto");
const update_quiz_metadata_dto_1 = require("./dto/update-quiz-metadata.dto");
const platform_express_1 = require("@nestjs/platform-express");
const auth_decorator_1 = require("../auth/auth.decorator");
const common_2 = require("@aula-anclademia/common");
const user_decorator_1 = require("../auth/user.decorator");
const quiz_find_all_permissions_guard_1 = require("./guards/quiz-find-all-permissions.guard");
let QuizController = class QuizController {
    constructor(quizService) {
        this.quizService = quizService;
    }
    async create(createFileDto, excelFile) {
        this.quizService.validateQuizMimeType(excelFile);
        await this.quizService.create(createFileDto, excelFile);
    }
    async findAll(user, courseId) {
        return await this.quizService.findAll(courseId);
    }
    async findOne(id) {
        return await this.quizService.findOne(id);
    }
    async getWithRandomQuestions(id) {
        return await this.quizService.getWithRandomQuestions(id);
    }
    async updateQuestions(id, dto) {
        await this.quizService.updateQuestions(id, dto);
    }
    async updateMetadata(id, dto) {
        await this.quizService.updateMetadata(id, dto);
    }
    async submit(user) {
        await this.quizService.addQuizSubmission(user.id);
    }
    async remove(id) {
        await this.quizService.remove(id);
    }
};
__decorate([
    (0, auth_decorator_1.Auth)('ADMIN', 'TEACHER'),
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('excelFile')),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)(new common_1.ParseFilePipe({
        fileIsRequired: true,
        validators: [new common_1.MaxFileSizeValidator({ maxSize: common_2.MAX_QUIZ_FILE_SIZE })],
    }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_quiz_dto_1.CreateQuizDto, Object]),
    __metadata("design:returntype", Promise)
], QuizController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(quiz_find_all_permissions_guard_1.QuizFindAllPermissionsGuard),
    (0, auth_decorator_1.Auth)('STUDENT', 'ADMIN', 'TEACHER'),
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200, type: require("./response/quiz-find-all.response").QuizFindAllResponse }),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Query)('courseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], QuizController.prototype, "findAll", null);
__decorate([
    (0, auth_decorator_1.Auth)('ADMIN', 'TEACHER'),
    (0, common_1.Get)(':id'),
    openapi.ApiResponse({ status: 200, type: require("./response/quiz-find-one.response").QuizFindOneResponse }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QuizController.prototype, "findOne", null);
__decorate([
    (0, auth_decorator_1.Auth)('ADMIN', 'TEACHER', 'STUDENT'),
    (0, common_1.Get)(':id/random-questions'),
    openapi.ApiResponse({ status: 200, type: require("./response/quiz-random-questions.response").QuizRandomQuestionsResponse }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QuizController.prototype, "getWithRandomQuestions", null);
__decorate([
    (0, auth_decorator_1.Auth)('ADMIN', 'TEACHER'),
    (0, common_1.Patch)(':id/questions'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_quiz_questions_dto_1.UpdateQuizQuestionsDto]),
    __metadata("design:returntype", Promise)
], QuizController.prototype, "updateQuestions", null);
__decorate([
    (0, auth_decorator_1.Auth)('ADMIN', 'TEACHER'),
    (0, common_1.Patch)(':id/metadata'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_quiz_metadata_dto_1.UpdateQuizMetadataDto]),
    __metadata("design:returntype", Promise)
], QuizController.prototype, "updateMetadata", null);
__decorate([
    (0, auth_decorator_1.Auth)('STUDENT'),
    (0, common_1.Post)('submit'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], QuizController.prototype, "submit", null);
__decorate([
    (0, auth_decorator_1.Auth)('ADMIN', 'TEACHER'),
    (0, common_1.Delete)(':id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QuizController.prototype, "remove", null);
QuizController = __decorate([
    (0, common_1.Controller)('quizzes'),
    __metadata("design:paramtypes", [quiz_service_1.QuizService])
], QuizController);
exports.QuizController = QuizController;
//# sourceMappingURL=quiz.controller.js.map