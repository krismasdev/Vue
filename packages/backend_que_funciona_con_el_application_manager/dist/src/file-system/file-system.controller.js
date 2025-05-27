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
exports.FileSystemController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const file_system_service_1 = require("./file-system.service");
const create_file_dto_1 = require("./dto/create-file.dto");
const platform_express_1 = require("@nestjs/platform-express");
const common_2 = require("@nestjs/common");
const create_folder_dto_1 = require("./dto/create-folder.dto");
const update_file_dto_1 = require("./dto/update-file.dto");
const update_folder_dto_1 = require("./dto/update-folder.dto");
const common_3 = require("@aula-anclademia/common");
const auth_decorator_1 = require("../auth/auth.decorator");
const user_decorator_1 = require("../auth/user.decorator");
const schedule_1 = require("@nestjs/schedule");
let FileSystemController = class FileSystemController {
    constructor(fileSystemService) {
        this.fileSystemService = fileSystemService;
    }
    async cleanUpOrphanedFiles() {
        const deleted = await this.fileSystemService.deleteOrphanedFiles();
        common_1.Logger.log(`Deleted ${deleted} orphaned files from S3`);
    }
    async createFile(folderId, createFileDto, file) {
        this.fileSystemService.validateMimeType(common_3.VALID_FILESYSTEM_MIMETYPES, file);
        await this.fileSystemService.createFile(createFileDto, folderId, file);
    }
    async createMultipleFiles(folderId, files) {
        files.forEach((file) => {
            this.fileSystemService.validateMimeType(common_3.VALID_FILESYSTEM_MIMETYPES, file);
        });
        await this.fileSystemService.createMultipleFiles(folderId, files);
    }
    async updateFolder(folderId, updateFolderDto) {
        await this.fileSystemService.updateFolder(folderId, updateFolderDto);
    }
    async createFolder(createFolderDto, folderId) {
        await this.fileSystemService.createFolder(createFolderDto, folderId);
    }
    async getFolderContent(folderId, user) {
        const canAccess = await this.fileSystemService.checkUserAccessToFolder(user, folderId);
        if (!canAccess)
            throw new common_1.ForbiddenException();
        return await this.fileSystemService.getFolderContent(folderId);
    }
    async removeFolder(id) {
        await this.fileSystemService.removeFolder(id);
    }
    async updateFile(id, updateFileDto) {
        await this.fileSystemService.updateFile(id, updateFileDto);
    }
    async remove(id) {
        await this.fileSystemService.removeFile(id);
    }
    async generateSignedUrl(id) {
        return await this.fileSystemService.generateDownloadUrl(id);
    }
};
__decorate([
    (0, schedule_1.Cron)(process.env.NODE_ENV === 'production'
        ? schedule_1.CronExpression.EVERY_DAY_AT_4AM
        : schedule_1.CronExpression.EVERY_5_SECONDS),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FileSystemController.prototype, "cleanUpOrphanedFiles", null);
__decorate([
    (0, auth_decorator_1.Auth)('ADMIN', 'TEACHER'),
    (0, common_1.Post)('folders/:folderId/files'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('folderId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_2.UploadedFile)(new common_1.ParseFilePipe({
        fileIsRequired: true,
        validators: [
            new common_1.MaxFileSizeValidator({ maxSize: common_3.MAX_FILESYSTEM_FILE_SIZE }),
        ],
    }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_file_dto_1.CreateFileDto, Object]),
    __metadata("design:returntype", Promise)
], FileSystemController.prototype, "createFile", null);
__decorate([
    (0, auth_decorator_1.Auth)('ADMIN', 'TEACHER'),
    (0, common_1.Post)('folders/:folderId/files/multiple'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 20)),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('folderId')),
    __param(1, (0, common_1.UploadedFiles)(new common_1.ParseFilePipe({
        fileIsRequired: true,
        validators: [
            new common_1.MaxFileSizeValidator({ maxSize: common_3.MAX_FILESYSTEM_FILE_SIZE }),
        ],
    }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], FileSystemController.prototype, "createMultipleFiles", null);
__decorate([
    (0, auth_decorator_1.Auth)('ADMIN', 'TEACHER'),
    (0, common_1.Patch)('folders/:folderId'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('folderId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_folder_dto_1.UpdateFolderDto]),
    __metadata("design:returntype", Promise)
], FileSystemController.prototype, "updateFolder", null);
__decorate([
    (0, auth_decorator_1.Auth)('ADMIN', 'TEACHER'),
    (0, common_1.Post)('folders/:folderId/folders'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('folderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_folder_dto_1.CreateFolderDto, String]),
    __metadata("design:returntype", Promise)
], FileSystemController.prototype, "createFolder", null);
__decorate([
    (0, auth_decorator_1.Auth)('ADMIN', 'TEACHER', 'STUDENT'),
    (0, common_1.Get)('folders/:folderId'),
    openapi.ApiResponse({ status: 200, type: require("./response/get-folder-content.response").GetFolderContentResponse }),
    __param(0, (0, common_1.Param)('folderId')),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FileSystemController.prototype, "getFolderContent", null);
__decorate([
    (0, auth_decorator_1.Auth)('ADMIN', 'TEACHER'),
    (0, common_1.Delete)('folders/:id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FileSystemController.prototype, "removeFolder", null);
__decorate([
    (0, auth_decorator_1.Auth)('ADMIN', 'TEACHER'),
    (0, common_1.Patch)('files/:id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_file_dto_1.UpdateFileDto]),
    __metadata("design:returntype", Promise)
], FileSystemController.prototype, "updateFile", null);
__decorate([
    (0, auth_decorator_1.Auth)('ADMIN', 'TEACHER'),
    (0, common_1.Delete)('files/:id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FileSystemController.prototype, "remove", null);
__decorate([
    (0, auth_decorator_1.Auth)('ADMIN', 'TEACHER', 'STUDENT'),
    (0, common_1.Get)('files/:id/download'),
    openapi.ApiResponse({ status: 200, type: String }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FileSystemController.prototype, "generateSignedUrl", null);
FileSystemController = __decorate([
    (0, common_1.Controller)('/file-system'),
    __metadata("design:paramtypes", [file_system_service_1.FileSystemService])
], FileSystemController);
exports.FileSystemController = FileSystemController;
//# sourceMappingURL=file-system.controller.js.map