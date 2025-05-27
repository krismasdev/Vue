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
exports.VideosController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const videos_service_1 = require("./videos.service");
const dto_1 = require("./dto");
const auth_decorator_1 = require("../auth/auth.decorator");
const user_decorator_1 = require("../auth/user.decorator");
let VideosController = class VideosController {
    constructor(videosService) {
        this.videosService = videosService;
    }
    async create(createVideoDto) {
        await this.videosService.create(createVideoDto);
    }
    async findAll(user, courseId) {
        if (!this.videosService.canUserAccessVideos(user, courseId))
            throw new common_1.ForbiddenException();
        return await this.videosService.findAll(courseId);
    }
    async update(id, updateVideoDto) {
        await this.videosService.update(id, updateVideoDto);
    }
    async remove(id) {
        await this.videosService.remove(id);
    }
};
__decorate([
    (0, auth_decorator_1.Auth)('ADMIN', 'TEACHER'),
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateVideoDto]),
    __metadata("design:returntype", Promise)
], VideosController.prototype, "create", null);
__decorate([
    (0, auth_decorator_1.Auth)('ADMIN', 'TEACHER', 'STUDENT'),
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200, type: [require("./response/videos.find-all.response").VideosFindAllResponseItem] }),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Query)('courseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], VideosController.prototype, "findAll", null);
__decorate([
    (0, auth_decorator_1.Auth)('ADMIN', 'TEACHER'),
    (0, common_1.Patch)(':id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateVideoDto]),
    __metadata("design:returntype", Promise)
], VideosController.prototype, "update", null);
__decorate([
    (0, auth_decorator_1.Auth)('ADMIN', 'TEACHER'),
    (0, common_1.Delete)(':id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VideosController.prototype, "remove", null);
VideosController = __decorate([
    (0, common_1.Controller)('videos'),
    __metadata("design:paramtypes", [videos_service_1.VideosService])
], VideosController);
exports.VideosController = VideosController;
//# sourceMappingURL=videos.controller.js.map